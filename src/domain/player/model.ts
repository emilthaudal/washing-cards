import { UUID } from "crypto";
import { Game } from "../game/model";

export type Player = {
    id: UUID | null;
    name: string;
};
