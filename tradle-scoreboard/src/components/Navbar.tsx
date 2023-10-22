import * as React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Flex, Text, Box, Stack } from "@chakra-ui/react";
import { Link as rLink } from "react-router-dom";
import HouseRules from "./HouseRules";

interface NavbarProps {
  onDateChange: (date: Date) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onDateChange }: NavbarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex as="nav" justify="space-between" align="center" p={4} bg="#1f1f1f">
      <Stack direction="row" spacing={3}>
        <Text fontSize="3xl" fontWeight="bold" color="white">
          Tradle Scoreboard 🏆
        </Text>
        <Box
          as={rLink}
          to="/"
          p={2}
          borderRadius="md"
          bg="#333"
          _hover={{ bg: "#444" }}
          color={"white"}
          onClick={() => window.open("https://oec.world/en/tradle/", "_blank")}
        >
          Tradle Game🗺️
        </Box>
        <Box
          as={rLink}
          to="/"
          p={2}
          borderRadius="md"
          bg="#333"
          _hover={{ bg: "#444" }}
          color={"white"}
          onClick={onOpen} 
        >
          House Rules📝
        </Box>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Box
          as={rLink}
          to="/"
          p={2}
          borderRadius="md"
          bg="#333"
          _hover={{ bg: "#444" }}
          color={"white"}
        >
          Daily Score
        </Box>
        <Box
          as={rLink}
          to="/weekly"
          p={2}
          borderRadius="md"
          bg="#333"
          _hover={{ bg: "#444" }}
          color={"white"}
        >
          Weekly Score
        </Box>
        <Box
          as={rLink}
          to="/monthly"
          p={2}
          borderRadius="md"
          bg="#333"
          _hover={{ bg: "#444" }}
          color={"white"}
        >
          Monthly Score
        </Box>
      </Stack>
      <HouseRules isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Navbar;
