import { Player } from "../../domain/player/model";

export type CreateGameRequest = {
    players: Player[];
    limit: number | null;
};
