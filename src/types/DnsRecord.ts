interface BaseDnsRecord {
    name: string;

    proxied: boolean;
}

export interface InputDnsRecord extends BaseDnsRecord {
    zoneId: string;

    recordId: string;

    /**
     * Token to read from env when updating this record.
     *
     * @default "CLOUDFLARE_API_TOKEN"
     */
    token?: string;
}

export interface DnsRecord extends BaseDnsRecord {
    id: string;

    type: string;

    content: string;

    comment: string;
}
