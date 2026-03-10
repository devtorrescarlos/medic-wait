export type slotData = {
    id?: string;
    doctorId: string;
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
    isAvailable?: boolean;
    version?: number;
}