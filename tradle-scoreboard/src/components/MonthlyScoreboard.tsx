import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Score } from '../types';
import { assignRanks, calculatePoints } from '../utils/scoreUtils';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Text, Center, Stack, Button, HStack } from "@chakra-ui/react";

type AggregatedScore = {
  totalAttempts: number;
  totalGames: number;
  gamesPlayed?: number;
  totalPoints?: number;
};

const MonthlyScoreboard: React.FC = () => {
  const [monthlyScores, setMonthlyScores] = useState<Score[]>([]);
  const [monthOffset, setMonthOffset] = useState(0);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - monthOffset);
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();  

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
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
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

  const aggregatedScores: { [name: string]: AggregatedScore } = {};
  monthlyScores.forEach((score) => {
    const normalizedName = score.name.toUpperCase();
    if (aggregatedScores[normalizedName]) {
      aggregatedScores[normalizedName].totalAttempts += score.attempts;
      aggregatedScores[normalizedName].totalGames += 1;
      aggregatedScores[normalizedName].gamesPlayed = aggregatedScores[normalizedName].totalGames;
    } else {
      aggregatedScores[normalizedName] = { totalAttempts: score.attempts, totalGames: 1, gamesPlayed: 1 };
    }
  });
  const aggregatedScoreArray: Score[] = Object.keys(aggregatedScores).map((name) => {
    const { totalAttempts, totalGames, gamesPlayed } = aggregatedScores[name];
    const averageAttempts = totalAttempts / totalGames;
    const totalPoints = calculatePoints(Math.round(averageAttempts)) * (gamesPlayed ?? 0);
    return {
      name,
      attempts: averageAttempts,
      rank: 0,
      date: '',
      gamesPlayed,
      totalPoints
    };
  });


  // Sort by total points
  const sortedScores = aggregatedScoreArray.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));

  // Assign ranks based on totalPoints
  let currentRank = 1;
  let lastPoints = -1;
  let realRank = 1;
  sortedScores.forEach((score, index) => {
    if (score.totalPoints !== lastPoints) {
      currentRank = realRank;
    }
    score.rank = currentRank;
    lastPoints = score.totalPoints;
    realRank++;
  });


  return (
    <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">
       <Center mb={8}>
        <Text fontSize="3xl" color="black" as={"b"}>Monthly Leaderboard 🏆</Text>
      </Center>
      <Center mb={2}>
        <HStack spacing={4}>
          <Button 
            width="auto" 
            onClick={() => setMonthOffset(monthOffset + 1)}
          >
            Prev Month
          </Button>

          <Button 
            width="auto" 
            onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))} 
            disabled={monthOffset === 0}
          >
            Next Month
          </Button>
        </HStack>
      </Center>
        <Center>
        <Text fontSize="xl" as={"b"} color="black">
          {currentMonth.toUpperCase()} {currentYear}
        </Text>
          </Center>  
      <ChakraTable variant="simple" size="lg" width="80%" m="auto" bg="#333" borderRadius="md" boxShadow="2xl" color="white">
        
        <Thead>
          <Tr>
            <Th color="white">Rank</Th>
            <Th color="white">Name</Th>
            <Th color="white">Total Points</Th> 
            <Th color="white">Attempts</Th>
            <Th color="white">Games Played</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedScores.map((score, index) => (
            <Tr key={index}>
              <Td>{score.rank}</Td>
              <Td>{score.name}</Td>
              <Td>{score.totalPoints}</Td>
              <Td>{score.attempts}</Td>
              <Td>{score.gamesPlayed}</Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </Stack>
  );
};

export default MonthlyScoreboard;