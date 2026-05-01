# Role: Expert Solutions Architect & Technology Researcher

## Objective
Your mission is to research and recommend an optimal, 100% FREE technology stack (Generous Free Tiers) for building a "Lexical Decision Task" web application. You must analyze the project requirements below and provide a detailed report suggesting the best Frontend, Backend, Database, and Hosting solutions.

## Project Context & Requirements
The application is a cognitive test platform with the following flow and features:

1.  **Authentication & Entry:**
    *   Users access the site via a shared link.
    *   They must enter their First Name and Last Name before starting the test.

2.  **Core Gameplay Loop (The Test):**
    *   A single word (or non-word) is displayed in the center of the screen.
    *   Two buttons are available: `1: Yes` (for Word) and `0: No` (for Non-Word).
    *   **Crucial Metric:** The system must record the exact response time (in milliseconds) for each individual word, as well as the total test completion time.

3.  **End of Test & User Reporting:**
    *   Display the final score (Total Correct, Total Incorrect).
    *   Display a detailed list of the words the user got wrong, showing their answer vs. the correct answer (Word / Non-word).
    *   Provide a downloadable report for the user containing: Name, Surname, list of all words, answers given, response time per word, correctness (true/false), average response time, and total completion time.

4.  **Data Storage:**
    *   Every completed test's detailed report must be saved to a database.

5.  **Admin Dashboard (Secure Page):**
    *   A restricted page for authorized personnel only.
    *   Must feature a visually appealing, Excel-like data table displaying all users who took the test and their individual metrics simultaneously.
    *   **Analytics Section (Bottom of Dashboard):** Must calculate and display global average statistics across all users (e.g., Average response time for Word 1, Average response time for Word 2, Global average test completion time).

## Constraints
*   **Budget:** 0$. You must only select tools, platforms, and databases that offer a robust, perpetual "Free Tier" sufficient for a medium-traffic educational tool.
*   **Performance:** The stack must support precise frontend timing (React, Vue, or vanilla JS) and reliable data posting without severe cold-start delays.
*   **Modern Stack:** Prefer modern ecosystems (e.g., React, NestJS, Node.js, Serverless, NoSQL/SQL free tiers like Firebase, Supabase, Vercel, Render) that facilitate rapid development.

## Required Output Format
Please generate a structured Markdown report containing:
1.  **Recommended Stack Summary:** A quick overview of the chosen Frontend, Backend, Database, Auth, and Hosting.
2.  **Detailed Component Analysis:** Why each technology was chosen and how it specifically fulfills the project requirements within the free tier.
3.  **Data Flow Architecture:** A brief explanation of how data will move from the user's click to the Admin's analytics dashboard.
4.  **Potential Limitations:** Any rate limits or constraints of the chosen free tiers we should be aware of.