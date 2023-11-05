import { Stack, Progress, ChakraProvider, Box, Heading, Container, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

const Scores = () => {

    const [bar1, setBar1] = useState(0)
    const [bar2, setBar2] = useState(0)
    const [barUp1, setBarUp1] = useState(true)
    const [barUp2, setBarUp2] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
          if (bar1 < 60) { // update code
            setBar1(bar1 + 1)
          }
        }, 20); 

        const timer2 = setInterval(() => {
            if (bar2 < 40) { // update code
              setBar2(bar2 + 1)
            }
          }, 20); 
    
        return () => {
          clearInterval(timer);
          clearInterval(timer2)
        };
      }, [bar1, bar2]);

      const bounceAnimation = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }
  `;

    return (
    <Container>
        <Stack spacing={5}>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5"}}>
            <Progress color='red' value={bar1} width='sm' height='64px' alignSelf={'center'} />
            <Heading marginLeft={8} fontSize={64}> {bar1}%</Heading>
            <style>{bounceAnimation}</style>
            <Icon as={barUp1 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp1 ? "green.500" : "red.500"} marginLeft={4} style={{
          animation: "bounce 1s infinite",
        }}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Progress color='red' value={bar2} width='sm' height='64px' alignSelf={'center'} />
            <Heading marginLeft={8} fontSize={64}> {bar2}%</Heading>
            <style>{bounceAnimation}</style>
            <Icon as={barUp2 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp2 ? "green.500" : "red.500"} marginLeft={4} style={{
          animation: "bounce 1s infinite",
        }}/>
            </Box>
        </Stack>

    </Container>
    );
}

export default Scores;