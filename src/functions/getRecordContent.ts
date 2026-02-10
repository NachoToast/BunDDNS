import type { DnsRecord, InputDnsRecord } from "../types/DnsRecord";
import { doJsonFetch } from "./doFetch";

export async function getRecordContent(record: InputDnsRecord): Promise<string> {
    const { zoneId, recordId, token } = record;

    const path = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;

    const { result } = await doJsonFetch<{ result: DnsRecord; }>(path, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return result.content;
}
