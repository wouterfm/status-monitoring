import ping from "ping";

export async function pingCheck(host: string): Promise<boolean> {
    const res = await ping.promise.probe(host);

    return res.alive!!;
}

export async function httpCheck(url: string): Promise<boolean> {
    const res = await fetch(url);

    return (res.status >= 200 && res.status <= 299);
}