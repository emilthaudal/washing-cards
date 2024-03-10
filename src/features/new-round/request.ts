import { UUID } from "crypto";
import { Feature } from "../../domain/card/model";

export type NewRoundRequest = {
    gameId: UUID;
    feature: Feature;
};
