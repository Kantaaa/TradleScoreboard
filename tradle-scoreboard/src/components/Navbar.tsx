import React, { useState } from "react";
import styled from 'styled-components';
import DatePicker from "react-datepicker";


interface NavbarProps {
  onDateChange: (date: Date) => void;

}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1f1f1f;
  color: #fff;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5em;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const NavLink = styled.a`
  color: #61dafb;
  text-decoration: none;
  padding: 10px;
  background-color: #333;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const Navbar: React.FC<NavbarProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(new Date());  
  return (
    <Nav>
      <Title>Tradle Scoreboard</Title>
      <NavLinks>
        <NavLink href="/">Today's Score</NavLink>
        <NavLink href="/previous-scores">Previous Scores</NavLink>
      </NavLinks>
      
    </Nav>
  );
};

export default Navbar;
