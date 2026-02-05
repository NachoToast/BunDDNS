import { Color } from "@/types/Color";

export function getCloudflareToken(): string {
    const token = process.env['CLOUDFLARE_API_TOKEN']?.trim() ?? "";

    if (token.length === 0) {
        throw new Error(`Missing ${Color.Red}CLOUDFLARE_API_TOKEN${Color.Reset} in .env`);
    }

    return token;
}
