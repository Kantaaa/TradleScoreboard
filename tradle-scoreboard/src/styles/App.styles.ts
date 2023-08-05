import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    background-color: #1f1f1f;
  }
`;

export const AppContainer = styled.div`
  background-color: black;
  min-height: 100vh;
  padding: 20px;
  color: #ddd;
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #ddd;
  outline: none;
  transition: all 0.3s ease-in-out;
  width: 200px;
  &:focus {
    border-bottom: 2px solid #f0c14b;
    box-shadow: 0 1px 6px 0 rgba(0,0,0,0.1);
  }
`;

export const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #008CBA;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #007B9A;
  }
`;
