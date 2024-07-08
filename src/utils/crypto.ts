import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "crypto";

/**
 * Encrypts a given string or object using AES-256-CBC algorithm and a secret key.
 *
 * This function converts the input data (string or object) into a string, generates a new initialization vector (IV) for each encryption,
 * and then encrypts the data using the provided secret key. The encrypted data and the IV are returned in hex format.
 *
 * @param {string|object} data - The data to be encrypted. Can be a string or an object. If an object is provided, it will be stringified.
 * @param {string} secretKey - The secret key used for encryption, expected to be in UTF-8 format.
 *
 * @returns {Object} An object containing the initialization vector (`iv`) and the encrypted data (`encryptedData`).
 *
 * Note: It's crucial to securely store the secret key and the IV. The same secret key and IV must be used for decryption.
 */
export const encrypt = (data: string | object, secretKey: string) => {
  const text = typeof data === "object" ? JSON.stringify(data) : data;
  const iv = randomBytes(16); // Generate a new IV for each encryption
  const secretKeyBuffer = Buffer.from(secretKey, "hex");
  const cipher = createCipheriv("aes-256-cbc", secretKeyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};

/**
 * Decrypts an encrypted object using AES-256-CBC algorithm and a secret key.
 *
 * This function takes an object containing an initialization vector (`iv`) and encrypted data (`encryptedData`),
 * along with a secret key, and returns the decrypted data. The decrypted data is attempted to be parsed as JSON,
 * and if parsing is successful, a JSON object is returned. If JSON parsing fails, the raw decrypted string is returned.
 *
 * @param {Object} encryptedObject - An object containing the encrypted data and its initialization vector.
 *   - `iv`: A string representing the initialization vector used during encryption, expected to be in UTF-8 format.
 *   - `encryptedData`: A string representing the encrypted data, expected to be in UTF-8 format.
 * @param {string} secretKey - The secret key used for decryption, expected to be in UTF-8 format.
 *
 * @returns {Object|string} The decrypted data as a JSON object if it can be parsed as such, or the raw decrypted string otherwise.
 */
export const decrypt = (
  encryptedObject: { iv: string; encryptedData: string },
  secretKey: string
): object | string => {
  const secretKeyBuffer = Buffer.from(secretKey, "hex");
  const decipher = createDecipheriv(
    "aes-256-cbc",
    secretKeyBuffer,
    Buffer.from(encryptedObject.iv, "hex")
  );
  let decrypted = decipher.update(encryptedObject.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  try {
    // Attempt to parse the decrypted string as JSON
    return JSON.parse(decrypted);
  } catch (error) {
    // If parsing fails, return the original decrypted string
    return decrypted;
  }
};

export function hash(value: string): string {
  const hash = createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
}
