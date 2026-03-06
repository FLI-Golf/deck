export interface DataPoint {
	label: string;
	value: number;
}

export interface SeriesData {
	name: string;
	points: DataPoint[];
}
