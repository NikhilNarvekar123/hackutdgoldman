import Scores from "./Scores";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Container, Switch, Stack, Grid, GridItem, Image, Box, Text, Center, useColorModeValue, Heading, Avatar, Flex, propNames, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import Navbar from './Navbar';
import { useState } from "react";




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

  console.log(data)


const renderLineChart = (
    <LineChart width={600} height={300} data={data}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="name" />
    <YAxis />
    </LineChart>
);


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
            <Text color={'gray.500'} textAlign="left">
              {props.description}
            </Text>
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


const Company = () => {
	
    const [isChecked, setIsChecked] = useState(false);
    const toggleSwitch = () => {
		setIsChecked(!isChecked);
	};

    const data2 = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page A', uv: 200, pv: 2400, amt: 2400}, {name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
    const randomBaseScore = 40;
    const score = Math.ceil(randomBaseScore*riskMultiplier);
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
            <Box mt={4} textAlign="center">
            <Text fontSize={{base: 'xl'}} fontWeight={"bold"}>{data['name']}</Text>
            <Text>Rank</Text>
            <Text>{data['industry']}</Text>
            </Box>
            <div mt={4}>
            <CircularProgress value={score} size="175px" marginTop={10} color="blue.400" trackColor="gray.400" >
            <CircularProgressLabel>{score}%</CircularProgressLabel>
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

                <Grid templateColumns={!isChecked ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'} gap={6} w="100%">
                    <GridItem w='100%'>
                        <Card metricName={"Description"} title={data['name']} description={data["stock_info"]["description"]} author={"Industry: " + data['sub_industry']}/>
                    </GridItem>
                    <GridItem w='100%' justifySelf="center" border="1px black solid">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data2}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                            </LineChart>
                        </ResponsiveContainer>
                    </GridItem>
                    <GridItem w='100%'>
                        <Card metricName="description" title="SAMPLE METRIC 60%" description="SAMPLE DESCRIPTION" imgSrc="asd" author="jack" time="mond"/>
                    </GridItem>
                    <GridItem w='100%'>
                        <Card metricName="description" title="SAMPLE METRIC 60%" description="SAMPLE DESCRIPTION" imgSrc="asd" author="jack" time="mond"/>
                    </GridItem>
                    <GridItem w='100%'>
                        <Card metricName="description" title="SAMPLE METRIC 60%" description="SAMPLE DESCRIPTION" imgSrc="asd" author="jack" time="mond"/>
                    </GridItem>
                </Grid>
            
                
                
                
                
                {/* {renderLineChart} */}
        </Stack>
        </Container>
        </>
    );
}

export default Company;