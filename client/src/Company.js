import Scores from "./Scores";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Switch, Stack, Grid, GridItem, Image, Box, Text, Center, useColorModeValue, Heading, Avatar, Flex, propNames, Stat, StatLabel, StatNumber, StatArrow, StatHelpText } from '@chakra-ui/react';
import Navbar from './Navbar';
import { useState, useEffect } from "react";
import {ArrowUpIcon, ArrowDownIcon} from '@chakra-ui/icons';
import { CircularProgressLabel, CircularProgress } from "@chakra-ui/react";



const data = {
    "_id": {
      "$oid": "654701cde538840771abf6d7"
    },
    "ticker": "MMM",
    "name": "3M Company",
    "industry": "Industrials",
    "sub_industry": "Industrial Conglomerates",
    "stock_info": {
      "market_cap": {
        "$numberLong": "119316456833"
      },
      "description": "3M Co is a diversified technology company. It manufactures a diverse array of industrial and consumer products. Its business segments are Industrial, Safety and Graphics, Health Care, Electronics and Energy, and Consumer.",
      "similar": [
        "AMZN",
        "ALGN",
        "DHR",
        "GE",
        "ITW",
        "JNJ",
        "HON",
        "HPQ",
        "XRAY",
        "JCI"
      ],
      "current_price": 93.86,
      "growth": -3.5999999999999996,
      "recommend": "none",
      "blurb": "Based on the quantitative data provided, 3M Company (symbol: SP5) has a dividend yield of 6.39% and a payout ratio of 61.67%. The stock has a trailing annual dividend yield of 6.49% and a five-year average dividend yield of 3.96%. The stock has a forward P/E ratio of 10.35 and a PEG ratio of 0.99. The company has a market capitalization of $51.84 billion and a book value of $8.46 per share. The stock has a 52-week high of $133.91 and a 52-week low of $85.35. The stock has a negative profit margin of -22.59% and a return on equity of -78.18%. Based on these metrics, it is recommended to conduct further analysis before making a decision to buy the stock.",
      "logo_url": null,
      "analyst_count": 0,
      "perception": -11.28,
      "popularity": 36.17,
      "overall_rating": 13.67,
      "titles": [
        {
          "title": "Google AI chatbot Bard offers inaccurate information in company ad; stock down -7.5%",
          "source": "reddit",
          "role": "negative"
        },
        {
          "title": "American Rebel down 32%, prices $3M private placement",
          "source": "news",
          "role": "negative"
        },
        {
          "title": "MMM. 3M Company",
          "source": "reddit",
          "role": "positive"
        }
      ]
    },
    "history": {
      "closing_prices": [
        119.26148986816406,
        114.86306762695312,
        110.2271728515625,
        103.19668579101562,
        102.01060485839844,
        103.08787536621094,
        90.55854797363281,
        98.61519622802734,
        109.8570785522461,
        105.0982437133789,
        93.62000274658203,
        90.94999694824219
      ],
      "volumes": [
        52505200,
        59159600,
        76990600,
        55805800,
        90558000,
        61856000,
        67698900,
        95057400,
        78742000,
        73372700,
        75253600,
        83621000
      ],
      "stock_analysis": [
        {
          "perception": -11.47,
          "popularity": 36.28,
          "overall_rating": 13.63
        },
        {
          "perception": -11.89,
          "popularity": 66.79,
          "overall_rating": 32.08
        },
        {
          "perception": -11.14,
          "popularity": 36.15,
          "overall_rating": 13.73
        },
        {
          "perception": -12.05,
          "popularity": 36.14,
          "overall_rating": 13.25
        },
        {
          "perception": -11.34,
          "popularity": 36.09,
          "overall_rating": 13.6
        },
        {
          "perception": -10.74,
          "popularity": 36.1,
          "overall_rating": 13.91
        },
        {
          "perception": -10.98,
          "popularity": 36.12,
          "overall_rating": 13.8
        },
        {
          "perception": -11.44,
          "popularity": 36.18,
          "overall_rating": 13.6
        },
        {
          "perception": -11.3,
          "popularity": 36.17,
          "overall_rating": 13.66
        },
        {
          "perception": -11.78,
          "popularity": 36.2,
          "overall_rating": 13.43
        },
        {
          "perception": -10.74,
          "popularity": 36.1,
          "overall_rating": 13.92
        },
        {
          "perception": -11.15,
          "popularity": 36.15,
          "overall_rating": 13.73
        }
      ]
    }
}

