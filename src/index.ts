import { CronJob } from "cron";
import { downTimeMinutes } from "./utils/calculations";
import { httpCheck, pingCheck } from "./utils/checkers";
import { publishToTelegramChannel, telegramChannelMessage } from "./utils/telegram";
import { watchlist } from "./watchlist";

const activeIssues = new Map<string, Date>();
const last24hStats = {
    issues: 0,
    resolved: 0,
    reset() {
        this.issues = 0;
        this.resolved = 0;
    }
}

export async function statusCheck(item: WatchListItem, fn: (target: string) => Promise<boolean>): Promise<void> {
    try {
        const isUp = await fn(item.target);

        if (isUp) {
            const activeIssue = activeIssues.get(item.target);

            // Check if this target had issues previously, so we can send an update
            if (activeIssue) {
                activeIssues.delete(item.target);
                last24hStats.resolved++;

                await publishToTelegramChannel(telegramChannelMessage.resolved({
                    date: new Date(),
                    downTime: `${downTimeMinutes(activeIssue, new Date())} minutes`,
                    service: item.name
                }));
            }

            return;
        }

        // Check if this issue is already reported
        if (!activeIssues.has(item.target)) {
            activeIssues.set(item.target, new Date());
            last24hStats.issues++;

            await publishToTelegramChannel(telegramChannelMessage.down({
                date: new Date(),
                service: item.name
            }));
        };
    } catch {
        if (!activeIssues.has(item.target)) {
            activeIssues.set(item.target, new Date());
            last24hStats.issues++;

            await publishToTelegramChannel(telegramChannelMessage.down({
                date: new Date(),
                service: item.name
            }));
        };
    }
}

async function watcher(): Promise<void> {
    for (const item of watchlist) {
        if (item.type === "http") {
            await statusCheck(item, httpCheck);
        }

        if (item.type === "ping") {
            await statusCheck(item, pingCheck);
        }
    };
};

async function summary(): Promise<void> {
    await publishToTelegramChannel(telegramChannelMessage.summary({
        date: new Date(),
        issues: last24hStats.issues,
        resolved: last24hStats.resolved
    }));
};

// Every 15 seconds, check statuses
CronJob.from({
    cronTime: "*/15 * * * * *",
    onTick: watcher,
    start: true,
});

// Every day at 00:00, send summary and reset stats
CronJob.from({
    cronTime: "0 0 0 * * *",
    onTick: async () => {
        await summary();
        last24hStats.reset();
    },
    start: true,
});

(async () => {
    console.log("Monitoring Started 👀")
    await publishToTelegramChannel(telegramChannelMessage.started({
        date: new Date()
    }));
})();