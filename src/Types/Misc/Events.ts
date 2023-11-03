export interface EventType {
    random?: boolean;
    type: "guildCreate" | "guildDelete" | "guildUpdate" | "messageCreate" | "messageUpdate"
};

export interface EventPlannerOptions {
    eventsToSend: EventType[];
    interval?: number;
    randomInterval?: {
        max: number;
        min: number;
    };
    type: "interval" | "randomInterval" | "setTime";
}