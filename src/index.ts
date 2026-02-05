import { schedule } from 'node-cron';
import { dnsRecords } from '../config.json';
import { getCloudflareToken } from "./functions/getCloudflareToken";
import { getLatestIp } from "./functions/getLatestIp";
import { getRecordContent } from "./functions/getRecordContent";
import { makeTimestamp } from './functions/makeTimestamp';
import { setRecordContent } from './functions/setRecordContent';
import { Color } from './types/Color';
import type { InputDnsRecord } from './types/DnsRecord';


const cloudflareToken = getCloudflareToken();

let lastLoggedSameIp = false;
let isDoingTheThing = false;

const s = dnsRecords.length === 1 ? "" : "s";

async function main(): Promise<void> {
    const [oldIp, newIp] = await Promise.all([
        getRecordContent(dnsRecords[0], cloudflareToken),
        getLatestIp(),
    ]);

    if (oldIp === newIp) {
        if (!lastLoggedSameIp) {
            lastLoggedSameIp = true;
            console.log(`[${makeTimestamp()}] IP Unchanged (${oldIp})`);
        }

        return;
    }

    lastLoggedSameIp = false;
    console.log(`[${makeTimestamp()}] IP Changed (${oldIp} => ${newIp}) - Updating ${dnsRecords.length} Record${s}...`);

    const comment = `Auto-updated on ${makeTimestamp()} (previously ${oldIp})`;

    async function loggedUpdate(record: InputDnsRecord): Promise<void> {
        try {
            await setRecordContent(record, cloudflareToken, newIp, comment);

            console.log(`[${makeTimestamp()}] Updated ${Color.Green}${record.name}${Color.Reset} successfully`);
        } catch (error) {
            console.log(`[${makeTimestamp()}] Failed to update ${Color.Red}${record.name}${Color.Reset}\n`, error);
        }
    }

    await Promise.all(dnsRecords.map((record) => loggedUpdate(record)));

    console.log(`[${makeTimestamp()}] Finished update of ${dnsRecords.length} record${s}`);
}

async function wrappedMain(): Promise<void> {
    if (isDoingTheThing) {
        console.log(`[${makeTimestamp()}] Previous execution was not completed in time!`);
        return;
    }

    isDoingTheThing = true;

    try {
        await main();
    } catch (error) {
        console.log(`[${makeTimestamp()}] Unhandled error in execution`, error);
    } finally {
        isDoingTheThing = false;
    }
}

wrappedMain();


schedule("*/5 * * * *", wrappedMain);


