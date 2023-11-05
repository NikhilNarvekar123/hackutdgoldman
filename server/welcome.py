import re
import threading
from elevenlabs import generate, set_api_key, save, stream
from util.model import Model
from mongo import Mongo
from typing import Callable, AsyncGenerator, List, Any

from util.config import Config

set_api_key(Config.ELEVENLABS_API_KEY)

import asyncio
import json
import base64

class TTSHandler:
    @classmethod
    def _sync_stream(cls, speak_queue: list, condition: threading.Condition) -> str:
        while True:
            with condition:
                while not speak_queue:  # wait until there's an item
                    condition.wait()
                item = speak_queue.pop(0)
            if item is None:
                break
            yield item

    @classmethod
    async def generate_audio_async(cls, text_stream_fn: Callable[[str], AsyncGenerator], done_event: threading.Event = None) -> AsyncGenerator[Any, Any]:
        speak_queue = []
        audio_queue = []
        condition = threading.Condition()

        def tts_thread_fn():
            audio_stream = generate(
                text=cls._sync_stream(speak_queue, condition),
                voice="Liam",
                model="eleven_monolingual_v1",
                stream=True
            )
            stream(audio_stream)

            for chunk in audio_stream:
                with condition:
                    audio_queue.append(chunk)
                    condition.notify()
                
            with condition:
                audio_queue.append(None) 
                condition.notify()

        threading.Thread(target=tts_thread_fn).start()

        sentence_buffer = ""
        full_text = ""
        async for text in text_stream_fn:
            sentence_buffer += text
            yield {'type': 'partial-text', "text": full_text}
            full_text += text
            while re.search(r'[.!?]', sentence_buffer):
                sentence, _, remainder = re.split(r'([.!?])', sentence_buffer, 1)
                sentence += _
                with condition:
                    speak_queue.append(sentence.strip())
                    condition.notify()
                sentence_buffer = remainder

        if sentence_buffer.strip():
            with condition:
                speak_queue.append(sentence_buffer.strip())
                condition.notify()

        with condition:
            speak_queue.append(None)
            condition.notify()
        
        while True:
            with condition:
                while not audio_queue:
                    condition.wait()
                audio_chunk = audio_queue.pop(0)
            if audio_chunk is None:
                if done_event:
                    done_event.set()
                break
            yield {'type': 'chunk', 'chunk': audio_chunk}

    @classmethod
    async def get_chatbot_response(cls, query: str, done_event: asyncio.Event=asyncio.Event()) -> AsyncGenerator[Any, Any]:
        done_event.clear()
        prompt: str = "You're a helpful trading news reporter working for Goldmine designed to report the daily news in the tone of a professional trader. Today is Sunday, November 5th. You will be given a highlight of today's sentiment analysis and quantitative analysis. Highlight anomalies and what it could mean. Be concise, and use less than 200 words with no exception. Start your message with welcoming the person with today's date and welcoming them to Goldmine"
        async for result in TTSHandler.generate_audio_async(Model.async_chat_completion(query, prompt), done_event=done_event):
            if 'partial-text' in result:
                yield json.dumps({"type": "text", "text": result['text']})
            elif 'chunk' in result:
                yield json.dumps({
                    'type': 'chunk', 
                    'chunk': base64.b64encode(result['chunk']).decode('utf-8')
                })
        yield json.dumps({'type': 'status', "status": "success"})
        await done_event.wait()

if __name__ == "__main__":
    today_info = Mongo.get_today_info()
    print(today_info)

    async def main():
        print("DONEA")
        async for result in TTSHandler.get_chatbot_response(f"Here's today's data. Give me a professional news report in 100 words or less. {today_info}"):
            print(result)
    
    asyncio.run(main())