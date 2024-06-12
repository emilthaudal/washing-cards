import { Request, Response } from "express";
import { NewRoundRequest } from "./schema";
import { Game, Matchups, Round, RoundEntry } from "../../domain/game/model";
import { Card, getWinnersByFeature, randomFeature } from "../../domain/card/model";
import { getGameRepository } from "../../domain/game/repository";

export const newRound = (req: Request, res: Response) => {
    let request: NewRoundRequest;
    try {
        request = JSON.parse(JSON.stringify(req.body)) as NewRoundRequest;
    } catch (error) {
        res.status(400).send(`Invalid request: ${error}`);
        return;
    }

    if (request.gameId === undefined) {
        res.status(400).send("Game ID is required");
        return;
    }

    if (request.feature === undefined) {
        res.status(400).send("Feature is required");
        return;
    }

    const gameRepo = getGameRepository();
    let game = gameRepo.GetGame(request.gameId);
    if (game === undefined) {
        res.status(404).send("Game not found");
        return;
    }

    if (game.participants.length < 3) {
        res.status(400).send("At least two participants are required");
        return;
    }

    if (game.finished) {
        res.send(game);
        return;
    }

    // Initialize Round
    const roundCards: RoundEntry[] = [];
    for (const participant of game.participants) {
        if (participant.cards.length == 0) {
            participant.eliminated = true;
            continue;
        }
        roundCards.push({
            card: participant.cards.pop(),
            participant: participant.name,
        });
    }

    if (roundCards.length <= 1) {
        game.setFinished();
        gameRepo.SaveGame(game);
        res.send(game);
        return;
    }

    const matchup: Matchups = { entries: roundCards };

    const botTurn = game.participants.find((p) => p.hasTurn && p.bot);
    if (botTurn) {
        // set random feature
        request.feature = randomFeature();
    }

    const round: Round = {
        feature: request.feature,
        completed: false,
        roundWinner: null,
        matchups: [matchup],
    };

    game.rounds.push(round);

    game = getWinnerLastRound(game);

    if (game.roundLimit != null && game.rounds.length >= game.roundLimit) {
        game.setFinished();
        gameRepo.SaveGame(game);
        res.send(game);
        return;
    }

    // move turn to next player
    const currentTurn = game.participants.findIndex((p) => p.hasTurn);
    game.participants[currentTurn].hasTurn = false;
    game.participants[(currentTurn + 1) % game.participants.length].hasTurn = true;

    gameRepo.SaveGame(game);

    res.send(game);
};

function getWinnerLastRound(game: Game): Game {
    const round = game.rounds[game.rounds.length - 1];
    let winners = getWinnersByFeature(round.matchups[0].entries, round.feature);
    while (winners.length > 1) {
        winners = handleTiebreak(game, winners);
    }
    round.roundWinner = game.participants.find((p) => winners.find((winner) => winner.participant === p.name)).name;
    round.completed = true;

    const cardPool: Card[] = [];
    for (const matchup of round.matchups) {
        for (const entry of matchup.entries) {
            cardPool.push(entry.card);
        }
    }
    game.rounds[game.rounds.length - 1] = round;

    game.participants.find((p) => winners.find((winner) => winner.participant === p.name)).cards.push(...cardPool);

    return game;
}

function handleTiebreak(game: Game, winners: RoundEntry[]): RoundEntry[] {
    const tieBreakEntries: RoundEntry[] = [];
    for (const participant of game.participants) {
        if (winners.find((w) => w.participant === participant.name) === undefined) {
            continue;
        }
        if (participant.cards.length == 0) {
            participant.eliminated = true;
            continue;
        }
        const card = participant.cards.pop();
        tieBreakEntries.push({ card: card, participant: participant.name });
    }
    game.rounds[game.rounds.length - 1].matchups.push({ entries: tieBreakEntries });

    return getWinnersByFeature(tieBreakEntries, game.rounds[game.rounds.length - 1].feature);
}
