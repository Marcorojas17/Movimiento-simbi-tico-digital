import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export function encrypt(plaintext: Buffer, key: Buffer): Buffer {
	if (key.length !== 32) throw new Error("Key must be 32 bytes");
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGO, key, iv);
	const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([iv, tag, encrypted]);
}

export function decrypt(payload: Buffer, key: Buffer): Buffer {
	if (key.length !== 32) throw new Error("Key must be 32 bytes");
	const iv = payload.subarray(0, IV_LENGTH);
	const tag = payload.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
	const encrypted = payload.subarray(IV_LENGTH + TAG_LENGTH);
	const decipher = createDecipheriv(ALGO, key, iv);
	decipher.setAuthTag(tag);
	return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}
