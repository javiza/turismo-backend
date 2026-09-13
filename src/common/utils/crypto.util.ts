import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * Cifrado simétrico (AES-256-GCM) para credenciales sensibles que el admin
 * guarda desde el panel (SMTP, WhatsApp, Transbank, Mercado Pago) y que
 * viven en la base de datos, no en el .env.
 *
 * La llave maestra (CONFIG_ENCRYPTION_KEY) SÍ vive en el .env — nunca es
 * editable desde el panel — y nunca se guarda en la base de datos. Sin
 * ella, nadie con acceso solo a un respaldo de la DB puede leer las
 * credenciales en texto plano.
 *
 * Formato de salida: "iv:authTag:ciphertext", todo en base64, para poder
 * guardarlo como un solo string en una columna `text`.
 */

function obtenerLlave(): Buffer {
  const secreto = process.env.CONFIG_ENCRYPTION_KEY;

  if (!secreto) {
    throw new Error(
      'Falta CONFIG_ENCRYPTION_KEY en las variables de entorno. Es ' +
        'obligatoria para cifrar/descifrar credenciales guardadas por el ' +
        'admin (SMTP, WhatsApp, pagos). Genera una con: ' +
        `openssl rand -hex 32`,
    );
  }

  // scrypt deriva una llave de 32 bytes válida para AES-256 a partir de
  // cualquier string que pongas en CONFIG_ENCRYPTION_KEY (no exige que
  // sea exactamente 32 bytes ya formateados).
  return scryptSync(secreto, 'turismo-config-salt', 32);
}

export function cifrar(texto: string): string {
  const iv = randomBytes(12);
  const llave = obtenerLlave();
  const cipher = createCipheriv('aes-256-gcm', llave, iv);

  const cifrado = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString('base64'), authTag.toString('base64'), cifrado.toString('base64')].join(
    ':',
  );
}

export function descifrar(valor: string): string {
  const [ivB64, authTagB64, cifradoB64] = valor.split(':');
  if (!ivB64 || !authTagB64 || !cifradoB64) {
    throw new Error('Formato de valor cifrado inválido.');
  }

  const llave = obtenerLlave();
  const decipher = createDecipheriv('aes-256-gcm', llave, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));

  const descifrado = Buffer.concat([
    decipher.update(Buffer.from(cifradoB64, 'base64')),
    decipher.final(),
  ]);

  return descifrado.toString('utf8');
}
