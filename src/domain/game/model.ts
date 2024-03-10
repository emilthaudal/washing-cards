import { UUID } from "crypto";
import { Card, Feature } from "../card/model";

export class Game {
    constructor(id: UUID, participants: Participant[], rounds: Round[], limit: number | null) {
        this.id = id;
        this.participants = participants;
        this.rounds = rounds;
        this.roundLimit = limit;
        this.finished = false;
        this.winner = null;
    }

    setFinished() {
        this.finished = true;
        this.winner = this.participants.sort((a, b) => b.cards.length - a.cards.length)[0];
    }

    id: UUID;
    participants: Participant[];
    rounds: Round[];
    roundLimit: number | null;
    finished: boolean;
    winner: Participant | null;
}

export type Participant = {
    name: string;
    playerID: UUID | null;
    cards: Card[];
    bot: boolean;
    hasTurn: boolean;
    eliminated: boolean;
};

export type Round = {
    feature: Feature;
    completed: boolean;
    roundWinner: string | null;
    matchups: Matchups[];
};

export type Matchups = {
    entries: RoundEntry[];
};

export type RoundEntry = {
    participant: string;
    card: Card;
};
