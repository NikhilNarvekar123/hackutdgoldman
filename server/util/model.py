import openai

from util.config import Config
from typing import Callable, AsyncGenerator, List, Any

OPENAI_API_KEY = Config.OPENAI_API_KEY
openai.api_key = OPENAI_API_KEY

class Model:

    @classmethod
    def get_chat_response(self, content: str, prompt: str) -> str:
        if prompt is None:
            prompt = "You are a helpful assistant designed to take in stock data and return an smart but concise analysis on the market trends. Use and cite quantitative data to determine if the stock is worth buying or not. Every sentence should be a point backed up by data. Provide a single concise paragraph blurb of no more than 150 characters."

        response: dict[str, str] = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": prompt,
                },
                {
                    "role": "user",
                    "content": content,
                }
            ],
            temperature=0.3,
            max_tokens=256,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
        )
        return response.choices[0].message.content
    
    @classmethod
    async def async_chat_completion(cls, content: str, prompt: str) -> AsyncGenerator[str, None]:
        cache = True
        if cache:
            # Cached.txt is in the same folder as the file
            with open("util/cached.txt", "r") as f:
                assistant_response = f.read()
                yield assistant_response
                return

        response: openai.ChatCompletion = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": prompt,
                },
                {
                    "role": "user",
                    "content": content,
                }
            ],
            temperature=0.3,
            stream=True
        )
        assistant_response = ""

        async for chunk in response:
            delta: dict[str, Any] = chunk['choices'][0]["delta"]
            if 'content' not in delta:
                break
            
            assistant_response += delta["content"]
            yield delta["content"]