import * as React from 'react';
import { useState, useEffect } from 'react';
import { db } from './utils/firebase.js';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Scoreboard from './components/Scoreboard';
import ScoreForm from './components/ScoreForm';
import { Score } from './types';
import { Stack, ChakraProvider, Button } from "@chakra-ui/react";
import { assignRanks } from './utils/scoreUtils';
import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import WeeklyScoreboard from './components/WeeklyScoreboard';
import MonthlyScoreboard from './components/MonthlyScoreboard';


import "react-datepicker/dist/react-datepicker.css";


const App: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const handleSubmitScore = async (newScore: Score) => {
      try {
        // Debugging line to print the score object before adding it to Firestore
        console.log("Adding score:", newScore);
        
        await addDoc(collection(db, "scores"), newScore);
        console.log("Score added successfully");
      } catch (error) {
        console.error("Error adding score:", error);
      }
    };
    
    useEffect(() => {
        const scoresCollection = collection(db, 'scores');

        const unsubscribe = onSnapshot(scoresCollection, (snapshot) => {
            const newScores = snapshot.docs.map((doc) => {
                const data = doc.data() as Score; // Assert the data as Score type
                return {
                    id: doc.id,
                    ...data
                };
            });
            
            setScores(newScores);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const filteredScores = scores.filter(score => score.date === selectedDate.toISOString().split('T')[0]);
    // Sort by attempts in ascending order
    filteredScores.sort((a, b) => a.attempts - b.attempts || a.name.localeCompare(b.name));
    const rankedScores = assignRanks(filteredScores);


  
    //Add test data 
    const addTestData = () => {
      const players = ['Kevin', 'Alice', 'Bob', 'Charlie', 'David', 'Eve'];
      const days = [0, 1, 2, 3, 4]; // Monday to Friday
  
      players.forEach((player) => {
        days.forEach((day) => {
          const date = new Date();
          date.setDate(date.getDate() + day);
          const dateString = date.toISOString().split('T')[0];
          
          const attempts = Math.floor(Math.random() * 6) + 1; // Random attempts between 1 and 6
          const testScore: Score = {
            name: player,
            attempts,
            date: dateString,
            rank: 0
          };
  
          handleSubmitScore(testScore);
        });
      });
    };
    
  

    //Main content

    const MainContent: React.FC<{ onSubmitScore: (newScore: Score) => Promise<void>; rankedScores: Score[] }> = ({ onSubmitScore, rankedScores }) => {
        const location = useLocation(); 
      
        return (
          <Stack spacing={5}>
            <Navbar onDateChange={setSelectedDate} />
            {location.pathname !== '/this-week' && <ScoreForm onSubmitScore={onSubmitScore} />}
                      {/* <Button onClick={addTestData}>Add Test Data</Button> */}
                      
            <Routes>
              <Route path="/" element={<Scoreboard scores={rankedScores} />} />
              <Route path="/weekly" element={<WeeklyScoreboard/>} />
              <Route path="/monthly" element={<MonthlyScoreboard/>} />
            </Routes>
          </Stack>
        );
      };


      return (
        <ChakraProvider>
          <Router>
            <MainContent onSubmitScore={handleSubmitScore} rankedScores={rankedScores} />
          </Router>
        </ChakraProvider>
      );
}

export default App;
