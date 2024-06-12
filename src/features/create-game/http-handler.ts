import { Request, Response } from "express";
import { CreateGameRequest } from "./schema";
import { createGame } from "./service";

export const newGame = async (req: Request, res: Response) => {
    let gameRequest: CreateGameRequest;
    try {
        gameRequest = JSON.parse(JSON.stringify(req.body)) as CreateGameRequest;
    } catch (error) {
        res.status(400).send(`Invalid request: ${error}`);
        return;
    }

    if (!gameRequest.players || gameRequest.players.length < 1) {
        res.status(400).send("At least one player is required");
        return;
    }

    if (gameRequest.limit < 0) {
        res.status(400).send("Limit must be a positive number");
        return;
    }

    return await createGame(gameRequest.players, gameRequest.limit);
};
