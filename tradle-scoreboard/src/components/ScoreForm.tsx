import { useState } from 'react';
import { Score } from './../types';
import { Box, Button, FormControl, FormLabel, Input, HStack, useToast, Select  } from "@chakra-ui/react";


interface ScoreFormProps {
  onSubmitScore: (score: Score) => void;
}

const ScoreForm: React.FC<ScoreFormProps> = ({ onSubmitScore }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [previousNames, setPreviousNames] = useState<string[]>([]);


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
  


    let attempts: number | null = Number(score);

    if (isNaN(attempts) || attempts === 0) {
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
      attempts: attempts,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      rank: 0
    };
    
    if (!previousNames.includes(name)) {
      setPreviousNames([...previousNames, name]);
    }

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
            list="previous-names" // Add this line
          />
          <datalist id="previous-names"> {/* Add this block */}
            {previousNames.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="score">Score</FormLabel>
          <Select 
            id="score"
            value={score} 
            onChange={(e) => setScore(e.target.value)} 
          >
            <option value="" disabled>Select your score</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">No Luck Today :/ (7)</option>
          </Select>
        </FormControl>  
          <Button type="submit" colorScheme="whatsapp"  marginTop="8" size={"lg"} >Submit</Button>
      </HStack>
    </Box>
  );
};

export default ScoreForm;
