import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Heading, extendTheme, Container, Progress } from '@chakra-ui/react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

const theme = extendTheme({});

const terminalStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'monospace',
    padding: '20px',
  };

const phrases = [
  "Scraping earnings report",
  "Extracting information from documents",
  "Analyzing sentiment of reports",
  "Computing scores of S&P500"
];

function Loading() {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [text, setText] = useState('');
    const [dotCount, setDotCount] = useState(0)
    const dots = '...';

    const randomPhrases = [
        'Calculating SEC Score', 
        "Implementing sentiment analysis to gauge market sentiment from news reports.",
        "Using web scraping to gather real-time stock data for analysis.",
        "Leveraging statistical models to compute volatility and risk metrics.",
        "Developing machine learning algorithms to predict market trends.",
        "Applying natural language processing for financial news sentiment analysis.",
        "Performing web scraping on financial websites to collect market data.",
        "Creating a data pipeline for computing intraday stock statistics.",
        "Utilizing Monte Carlo simulations to assess portfolio risk.",
        "Building a recommendation system for stock trading strategies.",
        "Integrating Python libraries for options trading analytics.",
        "Using clustering algorithms to group similar stocks for analysis.",
        // "Developing a trading bot with real-time trading volume monitoring.",
        // "Implementing a custom trading strategy using algorithmic trading.",
        // "Leveraging cloud-based data storage for financial data analysis.",
        "Applying deep learning models to predict stock price movements.",
        "Automating technical analysis with custom-built scripts.",
        "Utilizing data mining techniques for market research.",
        "Deploying sentiment analysis models for social media market insights.",
        "Implementing a custom API for accessing financial market data.",
        "Applying blockchain technology for secure financial transactions.",
        "Leveraging big data analytics for risk management in finance.",
        "Creating custom indicators for technical analysis.",
        // "Implementing microservices architecture for financial applications.",
        // "Applying reinforcement learning algorithms for stock trading.",
        // "Using distributed computing for high-frequency trading strategies.",
        // "Integrating IoT sensors for real-time market data collection.",
        "Building financial models with stochastic calculus for risk assessment.",
        "Implementing real-time data streaming for financial market updates."
      ];

    const [percent, setPercent] = useState(0);
    const [stockPhrases, setStockPhrases] = useState(["Using data visualization libraries to create interactive financial dashboards."]);
    const [stockIdx, setStockIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      // Advance to the next phrase
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      setDotCount(0)
        setText('')
    }, 3000); // Change phrase every 3 seconds

    return () => {
      clearInterval(timer);
    };
  }, []);
//   console.log(dotCount)
  useEffect(() => {
    
        const textInterval = setInterval(() => {
          if (dotCount < dots.length) {
            setText((prevText) => prevText + dots[dotCount]);
            setDotCount(dotCount + 1);
          } else {
            setDotCount(0)
            clearInterval(textInterval);
          }
        }, 600); // Add a character every second
  
      return () => {
        clearInterval(textInterval);
      };
  }, [dots, dotCount])

  useEffect(() => {
    const timer = setInterval(() => {
      if (percent < 100) {
        setPercent(percent + 1)
      } else {
        setPercent(0)
      setStockPhrases((prevStockPhrases) => [...prevStockPhrases, randomPhrases[stockIdx]])
    //   if (percent < 100) {
    //     setPercent(percent + 1);
    //   }
    if (stockIdx < randomPhrases.length - 1) {
        setStockIdx(stockIdx + 1)
    } else {
        setStockIdx(0)
    }
}
    }, 10); 

    return () => {
      clearInterval(timer);
    //   clearInterval(incrementInterval);
    };
  }, [randomPhrases, stockIdx, percent]);

    return (
        <Container maxW="100%"
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        alignContent={"center"}>
            {/* <Container maxW={'10xl'} maxH={'20xl'}> */}
            {/* <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
          color={'blue.300'}> */}
            <Box > 
            {/* <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          {phrases[currentPhraseIndex]}{text}
        </Heading> */}
        
        <Terminal name='Goldman Sachs' colorMode={ ColorMode.Dark }  onInput={ terminalInput => console.log(`New terminal input received: '${ terminalInput }'`) }>
        <span style={{ color: '#42A5F5' }}>{phrases[currentPhraseIndex]}{text}</span>
        {/* {stockPhrases.map((phrase, index) => 
        {index === stockPhrases.length - 1 ?
        (<TerminalOutput>{phrase} {percent}%</TerminalOutput>) :
        (<TerminalOutput>{phrase} 100%</TerminalOutput>)
        })
        }  */}
        {stockPhrases.map((phrase, idx) => (
            <TerminalOutput key={idx}>
                {idx === stockPhrases.length - 1
                ? `${phrase} ${percent}%`
                : `${phrase} 100%`}
            </TerminalOutput>
            ))}
            </Terminal>
            </Box>
            {/* </Stack> */}
            {/* </Container> */}
        </Container>
    );
}
export default Loading;