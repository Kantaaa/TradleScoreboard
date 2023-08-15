import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Score } from './../types';
import { collection, query, where, getDocs,addDoc  } from "firebase/firestore"; // <-- Import necessary Firestore functions
import { db } from './firebase';


export const useScores = (testData: Score[]) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const loadedScores = localStorage.getItem(today);
    if (loadedScores) {
      setScores(JSON.parse(loadedScores));
    } else {
      localStorage.setItem(today, JSON.stringify(testData));
      setScores(testData);
    }
  }, []);

  useEffect(() => {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    const loadedScores = localStorage.getItem(formattedDate);
    if (loadedScores) {
      setScores(JSON.parse(loadedScores));
    } else {
      setScores([]);
    }
  }, [selectedDate]);

  const fetchScoresFromFirestore = async (date: Date) => {
    const scoresCollection = collection(db, 'scores');
    const dateQuery = query(scoresCollection, where('date', '==', date.toISOString().split('T')[0]));
    const snapshot = await getDocs(dateQuery);
    
    const scores: Score[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Score
    }));

    return scores;
  };

  const handleScoreSubmit = async (newScore: Score) => {
    newScore.timestamp = Date.now();
    const updatedScores = [...scores, newScore];
    updatedScores.sort((a, b) => a.attempts - b.attempts || a.name.localeCompare(b.name));

    let currentRank = 1;
    let prevAttempts = updatedScores[0].attempts;
    for (let i = 0; i < updatedScores.length; i++) {
      if (updatedScores[i].attempts > prevAttempts) {
        currentRank = i + 1;
        prevAttempts = updatedScores[i].attempts;
      }
      updatedScores[i].rank = currentRank;
    }

    setScores(updatedScores);
    localStorage.setItem(newScore.date, JSON.stringify(updatedScores));
    setScores(updatedScores.filter(score => score.date === dayjs(selectedDate).format('YYYY-MM-DD')));
    // After setting scores, also store them in local storage.
    localStorage.setItem(newScore.date, JSON.stringify(updatedScores));
    // Also set the scores state to the scores for the selected day.
    setScores(updatedScores.filter(score => score.date === dayjs(selectedDate).format('YYYY-MM-DD')));

    // Store the new score in Firestore
    const scoresCollection = collection(db, 'scores');
    await addDoc(scoresCollection, newScore);
  };

  const syncWithFirestore = async () => {
    const firestoreScores = await fetchScoresFromFirestore(selectedDate);
    const localScoresString = localStorage.getItem(dayjs(selectedDate).format('YYYY-MM-DD'));
    const localScores = localScoresString ? JSON.parse(localScoresString) : [];

    const mergedScores = [...localScores, ...firestoreScores].reduce<Score[]>((acc, score) => {
      const existingScore = acc.find(s => s.id === score.id);
      if (!existingScore) {
        acc.push(score);
      } else if (score.timestamp && existingScore.timestamp && score.timestamp > existingScore.timestamp) {
        Object.assign(existingScore, score);
      }
      return acc;
    }, []);

    localStorage.setItem(dayjs(selectedDate).format('YYYY-MM-DD'), JSON.stringify(mergedScores));
    setScores(mergedScores);
  };

  useEffect(() => {
    syncWithFirestore();
  }, [selectedDate]);

  return { scores, selectedDate, handleScoreSubmit, setSelectedDate };
};
