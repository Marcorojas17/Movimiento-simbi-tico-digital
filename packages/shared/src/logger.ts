import type { LogLevel } from "./types.js";

const LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel): void {
	currentLevel = level;
}

export function log(level: LogLevel, message: string, meta?: unknown): void {
	if (LEVELS[level] < LEVELS[currentLevel]) return;
	const timestamp = new Date().toISOString();
	const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
	if (meta !== undefined) {
		console[level === "debug" ? "log" : level](prefix, message, meta);
	} else {
		console[level === "debug" ? "log" : level](prefix, message);
	}
}

export const logger = {
	debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
	info: (msg: string, meta?: unknown) => log("info", msg, meta),
	warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
	error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