//   console.log(data)



const Card = (props) => {
    return (
      <Center py={6}>
        <Box
          w="100%"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
          overflow={'hidden'}>
          <Stack>
            <Text
              color={'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}>
              {props.metricName}
            </Text>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}>
              {props.title}
            </Heading>
            <Text color={'gray.300'} textAlign="left">
              {props.description}
            </Text>

            {props.custom}
          </Stack>
          <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
            {props.imgSrc && <Avatar src={props.imgSrc} />}
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
              <Text fontWeight={600}>{props.author}</Text>
              <Text color={'gray.500'}>{props.time}</Text>
            </Stack>
          </Stack>
        </Box>
      </Center>
    )
}

const riskMultiplier = 1.14;

const GraphCard = (props) => {
    return (
      <Center py={6}>
        <Box
          w="100%"
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
          overflow={'hidden'}>
          <Stack>
            <Text
              color={'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}>
              {props.metricName}
            </Text>
            {props.graph}
          </Stack>
        </Box>
      </Center>
    )
}




const Company = () => {
	
    const [isChecked, setIsChecked] = useState(true);
    const toggleSwitch = () => {
		setIsChecked(!isChecked);
	};
    const [analysisArray, setAnalysisArr] = useState([]);
    const [closingpriceArr, setClosingPriceArr] = useState([]);
    const [volumeArr, setVolumeArr] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [sources, setSources] = useState([]);

    useEffect(() => {
        let stock_analysis = data['history']['stock_analysis'];
        // Loop through the array of objects
        const abbreviatedMonths = [
            "Dec", "Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"
        ];
        let idx = 0;
        let newArr = [];
        stock_analysis.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr.push({name: abbreviatedMonths[idx], perc: item.perception, pop: item.popularity, rating: item.overall_rating});
            idx += 1;
        });
        setAnalysisArr(newArr);

        let closingPrices = data['history']['closing_prices'];
        let idx1 = 0;
        let newArr1 = [];
        closingPrices.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr1.push({name: abbreviatedMonths[idx1], price: item});
            idx1 += 1;
        });
        setClosingPriceArr(newArr1);

        let volumes = data['history']['volumes'];
        let idx2 = 0;
        let newArr2 = [];
        volumes.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr2.push({name: abbreviatedMonths[idx2], volume: item / 1000000});
            idx2 += 1;
        });
        setVolumeArr(newArr2);

        let stocksOb = data['stock_info']['similar'];
        let newArr3 = [];
        stocksOb.forEach((item) => {
            newArr3.push(<Heading
                color={'white'}
                fontSize={'2xl'}
                fontFamily={'body'}
            > {item}
            </Heading>);
        });
        setStocks(newArr3);

        let tempState = [];
        data['stock_info']['titles'].forEach((item) => {
            tempState.push(
            <>
            <Stat>
                <StatLabel>{item['source']}</StatLabel>
                <StatNumber>{item['title']}</StatNumber>
                <StatHelpText>
                {item['role'] == "positive" ? <StatArrow type='increase' /> : <StatArrow type='decrease'/>}
                {item['role']}
                </StatHelpText>
            </Stat>
            <br/>
            </>
            )
        });
        setSources(tempState);
    }, [])

    // const data2 = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page A', uv: 200, pv: 2400, amt: 2400}, {name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
    const randomBaseScore = -40;
    const score = parseFloat((randomBaseScore*riskMultiplier).toFixed(2));
    const [circScore, setCircScore] = useState(100*(score < 0))
    useEffect(() => {
        const timer = setInterval(() => {
          if (circScore < score) { // update code
            setCircScore(circScore + 1)
          }
          if (score < 0 && circScore > score*-1) { // score = -11, then bar1 = 89
            setCircScore(circScore - 1)
          }
          clearInterval(timer);
        }, 20); 
    }, [circScore, score])
    console.log(circScore)
    return(
        <>
        
        <Navbar/>
        <Container maxW={'5xl'}>
        <Stack
            textAlign={'center'}
            align={'center'}
            spacing={{ base: 8}}
            py={{ base: 20, md: 28 }}>
                
                <Box
                    bgGradient="linear(to-b, blue.500, blue.700)"
                    borderWidth="2px"
                    borderColor="blue.600"
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    w="100%"
                >
    <Flex justifyContent="space-between" alignItems="center">
        <Flex direction="column" alignItems="center" ml={4} p={4}>
            <Avatar size="lg" />
            <Box mt={4} textAlign="center" marginBottom={8}>
            <Text fontSize={{base: 'xl'}} fontWeight={"bold"}>{data['name']}</Text>
            <Text>Rank</Text>
            <Text>{data['industry']}</Text>
            </Box>
            <div mt={4}>
                <Text>Score</Text>
            <CircularProgress value={circScore} size="175px" marginTop={0} color={(score > 0) ? "blue.400" : "red.400"} trackColor="gray.400" >
            <CircularProgressLabel fontSize={"35"}>{score}%</CircularProgressLabel>
                                </CircularProgress>
            </div>
  </Flex>
  <Flex flexDirection="column" alignItems="center" ml={-4}>
    <Scores
      score1={data['stock_info']['popularity']}
      barUp1={(data['history']['stock_analysis'][11]['popularity'] - data['history']['stock_analysis'][0]['popularity']) > 0}
      score2={data['stock_info']['perception']}
      barUp2={(data['history']['stock_analysis'][11]['perception'] - data['history']['stock_analysis'][0]['perception']) > 0}
      score3={data['stock_info']['overall_rating']}
      barUp3={(data['history']['stock_analysis'][11]['overall_rating'] - data['history']['stock_analysis'][0]['overall_rating']) > 0}
      score4={randomBaseScore}
      barUp4={(randomBaseScore > 50)}
    />
  </Flex>
</Flex>

                </Box>

				<Flex alignItems="center">
					<Text fontSize="sm" mr={2}>Compact View</Text>
					<Switch isChecked={isChecked} onChange={toggleSwitch} size="lg" colorScheme={"blue"} />
					<Text fontSize="sm" ml={2}>Natural View</Text>
				</Flex>

                <Grid templateColumns={'repeat(1, 1fr)'} gap={6} w="100%" display={!isChecked ? "none" : "block"}>
                    <GridItem w='100%'>
                        <Card metricName={"Description"} title={data['name']} description={data["stock_info"]["description"]} author={"Industry: " + data['sub_industry']}/>
                    </GridItem>

                    <GridItem w='100%' justifySelf="center">
                        <GraphCard metricName={"Metric History"} graph={
                            <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={analysisArray}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="pop" name="Popularity" stroke="#8884d8" />
                                    <Line type="monotone" isAnimationActive={false} dataKey="perc" name="Perception" stroke="#2684d8" />
                                    <Line type="monotone" isAnimationActive={false} dataKey="rating" name="Rating" stroke="#4854d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Stock Information"} custom={
                            <Flex align="center" flexDirection="column">
                                <Heading
                                    color={useColorModeValue('gray.700', 'white')}
                                    fontSize={'2xl'}
                                    fontFamily={'body'}
                                >
                                    Current Stock Price
                                </Heading>
                                <Heading
                                color={useColorModeValue('gray.700', 'white')}
                                fontSize={'2xl'}
                                fontFamily={'body'}
                                textColor={data['stock_info']['growth'] < 0 ? "red.400" : "green.400"}
                                >
                                {data['stock_info']['current_price']}, &nbsp; {parseFloat(data['stock_info']['growth']).toFixed(2)}%
                                {data['stock_info']['growth'] < 0 ? <ArrowDownIcon/> : <ArrowUpIcon/>}
                                </Heading>

                                <br/>

                                <Heading
                                    color={useColorModeValue('gray.700', 'white')}
                                    fontSize={'2xl'}
                                    fontFamily={'body'}
                                >
                                    Current Market Cap
                                </Heading>
                                <Heading
                                color={useColorModeValue('gray.700', 'white')}
                                fontSize={'2xl'}
                                fontFamily={'body'}
                                textColor="blue.400"
                                >
                                ${data['stock_info']['market_cap']['$numberLong']}
                                </Heading>
                            </Flex>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%' justifySelf="center">
                        <GraphCard metricName={"Closing Price History"} graph={
                            <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={closingpriceArr}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="price" name="Price" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Market Analysis"} title={data['ticker']} description={data['stock_info']['blurb']}/>
                    </GridItem>

                    <GridItem w='100%' justifySelf="center">
                        <GraphCard metricName={"Volume History"} graph={
                            <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={volumeArr}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="volume" name="Volume (In Millions)" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Similar Stocks"} custom={
                            <Flex align="center" flexDirection="column">
                                {stocks}
                            </Flex>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Sentiment Analysis"} custom={
                            <Flex align="center" flexDirection="column">
                                {sources}
                            </Flex>
                        }
                        />
                    </GridItem>


                </Grid>
                    








                <Grid templateColumns={'repeat(2, 1fr)'} gap={6} w="100%" visibility={!isChecked ? "visible" : "hidden"}>

                    <Flex flexDirection="column">
                    
                    <GridItem w='100%'>
                        <Card metricName={"Description"} title={data['name']} description={data["stock_info"]["description"]} author={"Industry: " + data['sub_industry']}/>
                    </GridItem>
                    
                    <GridItem w='100%'>
                        <Card metricName={"Stock Information"} custom={
                            <Flex align="center" flexDirection="column">
                                <Heading
                                    color={useColorModeValue('gray.700', 'white')}
                                    fontSize={'2xl'}
                                    fontFamily={'body'}
                                >
                                    Current Stock Price
                                </Heading>
                                <Heading
                                color={useColorModeValue('gray.700', 'white')}
                                fontSize={'2xl'}
                                fontFamily={'body'}
                                textColor={data['stock_info']['growth'] < 0 ? "red.400" : "green.400"}
                                >
                                {data['stock_info']['current_price']}, &nbsp; {parseFloat(data['stock_info']['growth']).toFixed(2)}%
                                {data['stock_info']['growth'] < 0 ? <ArrowDownIcon/> : <ArrowUpIcon/>}
                                </Heading>

                                <br/>

                                <Heading
                                    color={useColorModeValue('gray.700', 'white')}
                                    fontSize={'2xl'}
                                    fontFamily={'body'}
                                >
                                    Current Market Cap
                                </Heading>
                                <Heading
                                color={useColorModeValue('gray.700', 'white')}
                                fontSize={'2xl'}
                                fontFamily={'body'}
                                textColor="blue.400"
                                >
                                ${data['stock_info']['market_cap']['$numberLong']}
                                </Heading>
                            </Flex>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Market Analysis"} title={data['ticker']} description={data['stock_info']['blurb']}/>
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Similar Stocks"} custom={
                            <Flex align="center" flexDirection="column">
                                {stocks}
                            </Flex>
                        }
                        />
                    </GridItem>

                    </Flex>

                    <Flex flexDirection="column">
                    <GridItem w='100%' justifySelf="center">
                        <GraphCard metricName={"Metric History"} graph={
                            <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={analysisArray}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="pop" name="Popularity" stroke="#8884d8" />
                                    <Line type="monotone" isAnimationActive={false} dataKey="perc" name="Perception" stroke="#2684d8" />
                                    <Line type="monotone" isAnimationActive={false} dataKey="rating" name="Rating" stroke="#4854d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%' justifySelf="center">
                        <GraphCard metricName={"Closing Price History"} graph={
                            <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={closingpriceArr}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="price" name="Price" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%' justifySelf="center">
                        <GraphCard metricName={"Volume History"} graph={
                            <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={volumeArr}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="volume" name="Volume (In Millions)" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        }
                        />
                    </GridItem>

                    <GridItem w='100%'>
                        <Card metricName={"Sentiment Analysis"} custom={
                            <Flex align="center" flexDirection="column">
                                {sources}
                            </Flex>
                        }
                        />
                    </GridItem>

                    </Flex>

                </Grid>

                
        </Stack>
        </Container>
        </>
    );
}

export default Company;