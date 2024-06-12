import { Card } from "./model";
import * as fsPromise from "fs/promises";

export interface CardRepository {
    CardCollection: Card[];
    GetCards(): Card[];
}

export async function getCardRepository(): Promise<CardRepository> {
    let cardRepo = createMemoryRepository();
    cardRepo = await populateRepositoryFromFile(cardRepo, "Megawash Data.csv");
    return cardRepo;
}

export class MemoryCardRepo implements CardRepository {
    CardCollection: Card[];
    constructor() {
        this.CardCollection = [];
    }
    GetCards(): Card[] {
        return this.CardCollection;
    }
}

export function createMemoryRepository(): MemoryCardRepo {
    return new MemoryCardRepo();
}

export async function populateRepositoryFromFile(repository: CardRepository, path: string): Promise<CardRepository> {
    const file = await fsPromise.open(path, "r");
    if (!file) {
        throw new Error("File not found");
    }
    let lineNumber = 0;
    const cardCollection: Card[] = [];
    for await (const line of file.readLines()) {
        if (lineNumber === 0) {
            lineNumber++;
            continue;
        }
        const cardData = line.split(",");
        const card: Card = {
            name: cardData[0],
            brand: cardData[1],
            rpm: parseInt(cardData[2]),
            energyRating: cardData[3],
            fastestProgram: cardData[4],
            capacity: cardData[5],
        };
        cardCollection.push(card);
    }
    repository.CardCollection = cardCollection;
    return repository;
}
