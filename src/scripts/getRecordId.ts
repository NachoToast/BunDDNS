import { doJsonFetch } from "@/functions/doFetch";
import type { DnsRecord } from "@/types/DnsRecord";
import { getCloudflareToken } from "../functions/getCloudflareToken";
import { Color } from "../types/Color";

type RelevantKeys = keyof Pick<DnsRecord, 'id' | 'name' | 'content' | 'proxied'>;

type ColumnWidths = Record<RelevantKeys, number>;

function readZoneId(): Promise<string> {
    console.log('Please enter the zone ID:');

    return new Promise<string>((resolve) => {
        process.stdin.on('data', (d) => {
            const zoneId = d.toString().trim();

            if (zoneId.length === 0) {
                console.log("Invalid ID, please try again");
                return;
            }

            resolve(zoneId);
        });
    });
}

async function getAllRecords(zoneId: string): Promise<DnsRecord[]> {
    const token = getCloudflareToken();

    const path = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

    const { result } = await doJsonFetch<{ result: DnsRecord[]; }>(path, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return result.filter(x => x.type === "A").sort((a, b) => a.type.localeCompare(b.type));
}

function getRecordStringParts(record: DnsRecord): Record<RelevantKeys, string> {
    const { id, name, content, proxied } = record;

    return {
        id: id.toString(),
        name: name.toString(),
        content: content.length > 32 ? content.slice(0, 29) + "..." : content,
        proxied: proxied ? 'Proxied' : 'DNS only'
    };
}

function calculateColumnWidths(records: DnsRecord[]): ColumnWidths {
    const output: ColumnWidths = { id: 0, name: 0, content: 0, proxied: 0 };

    const fields: RelevantKeys[] = ['id', 'name', 'content', 'proxied'];

    for (const record of records) {
        const asString = getRecordStringParts(record);

        for (const field of fields) {
            const length = asString[field].length;

            if (length > output[field]) {
                output[field] = length;
            }
        }
    }

    return output;
}

function* makeHeaders({ id, name, content, proxied }: ColumnWidths): Generator<string> {
    yield "ID".padEnd(id);
    yield "Name".padEnd(name);
    yield "Content".padEnd(content);
    yield "Proxy status".padEnd(proxied);
}

function* stringifyRecords(records: DnsRecord[], widths: ColumnWidths): Generator<string> {
    for (const record of records) {
        const parts = getRecordStringParts(record);

        const id = parts.id.padEnd(widths.id);
        const name = parts.name.padEnd(widths.name);
        const content = parts.content.padEnd(widths.content);

        let proxied = parts.proxied.padEnd(widths.proxied);

        if (record.proxied) {
            proxied = Color.Yellow + proxied + Color.Reset;
        }

        yield [id, name, content, proxied].join(' | ');
    }
}

const zoneId = await readZoneId();

const records = await getAllRecords(zoneId);

const columnWidths = calculateColumnWidths(records);

const outputMessage: string[] = [
    `Found ${records.length} A Record${records.length !== 1 ? 's' : ''}`,
    [...makeHeaders(columnWidths)].join(' | '),
    ...stringifyRecords(records, columnWidths)
];

console.log(outputMessage.join('\n'));
