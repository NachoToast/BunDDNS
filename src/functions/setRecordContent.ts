import type { DnsRecord, InputDnsRecord } from "../types/DnsRecord";
import { doJsonFetch } from "./doFetch";

export async function setRecordContent(record: InputDnsRecord, content: string, comment: string): Promise<void> {
    const { zoneId, recordId, name, proxied, token } = record;

    const path = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;

    await doJsonFetch(path, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            type: "A",
            content,
            proxied,
            comment,
        } satisfies Partial<DnsRecord>)
    });
}
