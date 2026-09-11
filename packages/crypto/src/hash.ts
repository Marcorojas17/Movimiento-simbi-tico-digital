import { createHash } from "node:crypto";

export function sha256(data: Buffer | string): string {
	return createHash("sha256").update(data).digest("hex");
}

export function sha512(data: Buffer | string): string {
	return createHash("sha512").update(data).digest("hex");
}

export function sha1(data: Buffer | string): string {
	return createHash("sha1").update(data).digest("hex");
}
