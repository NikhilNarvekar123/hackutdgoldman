import Scores from "./Scores";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Container, Switch, Stack, Grid, GridItem, Image, Box, Text, Center, useColorModeValue, Heading, Avatar, Flex, propNames } from '@chakra-ui/react';
import Navbar from './Navbar';
import { useState } from "react";


const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page A', uv: 300, pv: 2400, amt: 2400}, {name: 'Page A', uv: 200, pv: 2400, amt: 2400}, {name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

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
              // eslint-disable-next-line react-hooks/rules-of-hooks
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}>
              {props.title}
            </Heading>
            <Text color={'gray.500'}>
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




const Company = () => {
	
    const [isChecked, setIsChecked] = useState(false);
    const toggleSwitch = () => {
		setIsChecked(!isChecked);
	};


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
                    borderWidth="1px"
                    borderColor="blue.600"
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    w="100%"
                >
                    <Flex justifyContent="space-between">
                        <Flex h={180} ml={10}>
                            <Flex direction="column" alignItems="center" justify="center">
                                <Avatar size="lg"/>
                                <Box mt={2} textAlign="center">
                                <div>Company Name</div>
                                <div>Rank</div>
                                </Box>
                            </Flex>
                        </Flex>
                        <div><Scores/></div>
                    </Flex>
                </Box>

				<Flex alignItems="center">
					<Text fontSize="sm" mr={2}>Compact View</Text>
					<Switch isChecked={isChecked} onChange={toggleSwitch} size="lg" colorScheme={"blue"} />
					<Text fontSize="sm" ml={2}>Natural View</Text>
				</Flex>

                <Grid templateColumns={!isChecked ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'} gap={6} w="100%">
                    <GridItem w='100%'>
                        <Card metricName="description" title="SAMPLE METRIC 60%" description="SAMPLE DESCRIPTION" imgSrc="asd" author="jack" time="mond"/>
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