import type { DnsRecord, InputDnsRecord } from "../types/DnsRecord";
import { doJsonFetch } from "./doFetch";

export async function getRecordContent(record: InputDnsRecord, cloudflareToken: string): Promise<string> {
    const { zoneId, recordId } = record;

    const path = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;

    const { result } = await doJsonFetch<{ result: DnsRecord; }>(path, {
        headers: { Authorization: `Bearer ${cloudflareToken}` }
    });

    return result.content;
}
