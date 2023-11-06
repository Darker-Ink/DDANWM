import { GatewayDispatchEvents } from "discord-api-types/gateway/v10";

export interface EventType {
    random?: boolean;
    type: GatewayDispatchEvents
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

export { GatewayDispatchEvents }