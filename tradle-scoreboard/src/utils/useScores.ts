import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Score } from './../types';


export const useScores = (testData: Score[]) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // This useEffect hook runs once on component mount.
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

  // This useEffect hook runs whenever the selected date changes.
  useEffect(() => {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    const loadedScores = localStorage.getItem(formattedDate);
    if (loadedScores) {
      setScores(JSON.parse(loadedScores));
    } else {
      setScores([]);
    }
  }, [selectedDate]);

  const handleScoreSubmit = (newScore: Score) => {
    // Add the new score to the scores array.
    const updatedScores = [...scores, newScore];

    // Sort the array first by attempts, then by name in alphabetical order.
    updatedScores.sort((a, b) => a.attempts - b.attempts || a.name.localeCompare(b.name));

    // Recalculate ranks based on the current position in the sorted array.
    let currentRank = 1;
    let prevAttempts = updatedScores[0].attempts;
    for (let i = 0; i < updatedScores.length; i++) {
      // Increase the rank only if the current attempts is greater than the previous attempts.
      if (updatedScores[i].attempts > prevAttempts) {
        currentRank = i + 1;
        prevAttempts = updatedScores[i].attempts;
      }
      updatedScores[i].rank = currentRank;
    }

    // Set the new scores array.
    setScores(updatedScores);

    // After setting scores, also store them in local storage.
    localStorage.setItem(newScore.date, JSON.stringify(updatedScores));
    // Also set the scores state to the scores for the selected day.
    setScores(updatedScores.filter(score => score.date === dayjs(selectedDate).format('YYYY-MM-DD')));
  };

  return { scores, selectedDate, handleScoreSubmit, setSelectedDate };
};