import ping from "ping";

export async function pingCheck(host: string): Promise<boolean> {
    const res = await ping.promise.probe(host);

    return res.alive!!;
}

export async function httpCheck(url: string): Promise<boolean> {
    const controller = new AbortController;

    setTimeout(() => controller.abort(), 5000); // Abort request if it takes >= 5 seconds

    const res = await fetch(url, { signal: controller.signal }).catch(() => null);

    return res !== null ? (res.status >= 200 && res.status <= 299) : false;
}