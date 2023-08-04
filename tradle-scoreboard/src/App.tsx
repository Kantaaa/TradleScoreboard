import * as React from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Scoreboard from './components/Scoreboard';
import styled from 'styled-components';


interface Score {
  name: string;
  attempts: number;
  rank: number;
}

const testData: Score[] = Array.from({ length: 25 }, (_, i) => ({
  rank: i + 1,
  name: `Player ${i + 1}`,
  attempts: i % 6 + 1,
}));

const AppContainer = styled.div`
  background-color: #333;
  min-height: 100vh;
  padding: 20px;
  color: #ddd;
`;



const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #ddd;
  outline: none;
  transition: all 0.3s ease-in-out;
  width: 200px;
  &:focus {
    border-bottom: 2px solid #f0c14b;
    box-shadow: 0 1px 6px 0 rgba(0,0,0,0.1);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  outline: none;
  background-color: #f0c14b;
  color: #111;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #ff9900;
  }
`;


const App: React.FC = () => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [scores, setScores] = useState<Score[]>(testData); // Initialize with testData


  //Logic -- Handlesubmit

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    // Parse the score to get the number of attempts.
    let attempts;
    try {
      attempts = Number(score.split(' ')[2].split('/')[0]);
      if (isNaN(attempts)) {
        throw new Error();
      }
    } catch {
      attempts = "Wrong score format";
    }
  
    // Create the new score.
    const newScore = { name, score, attempts, rank: 0 };
  
    // Add the new score to the scores array.
    const updatedScores = [...scores, newScore];
  
    // Sort the array first by attempts (if numbers) and then alphabetically.
    updatedScores.sort((a, b) => {
      if (typeof a.attempts === 'number' && typeof b.attempts === 'number') {
        if (a.attempts !== b.attempts) {
          return a.attempts - b.attempts;
        }
      } else {
        // If attempts are strings, check if one of them is "Wrong score format"
        if (a.attempts === "Wrong score format") return 1;
        if (b.attempts === "Wrong score format") return -1;
      }
    
      // If attempts are equal, sort alphabetically.
      return a.name.localeCompare(b.name);
    });
    
  
    // Recalculate ranks based on the current position in the sorted array.
    let currentRank = 1;
    let uniqueScoresCount = updatedScores[0].attempts;
    for (let i = 0; i < updatedScores.length; i++) {
      if (i > 0 && updatedScores[i].attempts !== updatedScores[i - 1].attempts) {
        currentRank++;
        uniqueScoresCount = updatedScores[i].attempts;
      }
      updatedScores[i].rank = currentRank;
    }
  
    // Set the new scores array.
    setScores(updatedScores as Score[]); // Add "as Score[]" to typecast the array
  
    // Reset the input fields.
    setName('');
    setScore('');
  };
  
  
  

  return (
    <AppContainer>
      <Navbar/>
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name"/>
        <Input type="text" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score"/>
        <Button type="submit">Submit</Button>
      </Form>
      <Scoreboard scores={scores}/> 
    </AppContainer>
  );
};

export default App;
