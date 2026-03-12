import fs from "fs";
import { countries } from "../src/api/v1/countries.js";
const NAME_OVERRIDE = {
    Gambia: "The Gambia",
    Ireland: "Republic of Ireland",
    "Ivory Coast": "Côte d'Ivoire",
    "Democratic Republic of the Congo": "Democratic Republic of the Congo",
    "Republic of the Congo": "Republic of the Congo",
    "Cabo Verde": "Cape Verde",
    "Congo (Republic of the)": "Republic of the Congo",
    "Micronesia (Federated States of)": "Federated States of Micronesia",
    "Sao Tome and Principe": "São Tomé and Príncipe"
};
const GOVERNMENT_OVERRIDE = {
    Australia: {
        type: "Federal Parliamentary Constitutional Monarchy",
        leader_title: "Governor-General",
        leader: "Sam Mostyn"
    },
    Afghanistan: {
        type: "Islamic Emirate",
        leader_title: "Supreme Leader",
        leader: "Hibatullah Akhundzada"
    },
    Libya: {
        type: "Provisional Government",
        leader_title: "Chairman, Presidential Council",
        leader: "Mohammed Al-Menfi"
    },
    Switzerland: {
        type: "Federal Assembly-Independent Republic",
        leader_title: "Federal President",
        leader: "Guy Parmelin"
    },
    Djibouti: {
        type: "Dominant-Party Presidential Republic",
        leader_title: "President",
        leader: "Ismail Omar Guelleh"
    },
    Comoros: {
        type: "Federal Presidential Republic",
        leader_title: "President",
        leader: "Azali Assoumani"
    },
    "Western Sahara": {
        type: "Partially Recognised State",
        leader_title: null,
        leader: null
    },
    Taiwan: {
        type: "Semi-Presidential Republic",
        leader_title: "President",
        leader: "Lai Ching-te"
    },
    "Vatican City": {
        type: "Absolute Elective Monarchy",
        leader_title: "Pope",
        leader: "Leo XIV"
    },
    "Ivory Coast": {
        type: "Presidential Republic",
        leader_title: "President",
        leader: "Alassane Ouattara"
    },
    Georgia: {
        type: "Semi-Presidential Republic",
        leader_title: "President",
        leader: "Mikheil Kavelashvili"
    },
    Bahamas: {
        type: "Parliamentary Constitutional Monarchy",
        leader_title: "Monarch",
        leader: "Charles III"
    },
    Micronesia: {
        type: "Federal Presidential Republic",
        leader_title: "President",
        leader: "Wesley Simina"
    },
    Qatar: {
        type: "Authoritarian Semi-Constitutional Monarchy",
        leader_title: "Emir",
        leader: "Tamim bin Hamad"
    },
    Andorra: {
        type: "Parliamentary Constitutional Principality",
        leader_title: "Co-Princes",
        leader: "Emmanuel Macron & Joan-Enric Vives Sicília"
    }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function cleanText(text) {
    if (!text) return null;
    return (
        text
            .replace(/{{[^}]*}}/g, "")
            .replace(/\[\[|\]\]/g, "")
            .replace(/''/g, "")
            .trim() || null
    );
}

