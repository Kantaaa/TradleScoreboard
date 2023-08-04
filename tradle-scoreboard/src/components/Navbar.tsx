import * as React from 'react';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const styles = {
    nav: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#222',
    },
    h1: {
      color: '#fff',
      margin: '0 10px 0 0',
    },
    a: {
      color: '#61dafb',
      textDecoration: 'none',
      padding: '10px',
      backgroundColor: '#333',
      borderRadius: '5px',
      marginLeft: '10px',
    },
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.h1}>Tradle Scoreboard</h1>
      <a href="/" style={styles.a}>Today's Score</a>
      <a href="/previous-scores" style={styles.a}>Previous Scores</a>
    </nav>
  );
};

export default Navbar;
