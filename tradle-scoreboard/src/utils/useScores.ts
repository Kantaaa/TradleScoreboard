import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Score } from './../types';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
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
    try {
        // Fetch all scores for the current date from the database
        const currentScores = await fetchScoresFromFirestore(selectedDate);
        
        // Add the new score to this list
        const allScores = [...currentScores, newScore];
        
        // Compute the ranks for all scores
        const rankedScores = assignRanks(allScores);
        
        // Find the rank of the new score
        const newScoreWithRank = rankedScores.find(score => score.name === newScore.name && score.attempts === newScore.attempts);
        
        if (newScoreWithRank) {
            // Write the new score with its computed rank to the database
            await addDoc(collection(db, "scores"), newScoreWithRank);
            
            // Update any existing scores in the database that have changed rank values
            for (const score of rankedScores) {
                if (score.id) {
                    await updateDoc(doc(db, "scores", score.id), {
                        ...score,
                        rank: score.rank  // Ensure rank is included in the data being written
                    });
                } else {
                  console.error("Score ID is undefined:", score);
              }
            }
        }
    } catch (error) {
        console.error("Error adding/updating score:", error);
    }
};


  const syncWithFirestore = async () => {
    const firestoreScores = await fetchScoresFromFirestore(selectedDate);
    const localScoresString = localStorage.getItem(dayjs(selectedDate).format('YYYY-MM-DD'));
    const localScores = localScoresString ? JSON.parse(localScoresString) : [];

    const mergedScores = [...localScores, ...firestoreScores].reduce<Score[]>((acc, score) => {
      if (score.id) {
        const existingScore = acc.find(s => s.id === score.id);
        if (!existingScore) {
          acc.push(score);
        } else if (score.timestamp && existingScore.timestamp && score.timestamp > existingScore.timestamp) {
          Object.assign(existingScore, score);
        }
      } else {
        // If the score doesn't have an id, it's a locally added score
        // Check if it's already in the accumulator based on other properties (e.g., name, attempts, timestamp)
        const existingScore = acc.find(s => s.name === score.name && s.attempts === score.attempts && s.timestamp === score.timestamp);
        if (!existingScore) {
          acc.push(score);
        }
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
    // Check and archive previous day's scores
    const archivePreviousDayScores = async () => {
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      const scoresFromYesterday = scores.filter(score => score.date === yesterday);

      if (scoresFromYesterday.length > 0) {
          // Move them to archived_scores collection and remove from scores collection
          for (let score of scoresFromYesterday) {
              await addDoc(collection(db, 'archived_scores'), score);
              // Assuming score has an 'id' field that corresponds to its document ID in Firestore
              await deleteDoc(doc(db, 'scores', score.id as string));
            }
      }
  };

  archivePreviousDayScores();
  }, [selectedDate]);

  return { scores, selectedDate, setSelectedDate };
};
