"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cifrar = cifrar;
exports.descifrar = descifrar;
const crypto_1 = require("crypto");
function obtenerLlave() {
    const secreto = process.env.CONFIG_ENCRYPTION_KEY;
    if (!secreto) {
        throw new Error('Falta CONFIG_ENCRYPTION_KEY en las variables de entorno. Es ' +
            'obligatoria para cifrar/descifrar credenciales guardadas por el ' +
            'admin (SMTP, WhatsApp, pagos). Genera una con: ' +
            `openssl rand -hex 32`);
    }
    return (0, crypto_1.scryptSync)(secreto, 'turismo-config-salt', 32);
}
function cifrar(texto) {
    const iv = (0, crypto_1.randomBytes)(12);
    const llave = obtenerLlave();
    const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', llave, iv);
    const cifrado = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString('base64'), authTag.toString('base64'), cifrado.toString('base64')].join(':');
}
function descifrar(valor) {
    const [ivB64, authTagB64, cifradoB64] = valor.split(':');
    if (!ivB64 || !authTagB64 || !cifradoB64) {
        throw new Error('Formato de valor cifrado inválido.');
    }
    const llave = obtenerLlave();
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', llave, Buffer.from(ivB64, 'base64'));
    decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));
    const descifrado = Buffer.concat([
        decipher.update(Buffer.from(cifradoB64, 'base64')),
        decipher.final(),
    ]);
    return descifrado.toString('utf8');
}
//# sourceMappingURL=crypto.util.js.map