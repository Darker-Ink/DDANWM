import type Bot from "../Structures/Bot.js";

declare global {
	namespace Express {
		interface Request {
			bot?: Bot;
		}
	}
}