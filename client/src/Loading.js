import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Button, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({});

const phrases = [
  'Phrase 1',
  'Phrase 2',
  'Phrase 3',
  'Phrase 4',
];

function App() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Advance to the next phrase
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change phrase every 3 seconds

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Text fontSize="xl" fontWeight="bold">
          {phrases[currentPhraseIndex]}
        </Text>
        <Button onClick={() => setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)}>
          Next
        </Button>
      </Box>
    </ChakraProvider>
  );
}

export default App;
