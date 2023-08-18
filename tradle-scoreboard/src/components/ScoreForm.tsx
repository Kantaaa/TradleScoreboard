import { useState } from 'react';
import { Score } from './../types';
import { Box, Button, FormControl, FormLabel, Input, HStack, useToast } from "@chakra-ui/react";


interface ScoreFormProps {
  onSubmitScore: (score: Score) => void;
}

const ScoreForm: React.FC<ScoreFormProps> = ({ onSubmitScore }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');

  const toast = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim() === '' || score.trim() === '') {
      toast({
        title: "Error.",
        description: "Both fields must be filled out.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  
    const attemptsMatch = score.match(/(\d+)\/6/);
    let attempts: number | null = attemptsMatch ? Number(attemptsMatch[1]) : null;
    
    if (attempts === null || isNaN(attempts) || attempts === 0) {
      toast({
        title: "Error.",
        description: "Invalid score format. Attempts must be a number greater than 0.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  
    const newScore: Score = {
      name,
      attempts: attempts as number,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      rank: 0  

    };
    

    onSubmitScore(newScore);
  
    setName('');
    setScore('');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth="700px" margin="0 auto" bg="whiteAlpha.600" p={5}           
    borderRadius="md" boxShadow="md">
      <HStack spacing={8} direction={"row"}>
        <FormControl>
          <FormLabel htmlFor="player-name">Player Name</FormLabel>
          <Input 
            id="player-name"
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Player Name" 
            />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="score">Score</FormLabel>
          <Input 
            id="score"
            type="text" 
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
            placeholder="Score (e.g., 5/6)" 
            />
        </FormControl>
            

        <Button type="submit" colorScheme="whatsapp"  marginTop="8" size={"md"} >Submit</Button>
      </HStack>
    </Box>
  );
};

export default ScoreForm;
