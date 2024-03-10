import express from "express";
import { newRound } from "./features/new-round/api";
import { newGame } from "./features/create-game/api";

const app = express();
const port = 3000;

app.set("port", port);
app.use(express.json());

// Routes
app.post("/api/game", newGame);
app.post("/api/game/round", newRound);

export default app;
