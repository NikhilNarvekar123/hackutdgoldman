import logo from './logo.svg';
import './App.css';
import Loading from './Loading';
import { ColorModeScript, Switch, SliderTrack, SliderThumb, SliderFilledTrack, extendTheme, Box, Input, Select, Text, Container, Stack, Heading, Button, Flex, Icon, IconProps, ChakraProvider ,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./DataTable.tsx";

const data = [
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

const columns = [
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

	const onSubmit = () => {
		if(isChecked) {
			if (dropdownValue.length == 0) {
				setErr(true);
			} else {
				navigate('/loading', {state: {category: dropdownValue}});
			}
		} else {
			if (inValue.length == 0) {
				setErr(true);
			} else {
				navigate('/loading', {state: {category: dropdownValue}});
			}
		}
	}


  return (
    <Container maxW={'5xl'}>
    <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
			<Heading
				fontWeight={600}
				fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
				lineHeight={'110%'}>
				StockSentinel{' '}
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
  					<option value='option1'>Cat1</option>
  					<option value='option2'>Cat2</option>
  					<option value='option3'>Cat3</option>
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
				Top Companies
			</Text>
			<DataTable columns={columns} data={data} />

			<br/>

			<Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Top Categories
			</Text>
			<DataTable columns={columns} data={data} />
      
	</Stack>
    </Container>
  );
}

export default App;
