import { DataTable } from "./DataTable.tsx";
import Scores from "./Scores";
import { ChakraProvider, Box, Text, Heading, extendTheme, Container, theme, Stack, Flex } from '@chakra-ui/react';
import { createColumnHelper } from "@tanstack/react-table";
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';


const Category = () => {

    const location = useLocation();
    const name = location.state?.category || "Tech";
    console.log("location")
    console.log(location)

    const columnHelper = createColumnHelper();

    const topCompanies = [
        {
          fromUnit: "Google",
          factor: 25.4,
        },
        {
          fromUnit: "Datadog",
          factor: 30.48,
        },
        {
          fromUnit: "Whatnot",
          factor: 0.91444,
        },
    ];
    
    const cols = [
        columnHelper.accessor("fromUnit", {
          cell: (info) => info.getValue(),
          header: "Company",
        }),
        columnHelper.accessor("factor", {
          cell: (info) => info.getValue(),
          header: "Score",
          meta: {
            isNumeric: true,
          },
        }),
    ];

    const bottomCompanies = [
        {
          fromUnit: "Amazon",
          factor: 20,
        },
        {
          fromUnit: "Databricks",
          factor: 21,
        },
        {
          fromUnit: "Stripe",
          factor: 22,
        },
    ];


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
      score1={-65.87}
      barUp1={true}
      score2={34.56}
      barUp2={true}
      score3={-74.25}
      barUp3={false}
      score4={78}
      barUp4={true}
    />
  </Flex>
</Flex>
</Box>
        <Container maxW="65%">
        <Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Top Categories
			</Text>
        <DataTable columns={cols} data={topCompanies}></DataTable>
        <Text as={'span'} fontSize={{base: 'xl'}} color={'blue.300'}>
				Lowest Categories
			</Text>
        <DataTable data={bottomCompanies} columns={cols}></DataTable>
        </Container>
        </Stack>
        </Container >
        </>
    );
}

export default Category;