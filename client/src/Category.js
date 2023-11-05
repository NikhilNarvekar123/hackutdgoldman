import { DataTable } from "./DataTable.tsx";
import Scores from "./Scores";
import { ChakraProvider, Box, Text, Heading, extendTheme, Container, theme, Stack, Flex, GridItem, Center, Avatar, Switch, Grid, useColorModeValue } from '@chakra-ui/react';
import { createColumnHelper } from "@tanstack/react-table";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";




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



const Category = () => {

    const location = useLocation();
    const name = location.state?.category || "Tech";
    console.log(location)
    console.log("location")
    console.log(name)

    const [data, setData] = useState(null);

    const [isChecked, setIsChecked] = useState(true);
    const toggleSwitch = () => {
		setIsChecked(!isChecked);
	};


    useEffect(() => {
        // console.log("beforAJSHDAJSHDJKASHDJKAHSKJDhe")
        fetchData();
        // console.log("after")
    }, [])

    const fetchData = async () => {
        const apiUrl = `http://localhost:8080/api/industry/?industry=`;
        console.log("HELLO")
        axios
        .get(apiUrl + name)
        .then((response) => {
          console.log("indus", response.data);
          setData(response.data)
        }).catch((error) => 
         console.error('Error fetching data:', error));
    }

      const [popArr, setPopArr] = useState([])
      const [popBound, setPopBound] = useState([0, 0]);
      const [percArr, setPercArr] = useState([])
      const [percBound, setPercBound] = useState([])
      const [overArr, setOverArr] = useState([])
      const [overBound, setOverBound] = useState([])
      const [snp, setSnp] = useState([])

      useEffect(() => {
        if(data) {
            // console.log("ASasjdkasjd")
        // Loop through the array of objects
        const abbreviatedMonths = [
            "Dec", "Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"
        ];
        let pop_data = data['message']['industry']['history']['popularity'];
        let idx = 0;
        let newArr = [];
        let lb = Math.min(...pop_data);
        let hb = Math.max(...pop_data);
        pop_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr.push({name: abbreviatedMonths[idx], pop: item});
            idx += 1;
        });
        setPopArr(newArr);
        setPopBound([lb, hb]);
    
        let perc_data = data['message']['industry']['history']['perception'];
        let idx1 = 0;
        let newArr1 = [];
        let lb1 = Math.min(...perc_data);
        let hb1 = Math.max(...perc_data);
        perc_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr1.push({name: abbreviatedMonths[idx1], perc: item});
            idx1 += 1;
        });
        setPercArr(newArr1);
        setPercBound([lb1, hb1]);
    
        let over_data = data['message']['industry']['history']['overall_rating'];
        let idx2 = 0;
        let newArr2 = [];
        let lb2 = Math.min(...over_data);
        let hb2 = Math.max(...over_data);
        over_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr2.push({name: abbreviatedMonths[idx2], over: item});
            idx2 += 1;
        });
        setOverArr(newArr2)
        setOverBound([lb2, hb2]);
    
        // let snp_data = data['message']['snp500']['data'];
        // let idx3 = 0;
        // let newArr3 = [];
        // snp_data.forEach((item) => {
        //     // Extract and push the values of the fields into their respective arrays
        //     newArr3.push({name: abbreviatedMonths[idx3], snp: item});
        //     idx3 += 1;
        // });
        // setSnp(newArr3)
        }
    
        }, [data])


    return(
        <>
        {data ? 
        <>
        <Navbar></Navbar>
        <Container theme={theme} maxW={'5xl'}>
        <Stack
            textAlign={'center'}
            align={'center'}
            spacing={{ base: 8}}
            marginTop={-5}
            py={{ base: 20, md: 28 }}>
                <Heading>{name}</Heading>
             <Box
                    bgGradient="linear(to-b, blue.500, blue.700)"
                    borderWidth="2px"
                    borderColor="blue.600"
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    w="70%"
                >
        <Flex justifyContent="space-between" alignItems="center">
        <Flex direction="column" alignItems="center" ml={4} p={4}>
            <Box mt={4} textAlign="center" marginBottom={8}>
            
            </Box>
  </Flex>
  <Flex flexDirection="column" alignItems="center" ml={-4}>
    <Scores
      score1={(data['message']['industry']['popularity']).toFixed(2)}
      barUp1={(data['message']['industry']['history']['popularity'][11] - data['message']['industry']['history']['popularity'][0] > 0)}
      score2={data['message']['industry']['perceptions'].toFixed(2)}
      barUp2={(data['message']['industry']['history']['perception'][11] - data['message']['industry']['history']['perception'][0] > 0)}
      score3={data['message']['industry']['overall_rating'].toFixed(2)}
      barUp3={(data['message']['industry']['history']['overall_rating'][11] - data['message']['industry']['history']['overall_rating'][0] > 0)}
      score4={78}
      barUp4={true}
    />
  </Flex>
</Flex>
</Box>
        <Container maxW="65%">
        {/* <Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Top Categories
			</Text>
        <DataTable columns={cols} data={topCompanies}></DataTable>
        <Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Lowest Categories
			</Text>
        <DataTable data={bottomCompanies} columns={cols}></DataTable> */}



        <Flex alignItems="center">
            <Text fontSize="sm" mr={2}>Compact View</Text>
            <Switch isChecked={isChecked} onChange={toggleSwitch} size="lg" colorScheme={"blue"} />
            <Text fontSize="sm" ml={2}>Natural View</Text>
        </Flex>

        <Grid templateColumns={'repeat(1, 1fr)'} gap={6} w="100%" display={!isChecked ? "none" : "block"}>
            {/* <GridItem w='100%'>
                <Card metricName={"Description"} title={data['name']} description={data["stock_info"]["description"]} author={"Industry: " + data['sub_industry']}/>
            </GridItem> */}

            <GridItem w='100%' justifySelf="center">
                <GraphCard metricName={"Popularity History"} graph={
                <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                    <LineChart isAnimationActive={false} data={popArr}>
                        <CartesianGrid stroke="#ccc" fill="white"/>
                        <XAxis dataKey="name" />
                        <YAxis domain={[popBound[0], popBound[1]]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" isAnimationActive={false} dataKey="pop" name="Popularity" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
                }/>
            </GridItem>

            <GridItem w='100%' justifySelf='center'>
                <GraphCard metricName={"Rating History"} graph={
                <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                    <LineChart isAnimationActive={false} data={overArr}>
                        <CartesianGrid stroke="#ccc" fill="white"/>
                        <XAxis dataKey="name" />
                        <YAxis domain={[overArr[0], overArr[1]]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" isAnimationActive={false} dataKey="over" name="Overall Rating" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
                }/>
            </GridItem>

            <GridItem w='100%' justifySelf={'center'}>
                <GraphCard metricName={"Perception History"} graph={
                <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                    <LineChart isAnimationActive={false} data={percArr}>
                        <CartesianGrid stroke="#ccc" fill="white"/>
                        <XAxis dataKey="name" />
                        <YAxis domain={[percBound[0], percBound[1]]}/>
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" isAnimationActive={false} dataKey="perc" name="Perception" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
                }/>
            </GridItem>

            {/* <GridItem w='100%'>
                <Card metricName={"Description"} title={data['name']} description={data["stock_info"]["description"]} author={"Industry: " + data['sub_industry']}/>
            </GridItem> */}

        </Grid>
                    


                <Grid templateColumns={'repeat(2, 1fr)'} gap={6} w="100%" visibility={!isChecked ? "visible" : "hidden"}>

                    <Flex flexDirection="column">
                    </Flex>

                    <Flex flexDirection="column">
                    </Flex>

                </Grid>



        </Container>
        </Stack>
        </Container >
        </>
        : <></>}
        </>
    );
}

export default Category;