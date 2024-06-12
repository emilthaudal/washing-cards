import app from "../../src/server";
import { Game } from "../../src/domain/game/model";
import { CreateGameRequest } from "../../src/features/create-game/schema";
import request from "supertest";

export async function createGame(limit: number | null): Promise<Game> {
    const req: CreateGameRequest = {
        limit: limit,
        players: [
            {
                id: null,
                name: "Player 1",
            },
            {
                id: null,
                name: "Player 2",
            },
            {
                id: null,
                name: "Player 3",
            },
        ],
    };
    const response = await request(app).post("/api/game").send(req);

    if (response.status != 200) {
        throw new Error("Failed to create game with error " + response.text);
    }
    // assert
    expect(response.status).toEqual(200);
    const body = JSON.parse(JSON.stringify(response.body)) as Game;
    return body;
}
