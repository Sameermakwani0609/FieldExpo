const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY || "MySuperSecure32ByteLongSecretKey"; // Must be 32 bytes
const key = crypto.createHash("sha256").update(SECRET_KEY).digest();

// ✅ Encrypt Function
const encryptData = (data) => {
  const IV = crypto.randomBytes(16); // Generate IV per encryption
  const cipher = crypto.createCipheriv("aes-256-cbc", key, IV);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return IV.toString("hex") + ":" + encrypted; // Store IV with encrypted data
};

// ✅ Decrypt Function
const decryptData = (encryptedData) => {
  try {
    const [ivHex, encrypted] = encryptedData.split(":");
    if (!ivHex || !encrypted) throw new Error("Invalid encrypted format");

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err.message);
    return null;
  }
};

module.exports = { encryptData, decryptData };