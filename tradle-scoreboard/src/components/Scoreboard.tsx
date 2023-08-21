import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Button as ChakraButton, Text, Center, Stack, Input } from "@chakra-ui/react";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from './../utils/firebase'; 
import { assignRanks } from '../utils/scoreUtils';
import { Score } from './../types';




interface ScoreboardProps {
  scores: Score[];
}

const PAGE_SIZE = 10;

const fetchScoresForDate = async (date: string): Promise<Score[]> => {
  const scoresCollection = collection(db, 'scores');
  const dateQuery = query(scoresCollection, where('date', '==', date));
  const snapshot = await getDocs(dateQuery);
  
  const fetchedScores: Score[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Score
  }));

  return fetchedScores;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredScores, setFilteredScores] = useState<Score[]>([]);

  useEffect(() => {
    fetchScoresForDate(selectedDate).then((newScores: Score[]) => {
      // Sort the scores based on the number of attempts (ascending)
      const sortedScores = assignRanks(newScores);  
      setFilteredScores(sortedScores);
    });
  }, [selectedDate]);
  

  
  // Paginate the filtered scores
  const paginatedScores = filteredScores.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">
      <Center mb={8}>
        <Text fontSize="3xl" color="black" as={"b"}>Daily Leaderboard 🏆</Text>
      </Center>
      <Center>
        <Input
          width="auto"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Center>
      <Box>
        <ChakraTable variant="simple" size="lg" width="80%" m="auto" bg="#333" borderRadius="md" boxShadow="2xl" color="white">
          <Thead>
            <Tr>
              <Th color="white">Rank</Th>
              <Th color="white">Name</Th>
              <Th color="white">Attempts</Th>
            </Tr>
          </Thead>
          <Tbody>
  {filteredScores.length > 0 ? (
    paginatedScores.map((score, index) => (
      <Tr key={index}>
        <Td>{score.rank}</Td>  
        <Td>{score.name}</Td>
        <Td>{score.attempts}/6</Td>
      </Tr>
    ))
  ) : (
    <Tr>
      <Td colSpan={3}>
        <Center>
          <Text color="white">No data for the selected date.</Text>
        </Center>
      </Td>
    </Tr>
  )}
</Tbody>

        </ChakraTable>
        <Center mt={6}>
          {currentPage > 1 &&
            <ChakraButton colorScheme="blue" onClick={() => setCurrentPage(currentPage - 1)} mr={3}>Previous</ChakraButton>}
          {currentPage < Math.ceil(filteredScores.length / PAGE_SIZE) &&
            <ChakraButton colorScheme="blue" onClick={() => setCurrentPage(currentPage + 1)}>Next</ChakraButton>}
        </Center>
      </Box>
    </Stack>
  );
};

export default Scoreboard;
