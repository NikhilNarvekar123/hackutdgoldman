import logo from './logo.svg';
import './App.css';
import Loading from './Loading';
import { ColorModeScript, Switch, SliderTrack, SliderThumb, SliderFilledTrack, extendTheme, Box, Input, Select, Text, Container, Stack, Heading, Button, Flex, Icon, IconProps, ChakraProvider ,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./DataTable.tsx";
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useSound from 'use-sound'
import cache from './cache.mp3'
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody } from '@chakra-ui/react';

const data2 = [
	{
	  fromUnit: "Google",
	  toUnit: "80",
	  factor: 25.4,
	},
	{
	  fromUnit: "Datadog",
	  toUnit: "70",
	  factor: 30.48,
	},
	{
	  fromUnit: "Whatnot",
	  toUnit: "19",
	  factor: 0.91444,
	},
];

const columnHelper = createColumnHelper();

const columns2 = [
	columnHelper.accessor("fromUnit", {
	  cell: (info) => info.getValue(),
	  header: "Company",
	}),
	columnHelper.accessor("toUnit", {
	  cell: (info) => info.getValue(),
	  header: "Sentiment",
	}),
	columnHelper.accessor("factor", {
	  cell: (info) => info.getValue(),
	  header: "Rank",
	  meta: {
		isNumeric: true,
	  },
	}),
];


