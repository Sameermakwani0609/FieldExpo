const crypto = require('crypto');

const secretKey = 'MySuperSecure32ByteLongSecretKey'; // Must be 32 bytes
const encryptedText = '1cbf67b9565645dfda68dbf19d9d0fa2:6978a4eeaa450bee1f4261bcbb75f1a8';

// Split IV and encrypted data
const [iv, encrypted] = encryptedText.split(':');

// Convert hex to Buffer
const ivBuffer = Buffer.from(iv, 'hex');
const encryptedBuffer = Buffer.from(encrypted, 'hex');

// Create decipher
const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), ivBuffer);
let decrypted = decipher.update(encryptedBuffer);
decrypted = Buffer.concat([decrypted, decipher.final()]);

console.log('Decrypted Text:', decrypted.toString());
