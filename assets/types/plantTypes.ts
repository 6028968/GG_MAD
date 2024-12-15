export type Plant = {
    id: number;
    naam: string;
    soort: string;
    aanwezig: boolean;
    wetenschappelijkeNaam: string;
    dagenInKas: number;
    totaalGeplant: number;
    mislukteOogst: number;
    succesvolleOogst: number;
    zonlicht: string;
    irrigatieFrequentie: string;
    laatsteIrrigratie: string;
    aankomendeIrrigratie: string;
    laatsteBemesting: string;
    aankomendeBemesting: string;
    meestSuccesvolleMaand: string;
    meestSuccesvolleSeizoen: string;
    kant: "Links" | "Rechts";
};

export type PlantItem = {
    id: number;
    naam: string;
    soort: string;
    // wetenschappelijkeNaam: string;
    aanwezig: boolean;
    kant: string;
};