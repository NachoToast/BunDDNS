interface BaseDnsRecord {
    name: string;

    proxied: boolean;
}

export interface InputDnsRecord extends BaseDnsRecord {
    zoneId: string;

    recordId: string;
}

export interface DnsRecord extends BaseDnsRecord {
    id: string;

    type: string;

    content: string;

    comment: string;
}
