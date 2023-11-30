# TradleScoreboard

**Introduction**
Tradle is an engaging game designed to educate players about countries and their exports. This document outlines the game's objectives, rules, scoring system, and technical architecture.

**Game and Rules Description**
_Game Objective_
The aim of Tradle is to guess the correct country based on clues related to its export data. Players receive information like the total export value in millions of USD, the percentage breakdown of exports, and more.

**Game Rules**
Players get one country to guess per day.
Each player has 6 attempts to guess the correct country.
Incorrect guesses lead to additional clues like distance and direction to the actual answer.
[As per the agreement, players are not allowed to use any other support tools, except for Google Maps, to look up country names.](url)

_Scoring System_
1 attempt = 7 points
2 attempts = 6 points
3 attempts = 5 points
4 attempts = 4 points
5 attempts = 3 points
6 attempts = 2 points
7 attempts (failed)  = 0 points 


**Scoreboard Mechanics**
_Sections_
Daily Scoreboard: Tracks scores for the current day.
Weekly Scoreboard: Aggregates scores from Monday to Friday.
Monthly Scoreboard: Aggregates scores from Monday to Friday for the entire month.
Note: Scores added on weekends are not counted towards the weekly and monthly leaderboards.

**Tech Stack**
Frontend: React + TypeScript + Chakra UI
Backend: Functions in TypeScript (client-side calculations)
Database: Firestore DB
System Architecture
Abstract Description
User: The starting point where a player interacts with the system.
Frontend: Handles user requests and renders the UI.
Firestore DB: Stores all the scores and player data.
Scoreboard Logic: Client-side calculations for the scoring system.
Scoreboards: Daily, weekly, and monthly scoreboards for user view.
Detailed Architecture
User
The entry point where the player interacts with the system.

_Frontend_
Built with React, TypeScript, and Chakra UI. Responsible for handling user requests and rendering the UI.

_Components_
App.tsx: The root component.
Navbar.tsx: The navigation bar.
ScoreForm.tsx: The form for entering scores.
Scoreboard.tsx: The general scoreboard component.
MonthlyScoreboard.tsx: The monthly scoreboard.
WeeklyScoreboard.tsx: The weekly scoreboard.
Firestore DB
Stores all the scores and player data.

_Scoreboard Logic_
Handles client-side calculations for the scoring system.

_Utility Files_
scoreUtils.ts: Functions for score calculations.
dateUtils.ts: Functions for date manipulations.
useScores.ts: Custom React hook for fetching and manipulating scores.
