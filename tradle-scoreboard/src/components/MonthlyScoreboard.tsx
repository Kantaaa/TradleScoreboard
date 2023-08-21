import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Score } from '../types';
import { assignRanks } from '../utils/scoreUtils';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Text, Center, Stack, Button, HStack } from "@chakra-ui/react";

const MonthlyScoreboard: React.FC = () => {
  const [monthlyScores, setMonthlyScores] = useState<Score[]>([]);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - monthOffset);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const scoresRef = collection(db, 'scores');
    const monthlyScores: Score[] = [];

    const fetchScores = async () => {
      for (let day = 1; day <= 31; day++) {
        const date = new Date(year, month, day);
        if (date.getMonth() !== month) break;
    
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
    
        const dateString = date.toISOString().split('T')[0];
        const dayQuery = query(scoresRef, where('date', '==', dateString));
        const snapshot = await getDocs(dayQuery);
    
        snapshot.docs.forEach((doc) => {
          monthlyScores.push({
            id: doc.id,
            ...doc.data() as Score,
          });
        });
      }
    
      setMonthlyScores(monthlyScores);
    };
    

    fetchScores();
  }, [monthOffset]);

  // Aggregate scores for each player over the month
  const aggregatedScores: { [name: string]: number } = {};
  monthlyScores.forEach((score) => {
    const normalizedName = score.name.toUpperCase();
    if (aggregatedScores[normalizedName]) {
      aggregatedScores[normalizedName] += score.attempts;
    } else {
      aggregatedScores[normalizedName] = score.attempts;
    }
  });

  const aggregatedScoreArray: Score[] = Object.keys(aggregatedScores).map((name) => ({
    name,
    attempts: aggregatedScores[name],
    rank: 0,
    date: '',
  }));

  const sortedScores = assignRanks(aggregatedScoreArray);

  return (
    <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">
      <Center mb={8}>
        <Text fontSize="3xl" color="black" as={"b"}>Monthly Leaderboard 🏆</Text>
      </Center>
      <Center mb={2}>
        <HStack spacing={4}>
          <Button width="auto" onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))} disabled={monthOffset === 0}>Next Month</Button>
          <Button width="auto" onClick={() => setMonthOffset(monthOffset + 1)}>Previous Month</Button>
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

export default MonthlyScoreboard;
