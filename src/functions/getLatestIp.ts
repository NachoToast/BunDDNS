import { doFetch } from "./doFetch";

export async function getLatestIp(): Promise<string> {
    const response = await doFetch("https://cloudflare.com/cdn-cgi/trace");

    const text = await response.text();

    const ipString = text.split('\n').find(x => x.startsWith('ip='));

    if (ipString === undefined) {
        throw new Error(`Failed to find IP in trace response`);
    }

    const ip = ipString.split('=').at(-1);

    if (ip === undefined || ip.length === 0) {
        throw new Error('Invalid IP in trace response');
    }

    return ip;
}
