export async function doFetch(url: string, options?: BunFetchRequestInit): Promise<Response> {
    const response = await fetch(url, options);

    if (!response.ok) {
        try {
            console.log(await response.json());
            console.log(await response.text());
        } catch {
            // ...
        }

        throw new Error(`Non-ok response received: ${response.status} (${response.statusText})`);
    }

    return response;
}

export async function doJsonFetch<T>(url: string, options?: BunFetchRequestInit): Promise<T> {
    const response = await doFetch(url, options);

    return await response.json() as T;

}
