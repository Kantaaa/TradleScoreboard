import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Score } from '../types';
import { assignRanks, calculatePoints } from '../utils/scoreUtils';
import { Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Text, Center, Stack, Button, HStack } from "@chakra-ui/react";

type AggregatedScore = {
  totalAttempts: number;
  totalGames: number;
  gamesPlayed?: number;
  totalPoints?: number;
};

const WeeklyScoreboard: React.FC = () => {
  const [weeklyScores, setWeeklyScores] = useState<Score[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7 * weekOffset);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 5);

    const scoresRef = collection(db, 'scores');
    const weeklyQuery = query(scoresRef, where('date', '>=', startOfWeek.toISOString().split('T')[0]), where('date', '<=', endOfWeek.toISOString().split('T')[0]));

 

    const unsubscribe = onSnapshot(weeklyQuery, (snapshot) => {
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

  const aggregatedScores: { [name: string]: AggregatedScore } = {};

  weeklyScores.forEach((score) => {
    const normalizedName = score.name.toUpperCase();
    if (typeof score.attempts !== 'number') {
      console.error("score.attempts is not a number for ", normalizedName);
      return;
    }
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
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

      //log the fetched scores
      console.log(weeklyScores);

  //Get current week number
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7 * weekOffset);
  const weekNumber = getWeekNumber(currentDate);

  return (
    <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">
      <Center mb={8}>
        <Text fontSize="3xl" color="black" as={"b"}>Weekly Leaderboard 🏆</Text>
      </Center>
      <Center mb={2}>
        <HStack spacing={4}>
          <Button width="auto" onClick={() => setWeekOffset(weekOffset + 1)}>Prev Week</Button>
          <Button width="auto" onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0}>Next Week</Button>

        </HStack>
      </Center>
      <Center>
        <Text fontSize="xl" as={"b"} color="black"> Week {weekNumber} </Text>
      </Center>
      <ChakraTable variant="simple" size="lg" width="80%" m="auto" bg="#333" borderRadius="md" boxShadow="2xl" color="white">
        <Thead>
          <Tr>
            <Th color="white">Rank</Th>
            <Th color="white">Name</Th>
            <Th color="white">Total Points</Th>
            <Th color="white">Average Attempts</Th>
            <Th color="white">Games Played</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedScores.map((score, index) => (
            <Tr key={index}>
              <Td>{score.rank}</Td>
              <Td>{score.name}</Td>
              <Td>{score.totalPoints ?? 0}</Td>
              <Td>{Math.round(score.attempts)}</Td>
              <Td>{score.gamesPlayed ?? 0}</Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </Stack>
  );
};

export default WeeklyScoreboard;
