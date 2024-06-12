import { RoundEntry } from "../game/model";

export type Card = {
    name: string;
    brand: string;
    rpm: number;
    energyRating: string;
    fastestProgram: string;
    capacity: string;
};

export enum Feature {
    Rpm = "rpm",
    EnergyRating = "energyRating",
    FastestProgram = "fastestProgram",
    Capacity = "capacity",
}

export function randomFeature(): Feature {
    const features = Object.values(Feature);
    return features[Math.floor(Math.random() * features.length)];
}

export function getWinnersByFeature(entries: RoundEntry[], feature: Feature): RoundEntry[] {
    switch (feature) {
        case Feature.Rpm:
            return findWinnersByRpm(entries);
        case Feature.EnergyRating:
            return findWinnersByEnergyRating(entries);
        case Feature.FastestProgram:
            return findWinnersByFastestProgram(entries);
        case Feature.Capacity:
            return findWinnersByCapacity(entries);
    }
}

export function sortEntriesByFeature(entries: RoundEntry[], feature: Feature): RoundEntry[] {
    switch (feature) {
        case Feature.Rpm:
            return entries.sort((a, b) => b.card.rpm - a.card.rpm);
        case Feature.EnergyRating:
            return entries.sort((a, b) => {
                const energyRatingOrder = ["A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"];
                const aIndex = energyRatingOrder.indexOf(a.card.energyRating);
                const bIndex = energyRatingOrder.indexOf(b.card.energyRating);
                return aIndex - bIndex;
            });
        case Feature.FastestProgram:
            return entries.sort((a, b) => {
                const aTime = parseInt(a.card.fastestProgram.split(" ")[0]);
                const bTime = parseInt(b.card.fastestProgram.split(" ")[0]);
                return aTime - bTime;
            });
        case Feature.Capacity:
            return entries.sort((a, b) => {
                const aCapacity = parseInt(a.card.capacity.split(" ")[0]);
                const bCapacity = parseInt(b.card.capacity.split(" ")[0]);
                return bCapacity - aCapacity;
            });
    }
}

function findWinnersByRpm(entries: RoundEntry[]): RoundEntry[] {
    const sortedCards = sortEntriesByFeature(entries, Feature.Rpm);
    const maxRpm = sortedCards[0].card.rpm;

    const winners: RoundEntry[] = [];
    entries.forEach((entry) => {
        if (entry.card.rpm === maxRpm) {
            winners.push(entry);
        }
    });
    return winners;
}

function findWinnersByEnergyRating(entries: RoundEntry[]): RoundEntry[] {
    const sortedEntries = sortEntriesByFeature(Array.from(entries.values()), Feature.EnergyRating);
    const maxEnergyRating = sortedEntries[0].card.energyRating;
    const winners: RoundEntry[] = [];
    entries.forEach((entry) => {
        if (entry.card.energyRating === maxEnergyRating) {
            winners.push(entry);
        }
    });
    return winners;
}

function findWinnersByFastestProgram(entries: RoundEntry[]): RoundEntry[] {
    const sortedEntries = sortEntriesByFeature(Array.from(entries.values()), Feature.FastestProgram);
    const fastestProgram = sortedEntries[0].card.fastestProgram;
    const winners: RoundEntry[] = [];
    entries.forEach((entry) => {
        if (entry.card.fastestProgram === fastestProgram) {
            winners.push(entry);
        }
    });
    return winners;
}

function findWinnersByCapacity(entries: RoundEntry[]): RoundEntry[] {
    const sortedEntries = sortEntriesByFeature(Array.from(entries.values()), Feature.Capacity);
    const maxCapacity = sortedEntries[0].card.capacity;
    const winners: RoundEntry[] = [];
    entries.forEach((entry) => {
        if (entry.card.capacity === maxCapacity) {
            winners.push(entry);
        }
    });
    return winners;
}
