import { randomUUID } from "crypto";
import { Game, Participant } from "../../domain/game/model";
import { Player } from "../../domain/player/model";
import { getGameRepository } from "../common/game-repository";
import { getCardRepository } from "./card-repository";
import { Card } from "../../domain/card/model";

export const createGame = async (players: Player[], limit: number | null): Promise<Game> => {
    try {
        const cardRepo = await getCardRepository();
        const cards = cardRepo.GetCards();

        if (cards.length < players.length) {
            throw new Error(
                `Not enough cards for the number of players. Cards: ${cards.length}, Players: ${players.length}`
            );
        }

        const participants = createParticipants(cards, players);

        const game: Game = new Game(randomUUID(), participants, [], limit);

        const repo = getGameRepository();

        repo.SaveGame(game);

        return game;
    } catch (error) {
        throw new Error(`Failed to create game: ${error}`);
    }
};

function createParticipants(cards: Card[], players: Player[]): Participant[] {
    const shuffled = cards.sort(() => Math.random() - 0.5);

    const participants = players.map((p) => {
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

    const hasTurn = Math.floor(Math.random() * participants.length);
    participants[hasTurn].hasTurn = true;

    return participants;
}
