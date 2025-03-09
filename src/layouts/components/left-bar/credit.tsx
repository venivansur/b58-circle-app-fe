import { Box, Text, Link, Icon, Flex } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

export function Credit() {
  return (
    <Box
      
      color="white"
      px={6}
      py={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Flex align="center" mb={2}>
        <Text>Developed by</Text>
        <Text fontWeight="bold" ml={1}>
        Veni Vansurya
        </Text>
        <Text mx={2}>•</Text>
        
   
        <Flex gap={4}>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
          <Icon color={"white"} > 
            <FaGithub/> 
            </Icon>
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Icon color={"white"} > 
              <FaLinkedin/> 
               </Icon>
          </Link>
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <Icon color={"white"} > 
            <FaFacebook/> 
             </Icon>
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Icon color={"white"} > 
            <FaInstagram/>
              </Icon>
          </Link>
        </Flex>
      </Flex>

      <Text fontSize="sm">
        Powered by{" "}
        <Box as="span" fontWeight="bold" color="orange.400">
          DumbWays Indonesia
        </Box>{" "}
        • #1 Coding Bootcamp
      </Text>
    </Box>
  );
}
