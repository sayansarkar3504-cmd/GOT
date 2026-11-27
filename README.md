# 🐉 The Chronicles of Westeros

### Explore the Seven Kingdoms. Discover Their Legends. Shape Your Destiny.

<p align="center">
  <strong>A Cinematic • Interactive • Game-Inspired Fantasy Experience</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  <a href="https://github.com/sayansarkar3504-cmd/GOT">Repository</a> •
  <a href="#-features">Features</a> •
  <a href="#-games-hall">Games Hall</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🌌 About The Project

**The Chronicles of Westeros** is a responsive, interactive, fan-made web experience inspired by the fictional universe of *A Song of Ice and Fire* and *Game of Thrones*.

Built using React and Vite, this project brings the legendary world of Westeros to life through cinematic visuals, immersive storytelling, interactive exploration, historical events, noble houses, mythical creatures, iconic battles, and a collection of playable mini-games.

From the frozen lands beyond the Wall to the political heart of King's Landing, explore the stories, mysteries, rivalries, and legends that shaped the Seven Kingdoms.

This is more than a traditional fan website. It combines world exploration, interactive storytelling, browser-based games, and an optional backend into one connected experience.

> 🐺 Winter Is Coming. Your story begins in Westeros.

---

## ✨ Features

### 🏰 Explore the World of Westeros

Discover the history, geography, politics, and legends of the Seven Kingdoms.

| Feature | Description |
|---|---|
| 🎬 Cinematic Hero | Atmospheric video background and immersive introduction. |
| 🌍 Realm Introduction | Discover the world, its history, and its lore. |
| 🗺️ Region Guide | Explore the different regions of Westeros. |
| 🛡️ Great Houses | Discover noble houses, their identities, and legacies. |
| 👑 Character Explorer | Interactive character cards and information panels. |
| 📜 Historical Timeline | Navigate important events throughout Westeros history. |
| 🐉 Mythical Creatures | Discover dragons and other legendary creatures. |
| ⚔️ Iconic Battles | Revisit memorable battles from the history of Westeros. |
| 🪑 The Iron Throne | An illustrated feature celebrating the ultimate symbol of power. |

### 🎮 The Games Hall

Enter the Games Hall and test your knowledge, memory, and strategic thinking.

| Game Mode | Description |
|---|---|
| 👑 Kingdom Strategy | Make strategic decisions and experience kingdom management. |
| 🐉 Dragon Flight | Fly a dragon through an interactive canvas-based game. |
| 🔍 Character Clues | Identify legendary characters through clues. |
| 🛡️ House Personality Quiz | Discover which Great House matches your personality. |
| ⚔️ Turn-Based Battles | Experience strategic turn-based combat. |
| 📚 Lore Quiz | Test your knowledge of Westeros history and lore. |
| 🧠 Sigil Memory | Challenge your memory using Great House sigils. |

Each game offers a different way to interact with the world of Westeros.

### 👤 User Accounts & Backend

An optional Express.js API provides backend functionality for user accounts and game-related data.

**Available backend capabilities:**

- User registration and authentication.
- JWT-based account authentication.
- Favorites management.
- Quiz history.
- Score tracking.
- Leaderboards.

The backend uses MongoDB for persistent data storage.

### 📱 Responsive & Interactive Experience

- Responsive desktop, tablet, and mobile layouts.
- Interactive UI components.
- Immersive visual elements.
- Video-based hero experience.
- Smooth navigation and engaging animations.
- Canvas-powered gameplay.
- Organized and reusable React components.

---

## 🛠️ Technology Stack

The project uses modern frontend and backend technologies.

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Fast development and build tooling |
| JavaScript | Application logic and interactions |
| HTML5 | Semantic page structure |
| CSS3 | Responsive styling and visual design |
| Canvas API | Interactive browser-based gameplay |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Database |
| JWT | Authentication |
| Mongoose | MongoDB object modeling |

### Development & Testing

- npm
- ESLint
- Vitest
- API Tests
- Git & GitHub

---

## 🏗️ Project Architecture

The project follows a structured frontend and backend architecture.

```text
GOT/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── app.js
│   │   └── server.js
│   │
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
```

---