function cleanGovType(govType) {
    if (!govType) return null;
    return (
        govType
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/\s+under\s+.*/i, "")
            .replace(/{{.*$/g, "")
            .replace(/<ref[^/]*\/>/gi, "")
            .replace(/<\/?ref[^>]*>/gi, "")
            .replace(/&[a-z]+;/gi, " ")
            .replace(/\[\[[^\]]*#[^\]]*\|([^\]]+)\]\]/g, "$1")
            .replace(/\[\[[^\]]*#[^\]]*\]\]/g, "")
            .replace(/#\S+/g, "")
            .replace(/\[\[List[^\]]*\]\]/gi, "")
            .replace(/\[\[|\]\]/g, "")
            .replace(/^Unitary\s+/i, "")
            .replace(/\s+/g, " ")
            .trim() || null
    );
}

async function fetchGovernmentData(countryName) {
    if (GOVERNMENT_OVERRIDE[countryName]) {
        const override = GOVERNMENT_OVERRIDE[countryName];
        return {
            type: override.type ?? null,
            leader_title: override.leader_title ?? null,
            leader: override.leader ?? null
        };
    }

    const wikiName = NAME_OVERRIDE[countryName] ?? countryName;

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(wikiName)}&prop=wikitext&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        const wikitext = data.parse.wikitext["*"];

        const titleMatch = wikitext.match(
            /leader_title1\s*=\s*\[\[([^\]|]+)\|?([^\]]*)\]\]/
        );
        const nameMatch = wikitext.match(
            /leader_name1\s*=\s*(?:{{[^|]*\|)?\[\[([^\]|]+)\|?([^\]]*)\]\]/
        );
        const nameServingMatch = wikitext.match(
            /leader_name1\s*=.*?\(\[\[([^\]|]+)\|?([^\]]*)\]\]\s*serving/
        );
        const name2Match = wikitext.match(
            /leader_name2\s*=\s*(?:{{[^|]*\|)?\[\[([^\]|]+)\|?([^\]]*)\]\]/
        );
        const govMatch = wikitext.match(/government_type\s*=\s*([^\n|]+)/);

        const leaderTitle = cleanText(titleMatch?.[2] || titleMatch?.[1]);
        const leaderName =
            cleanText(nameServingMatch?.[2] || nameServingMatch?.[1]) ??
            cleanText(nameMatch?.[2] || nameMatch?.[1]) ??
            cleanText(name2Match?.[2] || name2Match?.[1]) ??
            null;
        const govType = cleanGovType(govMatch?.[1]);

        return {
            type: GOVERNMENT_OVERRIDE[countryName] ?? govType,
            leader_title: leaderTitle,
            leader: leaderName
        };
    } catch (err) {
        console.error(`❌ Failed: ${countryName}`, err.message);
        return null;
    }
}

// batch size — how many countries fetched concurrently per pool
const BATCH_SIZE = 10;
// delay between batches in ms — prevents Wikipedia rate limit
const BATCH_DELAY = 200;

async function main() {
    const updated = [];
    const skipped = [];
    const start = Date.now();

    // split countries into chunks of BATCH_SIZE
    const batches = [];
    for (let i = 0; i < countries.length; i += BATCH_SIZE) {
        batches.push(countries.slice(i, i + BATCH_SIZE));
    }

    for (const [i, batch] of batches.entries()) {
        const batchStart = Date.now();
        console.log(`\n Batch ${i + 1}/${batches.length}`);

        // fetch all countries in batch concurrently
        const results = await Promise.all(
            batch.map(async country => {
                const t = Date.now();
                const government = await fetchGovernmentData(country.name);
                console.log(`🌍 ${country.name} — ${Date.now() - t}ms`);
                return { country, government };
            })
        );

        // process results
        for (const { country, government } of results) {
            const allNull =
                !government || Object.values(government).every(v => v === null);

            if (allNull) {
                console.log(`⚠️  Skipped: ${country.name} (all null)`);
                skipped.push(country.name);
                continue;
            }

            updated.push({ ...country, government });
            console.log(`✅ ${country.name} →`, government);
        }

        console.log(`⏱  Batch done — ${Date.now() - batchStart}ms`);

        await delay(BATCH_DELAY);
    }

    const output = `export const countries = ${JSON.stringify(updated, null, 2)};`;
    fs.writeFileSync("./src/api/v1/countries.js", output, "utf-8");

    console.log(`\n total ${Date.now() - start}ms`);
    if (skipped.length > 0) {
        console.log(`Skipped: ${skipped.join(", ")}`);
    }
}

main().catch(err => console.error("main error:", err.message));
