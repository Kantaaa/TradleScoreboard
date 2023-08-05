import * as React from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Scoreboard from './components/Scoreboard';
import ScoreForm from './components/ScoreForm';
import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";
import { Score } from './types';
import {  AppContainer, GlobalStyle } from './styles/App.styles';

const date1 = new Date();
date1.setDate(date1.getDate() - 1); // sets the date to 1 day ago
const date1String = date1.toISOString().split('T')[0]; 

const date2 = new Date();
date2.setDate(date2.getDate() - 2); // sets the date to 2 days ago
const date2String = date2.toISOString().split('T')[0]; 

// test data for 04.08
const testData1: Score[] = Array.from({ length: 11 }, (_, i) => ({
  rank: i + 1,
  name: `Player ${i + 1}`,
  attempts: i % 6 + 1,
  date: date1String,
}));

// test data for 03.08
const testData2: Score[] = Array.from({ length: 11 }, (_, i) => ({
  rank: i + 1,
  name: `Player ${i + 11}`,  // to make player names unique
  attempts: (i + 2) % 6 + 1, // different attempt counts
  date: date2String,
}));

// Combine both arrays into a single array
const testData: Score[] = [...testData1, ...testData2];



const App: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // in App.tsx
const handleSubmitScore = (newScore: Score) => {
  setScores((prevScores) => {
    // calculate rank for new score
    const newRank = prevScores.filter(score => score.date === newScore.date).length + 1;
    
    // assign the rank to the new score
    newScore.rank = newRank;
    
    // return the updated scores array
    return [...prevScores, newScore];
  });
};


  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Navbar onDateChange={(date: Date) => setSelectedDate(date)} />
        <ScoreForm onSubmitScore={handleSubmitScore} />
        <Scoreboard scores={scores.filter(score => score.date === selectedDate.toISOString().split('T')[0])} />
      </AppContainer>
    </>
  );
}

export default App;
