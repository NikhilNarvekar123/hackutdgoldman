import { Stack, Progress, Text, Box, Heading, Container, Icon, extendTheme } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

const Scores = ({ score1, barUp1, score2, barUp2, score3, barUp3, score4, barUp4 }) => {

    const [bar1, setBar1] = useState(100*(score1 < 0))
    const [bar2, setBar2] = useState(100*(score2 < 0))

    const [bar3, setBar3] = useState(100*(score3 < 0))
    const [bar4, setBar4] = useState(100*(score4 < 0))

    useEffect(() => {
        const timer = setInterval(() => {
          if (bar1 < score1) { // update code
            setBar1(bar1 + 1)
          }
          if (score1 < 0 && bar1 > 100 + score1) { // score = -11, then bar1 = 89
            setBar1(bar1 - 1)
          }
        }, 30); 

        const timer2 = setInterval(() => {
            if (bar2 < score2) { // update code
              setBar2(bar2 + 1)
            } 
            if (score2 < 0 && bar2 > 100 + score2) { // score = -11, then bar1 = 89
                setBar2(bar2 - 1)
              }
          }, 30); 

          const timer3 = setInterval(() => {
            if (bar3 < score3) { // update code
              setBar3(bar3 + 1)
            } 
            if (score3 < 0 && bar3 > 100 + score3) { // score = -11, then bar1 = 89
                setBar3(bar3 - 1)
              }
          }, 30); 
  
          const timer4 = setInterval(() => {
              if (bar4 < score4) { // update code
                setBar4(bar4 + 1)
              } 
              if (score4 < 0 && bar4 > 100 + score4) { // score = -11, then bar1 = 89
                setBar4(bar4 - 1)
              }
            }, 30); 
    
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
    <Container maxWidth={'3xl'}>
        <Stack spacing={5}>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5"}}>
            <Box position="relative">
            <Progress value={bar1} width='sm' height='64px' alignSelf={'center'} bgColor={score1 < 0 ? "red.400" : ""} colorScheme={score1 < 2 ? "facebook" : "blue"}/>
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Popularity Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64}> {score1}</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp1 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp1 ? "green.500" : "red.500"} marginLeft={2}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Box position="relative">
            <Progress color='red' value={bar2} width='sm' height='64px' alignSelf={'center'} bgColor={score2 < 0 ? "red.400" : ""} colorScheme={score2 < 2 ? "facebook" : "blue"}/>
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Perception Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64}> {score2}</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp2 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp2 ? "green.500" : "red.500"} marginLeft={2}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Box position="relative">
            <Progress color='red' value={bar3} width='sm' height='64px' alignSelf={'center'} bgColor={score3 < 0 ? "red.400" : ""} colorScheme={score3 < 2 ? "facebook" : "blue"}/>
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Statistical Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64}> {score3}</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp3 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp3 ? "green.500" : "red.500"} marginLeft={2}/>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", color: "#42A5F5" }}>
            <Box position="relative">
            <Progress color='red' value={bar4} width='sm' height='64px' alignSelf={'center'} bgColor={score4 < 0 ? "red.400" : ""} colorScheme={score4 < 2 ? "facebook" : "blue"}/>
            <Text position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        color="white"
        fontWeight={"bold"}>Base Score</Text>
            </Box>
            <Heading marginLeft={8} fontSize={64} > {score4}</Heading>
            {/* <style>{bounceAnimation}</style> */}
            <Icon as={barUp4 ? MdArrowUpward : MdArrowDownward} boxSize={10} color={barUp4 ? "green.500" : "red.500"} marginLeft={2}/>
            </Box>
        </Stack>

    </Container>
    );
}

export default Scores;