import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Score } from './../types';
import { collection, query, where, getDocs,addDoc, doc, setDoc  } from "firebase/firestore"; // <-- Import necessary Firestore functions
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

  const assignRanks = (sortedScores: Score[]) => {
    let currentRank = 1;
    let prevAttempts = sortedScores[0].attempts;
    for (let i = 0; i < sortedScores.length; i++) {
      if (sortedScores[i].attempts !== prevAttempts) {
        currentRank = i + 1;
        prevAttempts = sortedScores[i].attempts;
      }
      sortedScores[i].rank = currentRank;
    }
    return sortedScores;
  };

  const handleScoreSubmit = async (newScore: Score) => {
    newScore.timestamp = Date.now();
    const updatedScores = [...scores, newScore];
    updatedScores.sort((a, b) => a.attempts - b.attempts || a.name.localeCompare(b.name));

    // Assign ranks
    const rankedScores = assignRanks(updatedScores);

    // Update the newScore rank based on the rankedScores
    const newScoreWithRank = rankedScores.find(s => s.id === newScore.id);
    if (newScoreWithRank) {
      newScore.rank = newScoreWithRank.rank;
    }

    // Save the new score with its rank to Firestore
    const scoresCollection = collection(db, 'scores');
    await addDoc(scoresCollection, newScore);

    setScores(rankedScores);
    localStorage.setItem(newScore.date, JSON.stringify(rankedScores));
    setScores(rankedScores.filter(score => score.date === dayjs(selectedDate).format('YYYY-MM-DD')));
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
