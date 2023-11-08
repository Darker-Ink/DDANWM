import { faker } from "@faker-js/faker";

// generates a heartbeat interval from 35s to 55s
export const generateHeartbeatInterval = () => {
    return faker.number.int({ min: 35_000, max: 55_000 });
}