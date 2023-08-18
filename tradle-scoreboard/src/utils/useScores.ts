import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Score } from './../types';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from './firebase';
import { assignRanks } from './../utils/scoreUtils';

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
    
    let fetchedScores: Score[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Score
    }));

    return assignRanks(fetchedScores); // Assign ranks to fetched scores and return
  };

  const handleScoreSubmit = async (newScore: Score) => {
    newScore.timestamp = Date.now();
    const updatedScores = [...scores, newScore];
    updatedScores.sort((a, b) => a.attempts - b.attempts || a.name.localeCompare(b.name));

    // After sorting and ranking
    const rankedScores = assignRanks(updatedScores);

    // Save the new score to Firestore (no need to save rank as it's computed dynamically)
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

    // Assign ranks to merged scores
    const rankedMergedScores = assignRanks(mergedScores);

    localStorage.setItem(dayjs(selectedDate).format('YYYY-MM-DD'), JSON.stringify(rankedMergedScores));
    setScores(rankedMergedScores);
  };

  useEffect(() => {
    syncWithFirestore();
  }, [selectedDate]);

  return { scores, selectedDate, handleScoreSubmit, setSelectedDate };
};