## 🚀 Installation

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js (LTS)](https://nodejs.org/)
- npm
- Git
- [MongoDB](https://www.mongodb.com/) (only if you want to run the backend)

### 1. Clone the Repository

```bash
git clone https://github.com/sayansarkar3504-cmd/GOT.git
```

### 2. Navigate to the Project

```bash
cd GOT
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open your browser:

```text
http://localhost:5173
```

Your local Westeros experience is now running!

---

## 🧪 Testing & Production Build

Run these commands from the project root.

### Run Tests

```bash
npm test
```

### Check Code Quality

```bash
npm run lint
```

### Create Production Build

```bash
npm run build
```

The production-ready frontend output is generated in the `dist/` directory.

---

## ⚙️ Optional Backend Setup

The project includes an optional Express API for user accounts, favorites, quiz history, scores, and leaderboards.

### 1. Navigate to the Backend

Open a new terminal:

```bash
cd backend
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file from the example configuration.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

Configure `backend/.env`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_of_at_least_32_characters
FRONTEND_ORIGIN=http://localhost:5173
```

**Security Notes:**

- Use a MongoDB database that you control.
- Generate a strong, random JWT secret of at least 32 characters.
- Never commit your actual `.env` file.
- Never expose database credentials or authentication secrets publicly.

### 4. Start the Backend Server

From the `backend/` directory:

```bash
npm run dev
```

The backend API runs at:

```text
http://localhost:4000
```

Check the API health endpoint:

```text
http://localhost:4000/api/health
```

The health endpoint returns HTTP 503 until MongoDB is connected.

### 5. Start the Frontend

Open another terminal at the project root:

```bash
npm run dev
```

The Vite development server proxies `/api` requests to:

```text
http://127.0.0.1:4000
```

For other deployment configurations, configure `VITE_API_BASE_URL` and `FRONTEND_ORIGIN` appropriately.

### 6. Run API Tests

From the backend directory:

```bash
npm run test:api
```

---

## 🔐 Security & Implementation Notes

- Authentication uses JWT-based account sessions.
- Keep environment variables private.
- Use a MongoDB database that you control.
- Configure frontend origins appropriately.
- Game scores submitted by signed-in clients are currently user-reported and are not independently verified against cheating.
- Never assume client-submitted scores or rewards are independently verified.

---

## 🔮 Roadmap & Future Improvements

The Chronicles of Westeros is designed to grow into a richer interactive fantasy experience.

Here are some planned improvements:

### 🎮 Advanced Gameplay
- Additional strategy and survival game modes.
- Expanded kingdom management.
- Dragon collection and training.
- More interactive battle mechanics.
- Daily and weekly quests.
- Achievement and reward systems.

### 🌍 World Exploration
- More interactive regions.
- Expanded historical events.
- Detailed character profiles.
- Character relationship explorer.
- Enhanced Great House information.
- Additional mythical creatures.

### 👥 Community & Multiplayer
- Real-time multiplayer gameplay.
- Player profiles and social features.
- Multiplayer rooms.
- Guild and alliance systems.
- Competitive tournaments.
- Live leaderboard updates.

### ⚙️ Backend & Infrastructure
- Verified scoring and anti-cheat mechanisms.
- Expanded account functionality.
- Enhanced leaderboard security.
- Cloud deployment.
- Database integration improvements.
- Performance optimization.

*These are future development ideas, not claims about currently implemented functionality.*

---

## 🧪 Current Limitations

Transparency matters. The following limitations are currently known:

- Socket.IO multiplayer and live updates are not included.
- Scores submitted by signed-in clients are user-reported and are not independently verified against cheating.
- Cloud database provisioning is not included.
- Character panels currently use the available house-emblem artwork because dedicated character portrait files are not present in the project assets.
- Some planned advanced gameplay and social features remain future improvements.

---

## 🖼️ Project Preview

Add screenshots or GIFs of your actual running website here to showcase its design and functionality.

Recommended screenshots:

| Preview | Suggested Content |
|---|---|
| Home | Cinematic hero section |
| Explore | Interactive Westeros regions |
| Great Houses | House cards and emblems |
| Characters | Character information panels |
| Timeline | Historical events |
| Games Hall | All available mini-games |
| Gameplay | Dragon Flight or strategy gameplay |
| Mobile | Responsive mobile experience |

Example Markdown:

```markdown
![Westeros Home Page](public/images/preview-home.png)
```

Replace the example path with an actual screenshot file added to your repository.

---

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome.

If you want to contribute:

1. Fork this repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a Pull Request.

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

---

## ⚖️ Disclaimer

The Chronicles of Westeros is an unofficial, fan-made project created for educational and entertainment purposes.

It is inspired by the fictional universe of *A Song of Ice and Fire* and *Game of Thrones*.

All related trademarks, characters, names, artwork, and intellectual property belong to their respective owners.

This project is not affiliated with, endorsed by, or officially connected to HBO, Warner Bros., or George R. R. Martin.

---

## 👨‍💻 Author

<p align="center">
  <strong>Sayan Sarkar</strong>
  <br/>
  Computer Science Engineering Student | Frontend & Full-Stack Developer
</p>

<p align="center">
  <a href="https://github.com/sayansarkar3504-cmd">
    <img src="https://img.shields.io/badge/GitHub-sayansarkar3504--cmd-181717?style=for-the-badge&logo=github" alt="GitHub Profile" />
  </a>
</p>

**Project Repository:** [The Chronicles of Westeros](https://github.com/sayansarkar3504-cmd/GOT)

---

<p align="center">
  <strong>🐺 Winter Is Coming.</strong>
  <br/>
  Explore the realm. Learn its history. Play your part in the legend.
</p>

<p align="center">
  <sub>Built with passion, creativity, and code by Sayan Sarkar.</sub>
</p>
