# The Chronicles of Westeros

A responsive, fan-made guide to the fictional world of Westeros. The React and Vite experience includes an atmospheric video hero, an introduction to the realm, an interactive region guide, great-house details, character cards, a selectable history timeline, creature lore, iconic battles, and an illustrated Iron Throne feature.

The Games Hall now includes kingdom strategy, a canvas dragon flight game, character clues, a house personality quiz, turn-based battles, a lore quiz, and sigil memory. An optional Express API provides account sessions, favorites, quiz history, scores, and leaderboards.

## Run locally

```sh
npm install
npm run dev
```

## Games and tests

```sh
npm test
npm run lint
npm run build
```

The API source and its tests are in `backend/`:

```sh
cd backend
npm install
copy .env.example .env
```

Set `MONGODB_URI` to a MongoDB database you control and set `JWT_SECRET` to a random secret of at least 32 characters in `backend/.env`. The example file contains placeholders only. Then run the API in one terminal and the frontend in another:

```sh
cd backend
npm run dev
```

```sh
npm run dev
```

The Vite development server proxies `/api` to `http://127.0.0.1:4000`. For another deployment topology, set `VITE_API_BASE_URL` and `FRONTEND_ORIGIN` to the appropriate origins. Check the API with `http://localhost:4000/api/health`; it returns 503 until MongoDB is connected.

API checks:

```sh
npm run test:api
```

Scores submitted by a signed-in client are user-reported and are not anti-cheat verified. Socket.IO multiplayer/live updates, verified scoring, and cloud database provisioning are not included.

## Checks

```sh
npm run lint
npm run build
```

The character panels use the house-emblem artwork currently included in `public/images`; no character portrait files are present in the project assets.
