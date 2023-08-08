import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;  // You can choose your preferred font here
    background-color: #78C1F3;  // Dominant color
  }
`;

export const AppContainer = styled.div`
  background-color: #78C1F3;  // Dominant color
  min-height: 100vh;
  padding: 20px;
  color: #1f1f1f;  // Dark color for contrast
  box-shadow: 0 4px 10px rgba(0,0,0,0.1); // Gives a lifted appearance
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
  margin-bottom: 20px;
  background-color: #78C1F3;  
  border-radius: 8px;
  padding: 20px;
  
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #E2F6CA;  // Accent color for focus
  background-color: #F8FDCF;  // Additional color for inputs
  outline: none;
  transition: all 0.3s ease-in-out;
  width: 200px;
  border-radius: 5px;
  &:focus {
    border-bottom: 2px solid #E2F6CA;  // Accent color for focus
    box-shadow: 0 1px 6px 0 rgba(0,0,0,0.1);
  }
`;

export const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #E2F6CA;  // Accent color for buttons
  color: #1f1f1f;  // Dark color for text contrast
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);  // Slight shadow for depth
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: #9BE8D8;  // Secondary color for hover effect
  }
`;
