import app from "../../src/app";
import { Game } from "../../src/domain/game/model";
import { CreateGameRequest } from "../../src/features/create-game/request";
import request from "supertest";

export async function createGame(limit: number | null): Promise<Game> {
    var req: CreateGameRequest = {
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

    // assert
    expect(response.status).toEqual(200);
    var body = JSON.parse(JSON.stringify(response.body)) as Game;
    return body;
}
