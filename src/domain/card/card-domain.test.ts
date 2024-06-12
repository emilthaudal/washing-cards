import { RoundEntry } from "../game/model";
import { Feature, sortEntriesByFeature } from "./model";

describe("sort entries by feature", () => {
    const entries: RoundEntry[] = [
        {
            card: {
                brand: "Brand 1",
                capacity: "10 kg",
                energyRating: "A+++",
                fastestProgram: "30 min",
                name: "Card 1",
                rpm: 1000,
            },
            participant: "Player 1",
        },
        {
            card: {
                brand: "Brand 2",
                capacity: "20 kg",
                energyRating: "A++",
                fastestProgram: "40 min",
                name: "Card 2",
                rpm: 2000,
            },
            participant: "Player 2",
        },
        {
            card: {
                brand: "Brand 3",
                capacity: "30 kg",
                energyRating: "A+",
                fastestProgram: "50 min",
                name: "Card 3",
                rpm: 3000,
            },
            participant: "Player 3",
        },
    ];

    it("should sort by rpm", () => {
        //act
        const sorted = sortEntriesByFeature(entries, Feature.Rpm);

        //assert
        expect(sorted[0].card.rpm).toBe(3000);
        expect(sorted[1].card.rpm).toBe(2000);
        expect(sorted[2].card.rpm).toBe(1000);
    });

    it("should sort by energy rating", () => {
        //act
        const sorted = sortEntriesByFeature(entries, Feature.EnergyRating);

        //assert
        expect(sorted[0].card.energyRating).toBe("A+++");
        expect(sorted[1].card.energyRating).toBe("A++");
        expect(sorted[2].card.energyRating).toBe("A+");
    });

    it("should sort by fastest program", () => {
        //act
        const sorted = sortEntriesByFeature(entries, Feature.FastestProgram);

        //assert
        expect(sorted[0].card.fastestProgram).toBe("30 min");
        expect(sorted[1].card.fastestProgram).toBe("40 min");
        expect(sorted[2].card.fastestProgram).toBe("50 min");
    });

    it("should sort by capacity", () => {
        //act
        const sorted = sortEntriesByFeature(entries, Feature.Capacity);

        //assert
        expect(sorted[0].card.capacity).toBe("30 kg");
        expect(sorted[1].card.capacity).toBe("20 kg");
        expect(sorted[2].card.capacity).toBe("10 kg");
    });
});
