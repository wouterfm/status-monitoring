interface ResolvedParams {
    service: string;
    downTime: string;
    date: Date;
}

interface DownParams {
    service: string;
    date: Date;
}

interface StartedParams {
    date: Date;
}

interface SummaryParams {
    issues: number;
    resolved: number;
    date: Date;
}

interface WatchListItem {
    name: string;
    target: string;
    type: "http" | "ping"
}
