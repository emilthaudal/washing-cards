import { Request, Response } from "express";
import { CreateGameRequest } from "./request";
import { Game, Participant } from "../../domain/game/model";
import { randomUUID } from "crypto";
import { Card } from "../../domain/card/model";
import { Player } from "../../domain/player/model";
import { getGameRepository } from "../../domain/game/repository";
import { getCardRepository } from "../../domain/card/repository";

export const newGame = async (req: Request, res: Response) => {
    var gameRequest: CreateGameRequest;
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

    try {
        const cardRepo = await getCardRepository();
        const cards = cardRepo.GetCards();

        if (cards.length < gameRequest.players.length) {
            res.status(400).send(
                `Not enough cards for the number of players. Cards: ${cards.length}, Players: ${gameRequest.players.length}`
            );
            return;
        }

        const participants = createParticipants(cards, gameRequest.players);

        const game: Game = new Game(randomUUID(), participants, [], gameRequest.limit);

        var repo = getGameRepository();

        repo.SaveGame(game);

        res.send(game);
    } catch (error) {
        res.status(500).send(`Error creating game: ${error}`);
    }
};

function createParticipants(cards: Card[], players: Player[]): Participant[] {
    const shuffled = cards.sort(() => Math.random() - 0.5);

    let participants = players.map((p) => {
        const participant: Participant = {
            name: p.name,
            playerID: p.id,
            cards: [],
            bot: false,
            hasTurn: false,
            eliminated: false,
        };
        return participant;
    });

    const missingParticipants = 3 - participants.length;

    // Populate with bots
    if (missingParticipants > 0) {
        for (let i = 0; i < missingParticipants; i++) {
            participants.push({
                name: `Bot ${i + 1}`,
                playerID: null,
                cards: [],
                bot: true,
                hasTurn: false,
                eliminated: false,
            });
        }
    }

    if (shuffled.length < players.length) {
        throw new Error("Not enough cards for the number of players");
    }

    while (shuffled.length > 1) {
        participants.forEach((p) => {
            p.cards.push(shuffled.pop());
        });
    }

    var hasTurn = Math.floor(Math.random() * participants.length);
    participants[hasTurn].hasTurn = true;

    return participants;
}
