import { DataTable } from "./DataTable.tsx";
import Scores from "./Scores";
import { ChakraProvider, Box, Text, Heading, extendTheme, Container, theme, Stack } from '@chakra-ui/react';
import { createColumnHelper } from "@tanstack/react-table";
import Navbar from './Navbar';


const Category = () => {

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
            <Stack textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <Scores score1={90} score2={85} score3={78} score4={92}></Scores>
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