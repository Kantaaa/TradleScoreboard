import * as React from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Scoreboard from './components/Scoreboard';
import ScoreForm from './components/ScoreForm';
import "react-datepicker/dist/react-datepicker.css";
import { Score } from './types';
import { Stack } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";

const today = new Date();
const todayString = today.toISOString().split('T')[0]; 

// Test data for today with 15 players
const testData: Score[] = Array.from({ length: 15 }, (_, i) => ({
  rank: i + 1,
  name: `Player ${i + 1}`,
  attempts: i % 6 + 1,
  date: todayString,
}));

const App: React.FC = () => {
  const [scores, setScores] = useState<Score[]>(testData);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const handleSubmitScore = (newScore: Score) => {
    setScores((prevScores) => {
      
      // Append the new score to the existing scores
      const updatedScores = [...prevScores, newScore];

      // Sort the scores based on attempts (ascending)
      const sortedScores = updatedScores.sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return a.attempts - b.attempts;
      });

      // Re-assign rank values
      sortedScores.forEach((score, index) => {
        score.rank = index + 1;
      });
      
      return sortedScores;
    });
};

  return (
    <>
      <ChakraProvider>
        <Stack spacing={5}>
          <Navbar onDateChange={(date: Date) => setSelectedDate(date)} />
          <ScoreForm onSubmitScore={handleSubmitScore} />
          <Scoreboard scores={scores.filter(score => score.date === selectedDate.toISOString().split('T')[0])} />
        </Stack>
      </ChakraProvider>
    </>
  );
}

export default App;
