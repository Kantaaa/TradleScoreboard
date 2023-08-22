import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Score } from '../types';
import { assignRanks } from '../utils/scoreUtils';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Text, Center, Stack, Button, HStack } from "@chakra-ui/react";

  const WeeklyScoreboard: React.FC = () => {
    const [weeklyScores, setWeeklyScores] = useState<Score[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    // Calculate start and end dates for the current work week (Monday to Friday)
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7 * weekOffset); // Adjust date based on weekOffset
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 5);

    const scoresRef = collection(db, 'scores');
    const q = query(scoresRef, where('date', '>=', startOfWeek.toISOString().split('T')[0]), where('date', '<=', endOfWeek.toISOString().split('T')[0]));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newScores = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as Score,
      }));
      setWeeklyScores(newScores);
    });

    return () => {
      unsubscribe();
    };
  }, [weekOffset]);

  
// Aggregate scores for each player over the week
const aggregatedScores: { [name: string]: { totalAttempts: number, totalGames: number } } = {};
weeklyScores.forEach((score) => {
  const normalizedName = score.name.toUpperCase(); // Normalize the name to upper
  if (aggregatedScores[normalizedName]) {
    aggregatedScores[normalizedName].totalAttempts += score.attempts;
    aggregatedScores[normalizedName].totalGames += 1;
  } else {
    aggregatedScores[normalizedName] = { totalAttempts: score.attempts, totalGames: 1 };
  }
});

const aggregatedScoreArray: Score[] = Object.keys(aggregatedScores).map((name) => {
  const { totalAttempts, totalGames } = aggregatedScores[name];
  const averageAttempts = totalAttempts / totalGames;
  return {
    name,
    attempts: averageAttempts, // Now storing the average attempts
    rank: 0,
    date: '', // Date is not relevant for aggregated scores
  };
});

// Sort and rank the aggregated scores
const sortedScores = assignRanks(aggregatedScoreArray);

  

return (
  <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">
    <Center mb={8}>
      <Text fontSize="3xl" color="black" as={"b"}>Weekly Leaderboard 🏆</Text>
      </Center>
      <Center mb={2}>
    <HStack spacing={4}> 
      <Button width="auto" onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0}>Next Week</Button>
      <Button width="auto" onClick={() => setWeekOffset(weekOffset + 1)}>Previous Week</Button>
      </HStack>
      </Center>
      <ChakraTable variant="simple" size="lg" width="80%" m="auto" bg="#333" borderRadius="md" boxShadow="2xl" color="white">
        <Thead>
          <Tr>
            <Th color="white">Rank</Th>
            <Th color="white">Name</Th>
            <Th color="white">Attempts</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedScores.map((score, index) => (
            <Tr key={index}>
              <Td>{score.rank}</Td>
              <Td>{score.name}</Td>
              <Td>{score.attempts}</Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </Stack>
  );
};

export default WeeklyScoreboard;
