import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

interface Score {
  name: string;
  attempts: number;
  rank: number;
}

interface ScoreboardProps {
  scores: Score[];
}



const PAGE_SIZE = 10;

const Table = styled.table`
  width: 80%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0 auto;
  color: #ddd;
  background-color: #333;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.2);

  th, td {
    padding: 10px;
    border-bottom: 1px solid #888;
    text-align: center;
  }
`;

const Button = styled.button`
  background-color: #ddd;
  color: #333;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #bbb;
  }
`;

const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedScores = scores.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const Title = styled.h2`
    text-align: center;
    margin-bottom: 30px;
  `;

  return (
    <div>
      <Title>Today's Score 🏆</Title>
      <Table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          {paginatedScores.map((score, index) => (
            <tr key={index}>
              <td>{score.rank}</td>
              <td>{score.name}</td>
              <td>{score.attempts}/6</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ textAlign: 'center' }}>
        {currentPage > 1 && <Button onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>}
        {currentPage < Math.ceil(scores.length / PAGE_SIZE) && <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>}
      </div>
    </div>
  );
};

export default Scoreboard;
