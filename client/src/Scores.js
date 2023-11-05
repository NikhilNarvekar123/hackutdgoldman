import { Stack, Progress, Text, Box, Heading, Container, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

const Scores = ({ score1, score2, score3, score4 }) => {

    const [bar1, setBar1] = useState(0)
    const [bar2, setBar2] = useState(0)
    const [barUp1, setBarUp1] = useState(true)
    const [barUp2, setBarUp2] = useState(false)

    const [bar3, setBar3] = useState(0)
    const [bar4, setBar4] = useState(0)
    const [barUp3, setBarUp3] = useState(true)
    const [barUp4, setBarUp4] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
          if (bar1 < score1) { // update code
            setBar1(bar1 + 1)
          }
        }, 20); 

        const timer2 = setInterval(() => {
            if (bar2 < score2) { // update code
              setBar2(bar2 + 1)
            }
          }, 20); 

          const timer3 = setInterval(() => {
            if (bar3 < score3) { // update code
              setBar3(bar3 + 1)
            }
          }, 20); 
  
          const timer4 = setInterval(() => {
              if (bar4 < score4) { // update code
                setBar4(bar4 + 1)
              }
            }, 20); 
    
        return () => {
          clearInterval(timer);
          clearInterval(timer2);
          clearInterval(timer3);
          clearInterval(timer4);
        };
      }, [bar1, bar2, bar3, bar4, score1, score2, score3, score4]);

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
            <Box position="relative">
            <Progress color='red' value={bar1} width='sm' height='64px' alignSelf={'center'} />
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Sentiment Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64}> {bar1}%</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp1 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp1 ? "green.500" : "red.500"} marginLeft={4}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Box position="relative">
            <Progress color='red' value={bar2} width='sm' height='64px' alignSelf={'center'} />
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Stat Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64}> {bar2}%</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp2 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp2 ? "green.500" : "red.500"} marginLeft={4}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Box position="relative">
            <Progress color='red' value={bar3} width='sm' height='64px' alignSelf={'center'} />
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Earnings Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64}> {bar3}%</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp3 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp3 ? "green.500" : "red.500"} marginLeft={4}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Box position="relative">
            <Progress color='red' value={bar4} width='sm' height='64px' alignSelf={'center'} />
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Final Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64} > {bar4}%</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp4 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp4 ? "green.500" : "red.500"} marginLeft={4}/>
            </Box>
        </Stack>

    </Container>
    );
}

export default Scores;