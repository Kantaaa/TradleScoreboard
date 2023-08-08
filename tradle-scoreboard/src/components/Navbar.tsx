import React, { useState } from "react";
import { Flex, Text, Box, LinkBox, LinkOverlay, Stack } from "@chakra-ui/react";
import DatePicker from "react-datepicker";

interface NavbarProps {
  onDateChange: (date: Date) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  
  return (
    <Flex as="nav" justify="space-between" align="center" p={4} bg="#1f1f1f">
      <Text fontSize="xl" fontWeight="bold" color="white">Tradle Scoreboard 🏆</Text>
      <Stack direction="row" spacing={3}>
        <LinkBox as="a" href="/" p={2} borderRadius="md" bg="#333" _hover={{ bg: "#444" }}>
          <LinkOverlay color={"white"}>Today's Score</LinkOverlay>
        </LinkBox>
        <LinkBox as="a" href="/previous-scores" p={2} borderRadius="md" bg="#333" _hover={{ bg: "#444" }}>
          <LinkOverlay color={"white"}>Previous Scores</LinkOverlay>
        </LinkBox>
      </Stack>
    </Flex>
  );
};

export default Navbar;
