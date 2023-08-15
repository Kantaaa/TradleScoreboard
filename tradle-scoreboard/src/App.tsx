import * as React from 'react';
import { useState, useEffect } from 'react';
import { db } from './utils/firebase.js';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Scoreboard from './components/Scoreboard';
import ScoreForm from './components/ScoreForm';
import { Score } from './types';
import { Stack, ChakraProvider } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";

const App: React.FC = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleSubmitScore = async (newScore: Score) => {
        try {
            await addDoc(collection(db, "scores"), newScore);
            setScores(prevScores => [...prevScores, newScore]);
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

    return (
        <ChakraProvider>
            <Stack spacing={5}>
                <Navbar onDateChange={setSelectedDate} />
                <ScoreForm onSubmitScore={handleSubmitScore} />
                <Scoreboard scores={filteredScores} />
            </Stack>
        </ChakraProvider>
    );
}

export default App;
