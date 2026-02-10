import { Color } from "@/types/Color";

export function getCloudflareToken(name: string = 'CLOUDFLARE_API_TOKEN'): string {
    const token = process.env[name]?.trim() ?? "";

    if (token.length === 0) {
        throw new Error(`Missing ${Color.Red}${name}${Color.Reset} in .env`);
    }

    return token;
}
