import React, { useState } from "react";
import { Flex, Text, Box, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onDateChange: (date: Date) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  
  return (
    <Flex as="nav" justify="space-between" align="center" p={4} bg="#1f1f1f">
      <Text fontSize="xl" fontWeight="bold" color="white">Tradle Scoreboard 🏆</Text>
      <Stack direction="row" spacing={3}>
        <Box as={Link} to="/" p={2} borderRadius="md" bg="#333" _hover={{ bg: "#444" }} color={"white"}>
          Today's Score
        </Box>
        <Box as={Link} to="/this-week" p={2} borderRadius="md" bg="#333" _hover={{ bg: "#444" }} color={"white"}>
          This Week's Score
        </Box>
        <Box as={Link} to="/previous-scores" p={2} borderRadius="md" bg="#333" _hover={{ bg: "#444" }} color={"white"}>
          Previous Scores
        </Box>
      </Stack>
    </Flex>
  );
};

export default Navbar;
