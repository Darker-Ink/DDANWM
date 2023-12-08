import { writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const URL = "https://error-codes.darkerink.workers.dev/";
const path = (join(dirname(fileURLToPath(import.meta.url)), "../src/Constants/Errors.json")).replace(/^[A-Za-z]:/, "").replaceAll("\\", "/");

const start = async () => {
    const fetched = await fetch(URL);

    if (!fetched.ok) {
        throw new Error("Failed to fetch");
    }

    const text = await fetched.text();

    try {
        const parse = JSON.parse(text);
        const read = JSON.parse(await readFile(path, "utf8"));

        const newErrors = parse.filter((error) => !read.some((e) => e.code === error.code));
        const removedErrors = read.filter((error) => !parse.some((e) => e.code === error.code));

        if (removedErrors.length > 0) {
            console.log(`Removed ${removedErrors.length} errors`);

            for (const error of removedErrors) {
                console.log(`${error.group} - ${error.code} (${error.message})`);
            }

            if (!process.argv.includes("--force") && !process.argv.includes("-f")) {
                console.error("Cannot remove errors, human review required");

                return;
            }
        }

        if (newErrors.length > 0) {
            console.log(`Added ${newErrors.length} errors`);

            for (const error of newErrors) {
                console.log(`${error.group} - ${error.code} (${error.message})`);
            }
        }

        await writeFile(path, JSON.stringify(parse, null, 4)); // We are fine for adding new errors

        console.log("Done");
    } catch {
        throw new Error("Failed to parse JSON");
    }
};

start();