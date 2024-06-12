import { UUID } from "crypto";

export type Player = {
    id: UUID | null;
    name: string;
};
