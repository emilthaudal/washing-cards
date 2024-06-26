import request from "supertest";
import app from "../../src/infrastructure/express";
import { CreateGameRequest } from "../../src/features/create-game/schema";
import { randomUUID } from "crypto";
import { Game } from "../../src/domain/game/model";
import { createGame } from "../helpers/game_helper";
import { NewRoundRequest } from "../../src/features/new-round/schema";
import { Feature, randomFeature } from "../../src/domain/card/model";

describe("api/game", () => {
    it("should create a new game", async () => {
        //arrange
        const req: CreateGameRequest = {
            limit: 10,
            players: [
                {
                    id: null,
                    name: "Player 1",
                },
                {
                    id: randomUUID(),
                    name: "Player 2",
                },
                {
                    id: randomUUID(),
                    name: "Player 3",
                },
            ],
        };

        //act
        const response = await request(app).post("/api/game").send(req);

        // assert
        expect(response.status).toEqual(200);
        const body = JSON.parse(response.text) as Game;
        expect(body.participants.length).toEqual(3);
        expect(body.roundLimit).toEqual(10);
        expect(body.finished).toBeFalsy();
        expect(body.rounds.length).toEqual(0);
    });

    it("should fail without players", async () => {
        //arrange
        const req: CreateGameRequest = {
            limit: 10,
            players: [],
        };

        //act
        const response = await request(app).post("/api/game").send(req);

        // assert
        expect(response.status).toEqual(400);
    });
});

describe("api/game/round", () => {
    it("should start and play a new round", async () => {
        //arrange

        const game = await createGame(10);
        const req: NewRoundRequest = {
            gameId: game.id,
            feature: Feature.Capacity,
        };

        //act
        const response = await request(app).post(`/api/game/round`).send(req);

        // assert
        expect(response.status).toEqual(200);
        const body = JSON.parse(response.text) as Game;
        expect(body.rounds.length).toEqual(1);
        expect(body.rounds[0].feature).toEqual(Feature.Capacity);
        expect(body.rounds[0].roundWinner).toBeDefined();
    });

    it("should start and play until the limit is reached", async () => {
        //arrange
        let game = await createGame(10);

        const rounds = game.roundLimit ?? 10;

        // act
        for (let i = 0; i < rounds ?? 10; i++) {
            const req: NewRoundRequest = {
                gameId: game.id,
                feature: randomFeature(),
            };
            const response = await request(app).post(`/api/game/round`).send(req);
            game = JSON.parse(JSON.stringify(response.body)) as Game;
            expect(response.status).toEqual(200);
        }

        // assert
        expect(game.finished).toBeTruthy();
        expect(game.winner).toBeDefined();
    });

    it("should start and play until only one player has cards left", async () => {
        //arrange
        let game = await createGame(null);

        // act
        while (!game.finished) {
            const req: NewRoundRequest = {
                gameId: game.id,
                feature: randomFeature(),
            };
            const response = await request(app).post(`/api/game/round`).send(req);
            game = JSON.parse(JSON.stringify(response.body)) as Game;
            expect(response.status).toEqual(200);
        }

        // assert
        expect(game.finished).toBeTruthy();
        expect(game.winner).toBeDefined();
    });
});
