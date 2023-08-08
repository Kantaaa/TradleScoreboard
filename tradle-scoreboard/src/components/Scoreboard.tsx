import * as React from 'react';
import { useState } from 'react';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Button as ChakraButton, Text, Center, Stack, AbsoluteCenter } from "@chakra-ui/react";
import { Title } from '../styles/Navbar.styles';

interface Score {
  name: string;
  attempts: number;
  rank: number;
}

interface ScoreboardProps {
  scores: Score[];
}

const PAGE_SIZE = 10;

const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedScores = scores.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">

    <Box > 
      <Center mb={8}>
        <Text fontSize="3xl" color="black" as={"b"} >Today's Leaderboard 🏆</Text>
      </Center>
      <ChakraTable  variant="simple" size="lg" width="80%" m="auto" bg="#333" borderRadius="md" boxShadow="2xl" color="white">
        <Thead>
          <Tr  >
            <Th  color="white" >Rank</Th>
            <Th  color="white">Name</Th>
            <Th  color="white">Attempts</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedScores.map((score, index) => (
            <Tr key={index}>
              <Td>{score.rank}</Td>
              <Td>{score.name}</Td>
              <Td>{score.attempts}/6</Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
      <Center mt={6}>
        {currentPage > 1 && 
          <ChakraButton colorScheme="blue" onClick={() => setCurrentPage(currentPage - 1)} mr={3}>Previous</ChakraButton>}
        {currentPage < Math.ceil(scores.length / PAGE_SIZE) && 
          <ChakraButton colorScheme="blue" onClick={() => setCurrentPage(currentPage + 1)}>Next</ChakraButton>}
      </Center>
    </Box>
          </Stack>
  );
};

export default Scoreboard;
