import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
// On crée un hash de la clé du .env pour garantir qu'elle fasse exactement 32 octets (256 bits)
const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(String(process.env.ENCRYPTION_KEY))
  .digest();

export function encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    const authTag = cipher.getAuthTag().toString("hex");
    
    // On stocke l'IV et le tag avec le texte pour déchiffrer plus tard
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(text: string) {
    const [ivHex, authTagHex, encryptedText] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}