function App() {

	const navigate = useNavigate();
	const [isChecked, setIsChecked] = useState(false);
	const [inValue, setInValue] = useState("");
	const [dropdownValue, setddValue] = useState("");
	const [isErr, setErr] = useState(false);
	const toggleSwitch = () => {
		setIsChecked(!isChecked);
	};

	const [playSound] = useSound(cache);



	// const [show, setShow] = useState(false)
	// let audio = new Audio("/PATH")

	useEffect(() => {
		const timeout = setTimeout(() => {
			console.log("ASD")
			let audio =  new Audio(cache);
			audio.play();
		}, 5000)
		// return () => clearTimeout(timeout)
	}, [])


	const onSubmit = () => {
		if(isChecked) {
			if (dropdownValue.length == 0) {
				setErr(true);
			} else {
				navigate('/loading', {state: {category: dropdownValue, isCategory: true}});
			}
		} else {
			if (inValue.length == 0) {
				setErr(true);
			} else {
				navigate('/loading', {state: {category: inValue, isCategory: false}});
			}
		}
	}

  const [leaderboard, setLeaderboard] = useState([])
  const [lowLeaderboard, setLowLeaderBoard] = useState([])
  const [cols, setCols] = useState([])
  const [lowCols, setLowCols] = useState([])
  const [topInd, setTopInd] = useState([])
  const [topCols, setTopCols] = useState([])
  const [econData, setEconData] = useState(null)

  function makeTable(leaderboardData) {
    let data = [];
  let lowData = [];
  for (var i = 0; i < leaderboardData['data']['message']['highest_rated_stocks'].length; i++) {
    data.push({name: leaderboardData['data']['message']['highest_rated_stocks'][i]['name'], 
    perception: parseFloat((leaderboardData['data']['message']['highest_rated_stocks'][i]['stock_info']['perception']).toFixed(2)),
    rating: parseFloat((leaderboardData['data']['message']['highest_rated_stocks'][i]['stock_info']['overall_rating']).toFixed(2))
  });
  
  lowData.push({name: leaderboardData['data']['message']['lowest_rated_stocks'][i]['name'], 
    perception: parseFloat((leaderboardData['data']['message']['lowest_rated_stocks'][i]['stock_info']['perception']).toFixed(2)),
    rating: parseFloat((leaderboardData['data']['message']['lowest_rated_stocks'][i]['stock_info']['overall_rating']).toFixed(2))
  });
  }

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Company",
    }),
    columnHelper.accessor("perception", {
      cell: (info) => info.getValue(),
      header: "Perception",
      meta: {
        isNumeric: true
      }
    }),
    columnHelper.accessor("rating", {
      cell: (info) => info.getValue(),
      header: "Rating",
      meta: {
      isNumeric: true,
      },
    }),
  ];
  
  const lowColumns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Company",
    }),
    columnHelper.accessor("perception", {
      cell: (info) => info.getValue(),
      header: "Perception",
      meta: {
        isNumeric: true
      }
    }),
    columnHelper.accessor("rating", {
      cell: (info) => info.getValue(),
      header: "Rating",
      meta: {
      isNumeric: true,
      },
    }),
  ];
  
    setLeaderboard(data)
    setLowLeaderBoard(lowData)
    setCols(columns)
    setLowCols(lowColumns)
  }

  useEffect(() => {
    fetchLeaderboardData();
    fetchEconData();
    fetchIndusData();
  }, [])

  const fetchLeaderboardData = async () => {
    const apiUrl = `http://localhost:8080/api/stock_leaderboard`;
    axios
    .get(apiUrl)
    .then((response) => {
      console.log("leaderboard", response)
      makeTable(response)
    }).catch((error) => 
     console.error('Error fetching data:', error));
  }

  const fetchEconData = async () => {
    const apiUrl = `http://localhost:8080/api/get_econ_info`;
    axios
    .get(apiUrl)
    .then((response) => {
      console.log("econ", response);
      setEconData(response.data)
    }).catch((error) => 
     console.error('Error fetching data:', error));
  }
  

  const fetchIndusData = async () => {
    const apiUrl = `http://localhost:8080/api/top_industries`;
    axios
    .get(apiUrl)
    .then((response) => {
      console.log("industries", response.data)
      let inData = []
      for (var i = 0; i < response.data['message']['top_industries'].length; i++) {
        inData.push({
          industry: response.data['message']['top_industries'][i]['industry'],
          perception: parseFloat(response.data['message']['top_industries'][i]['perceptions'].toFixed(2)),
          rating: parseFloat(response.data['message']['top_industries'][i]['overall_rating'].toFixed(2)),
        })
      }
      const columns = [
        columnHelper.accessor("industry", {
          cell: (info) => info.getValue(),
          header: "Industry",
        }),
        columnHelper.accessor("perception", {
          cell: (info) => info.getValue(),
          header: "Perception",
          meta: {
            isNumeric: true
          }
        }),
        columnHelper.accessor("rating", {
          cell: (info) => info.getValue(),
          header: "Rating",
          meta: {
          isNumeric: true,
          },
        }),
      ];
      setTopInd(inData)
      setTopCols(columns)

    }).catch((error) => 
     console.error('Error fetching data:', error));
  }

  const [ppiArr, setPpiArr] = useState([])
  const [csArr, setCsArr] = useState([])
  const [fsArr, setFsArr] = useState([])
  const [snp, setSnp] = useState([])
  useEffect(() => {
	if(econData) {
    // Loop through the array of objects
    const abbreviatedMonths = [
        "Dec", "Jan", "Feb", "Mar", "Apr", "May",
        "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"
    ];
    let ppi_data = econData['message']['producer_price_index']['data'];
    let idx = 0;
    let newArr = [];
    ppi_data.forEach((item) => {
        // Extract and push the values of the fields into their respective arrays
        newArr.push({name: abbreviatedMonths[idx], ppi: parseFloat(item.toFixed(2))});
        idx += 1;
    });
    setPpiArr(newArr);

    let cs_data = econData['message']['consumer_sentiment']['data'];
    let idx1 = 0;
    let newArr1 = [];
    cs_data.forEach((item) => {
        // Extract and push the values of the fields into their respective arrays
        newArr1.push({name: abbreviatedMonths[idx1], cs: parseFloat(item.toFixed(2))});
        idx1 += 1;
    });
    setCsArr(newArr1)

    let fs_data = econData['message']['financial_stress']['data'];
    let idx2 = 0;
    let newArr2 = [];
    fs_data.forEach((item) => {
        // Extract and push the values of the fields into their respective arrays
        newArr2.push({name: abbreviatedMonths[idx2], fs: parseFloat(item.toFixed(2))});
        idx2 += 1;
    });
    setFsArr(newArr2)

    let snp_data = econData['message']['snp500']['data'];
    let idx3 = 0;
    let newArr3 = [];
    snp_data.forEach((item) => {
        // Extract and push the values of the fields into their respective arrays
        newArr3.push({name: abbreviatedMonths[idx3], snp: parseFloat(item.toFixed(2))});
        idx3 += 1;
    });
    setSnp(newArr3)
	}

    }, [econData])
  

	const [isOpen, setIsOpen] = useState(false);

	const handleOpenPopover = () => {
	  setIsOpen(true);
	};
  
	const handleClosePopover = () => {
	  setIsOpen(false);
	};

  return (
    <Container maxW={'5xl'}>
    <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>

		<Popover isOpen={isOpen} onClose={handleClosePopover}>
        <PopoverTrigger>
		
			<Box
			position="fixed"
			bottom="20px" // Adjust as needed
			right="20px" // Adjust as needed
			>
			<Button colorScheme="blue" size="md" onClick={handleOpenPopover}>
				Transcript
			</Button>
			</Box>

        </PopoverTrigger>

        <PopoverContent maxH="200px" overflowY="auto">
          <PopoverBody>
			Welcome to Goldmine! Today is Sunday, November 5th. Let's dive into the market analysis.
			<br/>
			According to our analysis today, the overall consumer sentiment is at 67 point 9 percent, indicating a positive outlook among consumers.
			However, there are a few anomalies to note. We noticed a downturn in our earnings analysis as 
supported by the SEC and recent earnings report for Charles Schwab and Hartford Financial Services Group. We think this indicates possible undervaluation or market skepticism, so keep an eye on these two. 
On the positive side, the Information Technology industry is the hottest industry today and has been for a couple weeks, with an overall rating of 37 point 04. We think it's a good time to invest in IT stocks. Outside of that, we see that Amex within the Financials industry has had a huge jump, with a positive overall rating of 66 point 51, indicating potential growth opportunities.
          </PopoverBody>
        </PopoverContent>



			<Heading
				fontWeight={600}
				fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
				lineHeight={'110%'}>
				GoldMine{' '}
				<br/>
				<Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
					stock sentiment analysis, recommendation, and comparison
				</Text>
			</Heading>
			<Text color={'gray.500'} maxW={'3xl'}>
				Enter a company name or select a company category from the form below to get started.
			</Text>


			<br/>
			<Container maxW="65%">
				{!isChecked ? 
				<Input w="100%" placeholder="Enter company name..." value={inValue} onChange={(e) => {setInValue(e.target.value)}}></Input>
					:
				<Select placeholder='Select Category' value={dropdownValue} onChange={(e) => (setddValue(e.target.value))}>
  					<option value={topInd[0].industry}>{topInd[0].industry}</option>
  					<option value={topInd[1].industry}>{topInd[1].industry}</option>
  					<option value={topInd[2].industry}>{topInd[2].industry}</option>
            <option value={topInd[3].industry}>{topInd[3].industry}</option>
            <option value={topInd[4].industry}>{topInd[4].industry}</option>
				</Select>
				}


				<Box h="30px" w="20px" />

				<Flex justifyContent="space-between">

				<Flex alignItems="center">
					<Text fontSize="sm" mr={2}>Company Search</Text>
					<Switch isChecked={isChecked} onChange={toggleSwitch} size="lg" colorScheme={"blue"} />
					<Text fontSize="sm" ml={2}>Category Search</Text>
				</Flex>


					<Button
					rounded={'full'}
					px={6}
					colorScheme={'orange'}
					bg={'blue.300'}
					_hover={{ bg: 'orange.500' }}
					onClick={onSubmit}>
					Analyze
					</Button>
				</Flex>

				{isErr && <Alert status='error' mt={10}>
					<AlertIcon />
					<AlertTitle>Empty field!</AlertTitle>
					<AlertDescription>Please enter text or choose a menu option.</AlertDescription>
				</Alert>}
			</Container>


			<br/>
			<br/>
			<br/>

			<Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Highest Rated Stocks
			</Text>
      <DataTable columns={cols} data={leaderboard} />
      <Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Lowest Rated Stocks
			</Text>
      <DataTable columns={lowCols} data={lowLeaderboard} />
      <Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Top Industries
			</Text>
			<DataTable columns={topCols} data={topInd} />

      <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={ppiArr}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="ppi" name="Producer Price Index" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>

      <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
          <LineChart isAnimationActive={false} data={csArr}>
              <CartesianGrid stroke="#ccc" fill="white"/>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" isAnimationActive={false} dataKey="cs" name="Consumer Sentiment" stroke="#8884d8" />
          </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
                                <LineChart isAnimationActive={false} data={fsArr}>
                                    <CartesianGrid stroke="#ccc" fill="white"/>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" isAnimationActive={false} dataKey="fs" name="Financial Stress" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>

    <ResponsiveContainer isAnimationActive={false} width={'99%'} height={300}>
        <LineChart isAnimationActive={false} data={snp}>
            <CartesianGrid stroke="#ccc" fill="white"/>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dataKey="snp" name="snp500" stroke="#8884d8" />
        </LineChart>
    </ResponsiveContainer>
      
	</Popover>
	</Stack>
    </Container>
  );
}

export default App;
