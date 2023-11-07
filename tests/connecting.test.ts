/* eslint-disable @typescript-eslint/no-floating-promises */
import { Client } from "discord.js";
import DDANWM from "../src/DDANWM/DDANWM.ts";

const start = async () => {
    const mocker = new DDANWM({
        api: {
            port: 3_000,
            host: "localhost"
        },
        ws: {
            port: 3_001,
            host: "localhost",
            maxConnections: 50
        },
        defaultApiVersion: "v10",
        debug: {
            api: {
                raw: true
            }
        }
    });

    await mocker.start();

    const bot = mocker.bots.create();

    mocker.log("info", `Created Bot (${bot.username} - ${bot.id}), token: ${bot.tokens[0]}`);

    const client = new Client({
        intents: [],
        rest: {
            api: "http://localhost:3000/api"
        }
    });

    client.on("ready", () => {
        mocker.log("info", `Using Discord.js ${client.user?.username} has connected to the mocker!`);
    });

    client.login(bot.tokens[0]);
};

start();