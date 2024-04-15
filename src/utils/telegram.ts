import dotenv from "dotenv";
dotenv.config();

const telegramApiUrl = process.env.TELEGRAM_API_URL as string;
const telegramChannel = process.env.TELEGRAM_CHANNEL_ID as string;

export async function publishToTelegramChannel(text: string): Promise<void> {
    const res = await fetch(telegramApiUrl + "/sendMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text,
            chat_id: telegramChannel,
            parse_mode: "Markdown",
            link_preview_options: { is_disabled: true }
        })
    });

    if (res.status !== 200) throw new Error(`Failed publishing to Telegram with status ${res.status}`);
}

export const telegramChannelMessage = {
    started(params: StartedParams) {
        return `*Monitoring Started 👀*\nDate: ${params.date.toUTCString()}`
    },
    resolved(params: ResolvedParams) {
        return `*Alert: Service Up ✅*\nService: ${params.service}\nDowntime: ${params.downTime}\nDate: ${params.date.toUTCString()}`
    },
    down(params: DownParams) {
        return `*Alert: Service Down 🚨*\nService: ${params.service}\nDate: ${params.date.toUTCString()}`
    },
    summary(params: SummaryParams) {
        return `*Summary Last 24h 📃*\nIssues: ${params.issues}\nResolved: ${params.resolved}`
    },
}