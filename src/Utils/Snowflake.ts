/**
 * Snowflake structure is defined here:
 * https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right
 *
 * CREDITS: https://github.com/ianmitchell for the implementation (just didn't have a generator)
 */

import { faker } from "@faker-js/faker";

export type Snowflake = `${bigint}`;

export const EPOCH = 1_420_070_400_000n;

let inc = 0;
const maxInc = 4_095;

export function isSnowflake(id: string): id is Snowflake {
	return BigInt(id).toString() === id;
}

export const getTimestamp = (snowflake: Snowflake) => {
	return Number((BigInt(snowflake) >> BigInt(22)) + EPOCH);
};

export const getDate = (snowflake: Snowflake) => {
	return new Date(getTimestamp(snowflake));
};

export const getWorkerId = (snowflake: Snowflake) => {
	return Number((BigInt(snowflake) & BigInt(0x3e0000)) >> BigInt(17));
};

export const getProcessId = (snowflake: Snowflake) => {
	return Number((BigInt(snowflake) & BigInt(0x1f000)) >> BigInt(12));
};

export const getIncrement = (snowflake: Snowflake) => {
	return Number(BigInt(snowflake) & BigInt(0xfff));
};

export const generate = (timestamp: number, workerId: number, processId: number) => {
    if (inc >= maxInc) inc = 0;

	const snowflake = (BigInt(BigInt(timestamp) - EPOCH) << BigInt(22)) + (BigInt(workerId) << BigInt(17)) + (BigInt(processId) << BigInt(12)) + BigInt(inc++);

	return snowflake.toString();
}

export const generateBetween = (start: number, end: number) => {
    const epoch = faker.date.between({ from: new Date(start), to: new Date(end) }).getTime();

    const workerId = faker.number.int({ min: 0, max: 31 })
    const processId = faker.number.int({ min: 0, max: 31 })

    return generate(epoch, workerId, processId);
}

export const parse = (snowflake: Snowflake) => {
	return {
		timestamp: getTimestamp(snowflake),
		workerId: getWorkerId(snowflake),
		processId: getProcessId(snowflake),
		increment: getIncrement(snowflake),
	};;
}