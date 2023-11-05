import { DataTable } from "./DataTable.tsx";
import Scores from "./Scores";
import { ChakraProvider, Box, Text, Heading, extendTheme, Container, theme, Stack, Flex } from '@chakra-ui/react';
import { createColumnHelper } from "@tanstack/react-table";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Category = () => {

    const location = useLocation();
    const name = location.state?.category || "Tech";
    console.log(location)
    console.log("location")
    console.log(name)

    const [data, setData] = useState({})


    useEffect(() => {
        fetchData();
    })

    const fetchData = async () => {
        const apiUrl = `http://localhost:8080/api/industry/?industry=Industrials`;
        axios
        .get(apiUrl + name)
        .then((response) => {
          console.log("indus", response.data);
        }).catch((error) => 
         console.error('Error fetching data:', error));
    }

      const [popArr, setPopArr] = useState([])
      const [percArr, setPercArr] = useState([])
      const [overArr, setOverArr] = useState([])
      const [snp, setSnp] = useState([])
      useEffect(() => {
        if(data) {
        // Loop through the array of objects
        const abbreviatedMonths = [
            "Dec", "Jan", "Feb", "Mar", "Apr", "May",
            "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"
        ];
        let pop_data = data['message']['history']['popularity'];
        let idx = 0;
        let newArr = [];
        pop_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr.push({name: abbreviatedMonths[idx], pop: item});
            idx += 1;
        });
        setPopArr(newArr);
    
        let perc_data = data['message']['history']['perception'];
        let idx1 = 0;
        let newArr1 = [];
        perc_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr.push({name: abbreviatedMonths[idx1], perc: item});
            idx1 += 1;
        });
        setPercArr(newArr1)
    
        let over_data = data['message']['history']['overall_rating'];
        let idx2 = 0;
        let newArr2 = [];
        over_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr2.push({name: abbreviatedMonths[idx2], over: item});
            idx2 += 1;
        });
        setOverArr(newArr2)
    
        let snp_data = data['message']['snp500']['data'];
        let idx3 = 0;
        let newArr3 = [];
        snp_data.forEach((item) => {
            // Extract and push the values of the fields into their respective arrays
            newArr3.push({name: abbreviatedMonths[idx3], snp: item});
            idx3 += 1;
        });
        setSnp(newArr3)
        }
    
        }, [data])


    return(
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
                    w="50%"
                >
        <Flex justifyContent="space-between" alignItems="center">
        <Flex direction="column" alignItems="center" ml={4} p={4}>
            <Box mt={4} textAlign="center" marginBottom={8}>
            
            </Box>
  </Flex>
  <Flex flexDirection="column" alignItems="center" ml={-4}>
    <Scores
      score1={data['message']['industry']['popularity']}
      barUp1={(data['message']['industry']['history']['popularity'][11] - data['message']['industry']['history']['popularity'][0] > 0)}
      score2={data['message']['industry']['perceptions']}
      barUp2={(data['message']['industry']['history']['perception'][11] - data['message']['industry']['history']['perception'][0] > 0)}
      score3={data['message']['industry']['overall_rating']}
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

<ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
        <LineChart isAnimationActive={false} data={popArr}>
            <CartesianGrid stroke="#ccc" fill="white"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dataKey="pop" name="Popularity" stroke="#8884d8" />
        </LineChart>
    </ResponsiveContainer>
    <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
        <LineChart isAnimationActive={false} data={percArr}>
            <CartesianGrid stroke="#ccc" fill="white"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dataKey="perc" name="Perception" stroke="#8884d8" />
        </LineChart>
    </ResponsiveContainer>
    <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
        <LineChart isAnimationActive={false} data={overArr}>
            <CartesianGrid stroke="#ccc" fill="white"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dataKey="over" name="Overall Rating" stroke="#8884d8" />
        </LineChart>
    </ResponsiveContainer>
    <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
        <LineChart isAnimationActive={false} data={popArr}>
            <CartesianGrid stroke="#ccc" fill="white"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dataKey="pop" name="Popularity" stroke="#8884d8" />
        </LineChart>
    </ResponsiveContainer>
        </Container>
        </Stack>
        </Container >
        </>
    );
}

export default Category;