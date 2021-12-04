export const server = process.env.SERVER;
export const timeout = Number.parseInt(process.env.TIMEOUT, 10) || 5000;
export const interval = Number.parseInt(process.env.INTERVAL, 10) || 60000;
export const webhookId = process.env.WEBHOOK_ID;
export const webhookToken = process.env.WEBHOOK_TOKEN;
