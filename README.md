🐉 The Chronicles of Westeros
Explore the Seven Kingdoms. Discover their legends. Shape your destiny.

The Chronicles of Westeros is a responsive, interactive, fan-made web experience inspired by the fictional world of Westeros. Built with React and Vite, the project brings the realm to life through immersive visuals, detailed world exploration, legendary houses, historical events, iconic battles, mythical creatures, and an interactive Games Hall.

Discover the history, politics, characters, and mysteries of the Seven Kingdoms — all in one place.

✨ Features
🏰 Explore the World of Westeros
Atmospheric Hero Section – Immersive video background and cinematic introduction.
Realm Introduction – Discover the world, its history, and its lore.
Interactive Region Guide – Explore the different regions of Westeros.
Great Houses – Learn about the noble houses, their identities, and their legacies.
Character Cards – Explore character information through interactive panels.
Historical Timeline – Navigate important events throughout Westeros history.
Mythical Creatures – Discover dragons and other legendary creatures.
Iconic Battles – Revisit some of the most memorable battles.
The Iron Throne – An illustrated feature celebrating the ultimate symbol of power.
🎮 The Games Hall

Put your knowledge and strategy to the test with multiple interactive games:

Game Mode	Description
Kingdom Strategy	Make strategic decisions and experience kingdom management.
Dragon Flight	Fly a dragon through an interactive canvas-based game.
Character Clues	Identify characters through clues.
House Personality Quiz	Discover which great house matches your personality.
Turn-Based Battles	Experience strategic turn-based combat.
Lore Quiz	Test your knowledge of Westeros history and lore.
Sigil Memory	Challenge your memory with house sigils.
👤 User Accounts & Backend

An optional Express API provides:

User registration and authentication.
Account sessions using JWT.
Favorites management.
Quiz history.
Score tracking.
Leaderboards.
📱 Responsive Experience
Responsive layouts for desktop, tablet, and mobile.
Interactive UI components.
Immersive visual elements.
Smooth navigation and engaging animations.
🛠️ Technology Stack

Frontend

React
Vite
JavaScript
HTML5
CSS3
Canvas API

Backend

Node.js
Express.js
MongoDB
JWT Authentication

Development & Testing

npm
ESLint
Vitest
API Tests
📂 Project Structure
text
GOT/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── app.js
│   │   └── server.js
│   ├── test/
│   ├── .env.example
│   └── package.json
│
├── public/
│   ├── images/
│   ├── video/
│   ├── icons.svg
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md

🚀 Getting Started

Follow these instructions to run the project locally.

Prerequisites

Make sure you have installed:

Node.js (LTS recommended)
npm
Git
1. Clone the Repository
bash
git clone https://github.com/sayansarkar3504-cmd/GOT.git

2. Navigate to the Project
bash
cd GOT

3. Install Dependencies
bash
npm install

4. Start the Development Server
bash
npm run dev


Open your browser and visit:

text
http://localhost:5173

🧪 Games, Tests & Production Build

Run the following commands from the project root:

Run Tests

bash
npm test


Check Code Quality

bash
npm run lint


Create Production Build

bash
npm run build

⚙️ Optional Backend Setup

The project includes an optional Express API for user accounts, favorites, quiz history, scores, and leaderboards.

1. Navigate to Backend
bash
cd backend

2. Install Backend Dependencies
bash
npm install

3. Configure Environment Variables

Create your environment file:

bash
copy .env.example .env


Configure backend/.env with your own values:

env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_of_at_least_32_characters
FRONTEND_ORIGIN=http://localhost:5173


Important:

Use a MongoDB database that you control.
Generate a strong, random JWT secret of at least 32 characters.
Never commit your actual .env file or expose credentials publicly.
4. Start the Backend Server

From the backend directory:

bash
npm run dev


The API runs at:

text
http://localhost:4000


Check API health:

text
http://localhost:4000/api/health


The health endpoint returns HTTP 503 until MongoDB is connected.

5. Start the Frontend

Open another terminal, navigate to the project root, and run:

bash
npm run dev


The Vite development server proxies /api requests to:

text
http://127.0.0.1:4000


For a different deployment setup, configure VITE_API_BASE_URL and FRONTEND_ORIGIN appropriately.

6. Run API Tests

From the backend directory:

bash
npm run test:api

⚠️ Current Limitations
Scores submitted by signed-in clients are user-reported and are not independently verified against cheating.
Socket.IO multiplayer and live updates are not included.
Cloud database provisioning is not included.
Character panels currently use the available house-emblem artwork because dedicated character portrait files are not present in the project assets.
🔮 Future Improvements

Potential enhancements for future versions include:

Real-time multiplayer gameplay.
Verified scoring and anti-cheat mechanisms.
Expanded character artwork and profiles.
More interactive regions and historical events.
Additional strategy and quiz challenges.
Enhanced leaderboard functionality.
Cloud deployment and database integration.
⚖️ Disclaimer

The Chronicles of Westeros is an unofficial, fan-made project created for educational and entertainment purposes.

It is inspired by the fictional universe of A Song of Ice and Fire and Game of Thrones. All related trademarks, characters, names, artwork, and intellectual property belong to their respective owners.

This project is not affiliated with, endorsed by, or officially connected to HBO, Warner Bros., or George R. R. Martin.

👨‍💻 Author

Sayan Sarkar

GitHub: @sayansarkar3504-cmd

Project Repository: The Chronicles of Westeros

🐺 Winter Is Coming.

Explore the realm. Learn its history. Play your part in the legend.
