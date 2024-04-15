# Status Monitoring with Telegram

This is a simple monitoring server developed in Typescript. I use it to monitor the uptime of my APIs and servers. If a check fails, I get an instant notification on Telegram. 🚨

Ensure you have a Telegram Bot + API token, and a channel where this bot is a member and can post messages.

## Variables

**TELEGRAM_API_URL**: This is the API URL for Telegram that includes your bot's API token (e.g.: https://api.telegram.org/bot123:abc).

**TELEGRAM_CHANNEL_ID**: This is the Channel ID for the Telegram channel where you want your bot to dispatch messages.

## Building & Running

`npm run dev` to launch the application in development mode (utilizes tsc-watch).

`npm run build` to construct the application.

`npm start` to launch the application.

## Watchlist

The server checks each item defined in the `watchlist` variable (src/watchlist.ts), this happens every 15 seconds.
