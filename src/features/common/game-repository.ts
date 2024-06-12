import { Game } from "../../domain/game/model";

export interface GameRepository {
    GameCollection: Game[];
    GetGames(): Game[];
    GetGame(id: string): Game;
    SaveGame(game: Game): void;
}

let gameRepo: GameRepository;

export function getGameRepository(): GameRepository {
    if (gameRepo === undefined) {
        gameRepo = createMemoryGameRepository();
    }
    return gameRepo;
}

export class MemoryGameRespository implements GameRepository {
    GameCollection: Game[];

    constructor() {
        this.GameCollection = [];
    }
    GetGame(id: string): Game {
        return this.GameCollection.find((game) => game.id === id);
    }

    GetGames(): Game[] {
        return this.GameCollection;
    }

    SaveGame(game: Game): void {
        if (this.GetGame(game.id)) {
            const index = this.GameCollection.findIndex((g) => g.id === game.id);
            this.GameCollection[index] = game;
        }
        this.GameCollection.push(game);
    }
}

export function createMemoryGameRepository(): GameRepository {
    return new MemoryGameRespository();
}
