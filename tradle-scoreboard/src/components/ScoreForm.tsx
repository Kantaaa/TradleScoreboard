import { useState } from 'react';
import { Score } from './../types';
import { Button, Input, Form } from './../styles/App.styles';


interface ScoreFormProps {
  onSubmitScore: (score: Score) => void;  // Update this
}

const ScoreForm: React.FC<ScoreFormProps> = ({ onSubmitScore }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Check for empty fields
    if (name.trim() === '' || score.trim() === '') {
      alert('Both fields must be filled out.');
      return;
    }
  
    // Parse the score to get the number of attempts.
    const attemptsMatch = score.match(/(\d+)\/6/);
    let attempts: number | null = attemptsMatch ? Number(attemptsMatch[1]) : null;
    
    if (attempts === null || isNaN(attempts) || attempts === 0) {
      alert('Invalid score format. Attempts must be a number greater than 0.');
      return;
    }
  
    // Create the new score.
    const newScore: Score = {
      name,
      attempts: attempts as number, // assert that attempts is not null here
      rank: 0, // rank will be calculated after sorting
      date: new Date().toISOString().split('T')[0],
    };

    onSubmitScore(newScore); 
  
    // Reset the input fields.
    setName('');
    setScore('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name" />
      <Input type="text" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default ScoreForm;
