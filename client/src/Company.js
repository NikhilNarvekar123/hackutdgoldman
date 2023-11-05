import Scores from "./Scores";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Container, Stack } from '@chakra-ui/react';
import Navbar from './Navbar';



const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page A', uv: 300, pv: 2400, amt: 2400}, {name: 'Page A', uv: 200, pv: 2400, amt: 2400}, {name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

const renderLineChart = (
    <LineChart width={600} height={300} data={data}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="name" />
    <YAxis />
    </LineChart>
);


const Company = () => {

    return(
        <>
        
        <Navbar/>
        <Container maxW={'5xl'}>
        <Stack
            textAlign={'center'}
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}>
                
                
            
                <Scores></Scores>
                
                
                
                
                
                {renderLineChart}
        </Stack>
        </Container>
        </>
    );
}

export default Company;