import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Score } from "../types";
import { calculatePoints } from "../utils/scoreUtils";
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Center,
  Stack,
  Button,
  HStack,
} from "@chakra-ui/react";

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
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - monthOffset);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const scoresRef = collection(db, "scores");
    const monthlyScores: Score[] = [];

    const fetchScores = async () => {
      try {
        const startOfMonth = new Date(Date.UTC(year, month, 1));
        const endOfMonth = new Date(Date.UTC(year, month + 1, 0));

        // Log the start and end of the month to verify the correct range
        console.log(
          `Fetching scores from ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`
        );

        for (let day = 1; day <= endOfMonth.getUTCDate(); day++) {
          // Use UTC date for comparison
          const date = new Date(Date.UTC(year, month, day));
          const dateString = date.toISOString().split("T")[0];
          const dayQuery = query(scoresRef, where("date", "==", dateString));
          const snapshot = await getDocs(dayQuery);

          snapshot.docs.forEach((doc) => {
            const scoreData = doc.data() as Score;
            const normalizedName = scoreData.name.toUpperCase(); // Normalize the name to upper case
            monthlyScores.push({
              id: doc.id,
              ...scoreData,
              name: normalizedName, // Use the normalized name
            });
          });
        }

        setMonthlyScores(monthlyScores);
        console.log("Fetched monthly scores:", monthlyScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, [monthOffset]);

  const aggregatedScores: { [name: string]: AggregatedScore } = {};
  monthlyScores.forEach((score) => {
    const normalizedName = score.name.toUpperCase();
    if (aggregatedScores[normalizedName]) {
      // If so, update the existing entry
      aggregatedScores[normalizedName].totalAttempts += score.attempts;
      aggregatedScores[normalizedName].totalGames += 1;
      aggregatedScores[normalizedName].gamesPlayed =
        aggregatedScores[normalizedName].totalGames;
    } else {
      // If not, create a new entry for this name
      aggregatedScores[normalizedName] = {
        totalAttempts: score.attempts,
        totalGames: 1,
        gamesPlayed: 1,
      };
    }
  });

  console.log("Aggregated scores:", aggregatedScores);

  const aggregatedScoreArray: Score[] = Object.keys(aggregatedScores).map(
    (name) => {
      const { totalAttempts, totalGames, gamesPlayed } = aggregatedScores[name];
      const averageAttempts = totalAttempts / totalGames;
      const totalPoints =
        calculatePoints(Math.round(averageAttempts)) * (gamesPlayed ?? 0);

      return {
        name,
        attempts: averageAttempts,
        rank: 0,
        date: "",
        gamesPlayed,
        totalPoints,
      };
    }
  );
  console.log("Aggregated score array before sorting:", aggregatedScoreArray);

  // Sort by total points
  const sortedScores = aggregatedScoreArray.sort(
    (a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0)
  );

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
  console.log("Sorted and ranked scores:", sortedScores);

  return (
    <Stack bg="whiteAlpha.600" p={5} borderRadius="md" boxShadow="md">
      <Center mb={8}>
        <Text fontSize="3xl" color="black" as={"b"}>
          Monthly Leaderboard 🏆
        </Text>
      </Center>
      <Center mb={2}>
        <HStack spacing={4}>
          <Button width="auto" onClick={() => setMonthOffset(monthOffset + 1)}>
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
      <ChakraTable
        variant="simple"
        size="lg"
        width="80%"
        m="auto"
        bg="#333"
        borderRadius="md"
        boxShadow="2xl"
        color="white"
      >
        <Thead>
          <Tr>
            <Th color="white">Rank</Th>
            <Th color="white">Name</Th>
            <Th color="white">Total Points</Th>
            <Th color="white">Points/Game</Th>
            <Th color="white">Games Played</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedScores.map((score, index) => (
            <Tr key={index}>
              <Td>{score.rank}</Td>
              <Td>{score.name}</Td>
              <Td>{score.totalPoints}</Td>
              <Td>
                {score.totalPoints && score.gamesPlayed
                  ? score.totalPoints / score.gamesPlayed
                  : 0}
              </Td>
              <Td>{score.gamesPlayed}</Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </Stack>
  );
};

export default MonthlyScoreboard;
