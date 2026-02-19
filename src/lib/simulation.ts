export type BinStatus = 'operational' | 'full' | 'maintenance';

export interface SimulatedBin {
    id: string;
    name: string;
    lat: number;
    lng: number;
    accepts: string[];
    fill_percent: number;
    status: BinStatus;
    last_updated: string;
}

const BIN_NAMES = [
    "Metro Station", "Central Mall", "Tech Park Gate 1", "City Library",
    "Main Market", "University Campus", "Bus Terminal", "Community Park",
    "Sports Complex", "Cinema Hall", "Shopping Plaza", "Office Complex"
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomStatus(fill: number): BinStatus {
    if (fill > 90) return 'full';
    if (Math.random() > 0.95) return 'maintenance';
    return 'operational';
}

export function generateBins(centerLat: number, centerLng: number, count: number = 15): SimulatedBin[] {
    const bins: SimulatedBin[] = [];

    for (let i = 0; i < count; i++) {
        // Generate random offset within ~2-3km
        // 1 deg lat ~ 111km, so 0.02 deg ~ 2.2km
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;

        const fill = getRandomInt(10, 100);

        // Weighted random items
        const allItems = ["battery", "phone", "laptop", "charger", "cable"];
        const numItems = getRandomInt(2, 5);
        const accepts = allItems.sort(() => 0.5 - Math.random()).slice(0, numItems);

        bins.push({
            id: `sim-bin-${i}-${Date.now()}`,
            name: `${BIN_NAMES[i % BIN_NAMES.length]} ${String.fromCharCode(65 + (i % 5))}`,
            lat: centerLat + latOffset,
            lng: centerLng + lngOffset,
            accepts,
            fill_percent: fill,
            status: getRandomStatus(fill),
            last_updated: new Date().toISOString()
        });
    }

    return bins;
}
