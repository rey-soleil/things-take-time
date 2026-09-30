import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";
import clientPromise from "./mongo/client";
import { NotionConnection, NotionError } from "./notion";

function encryptionKey() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret)
    throw new NotionError(
      "Notion setup requires NEXTAUTH_SECRET on the server.",
      503
    );
  return createHash("sha256").update(`notion-connection:${secret}`).digest();
}

function encrypt(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), ciphertext]
    .map((part) => part.toString("base64"))
    .join(".");
}

function decrypt(value: string) {
  const [iv, tag, ciphertext] = value
    .split(".")
    .map((part) => Buffer.from(part, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

async function users() {
  if (!process.env.MONGODB_URI)
    throw new NotionError(
      "Notion setup requires the app's user database.",
      503
    );
  return (await clientPromise).db().collection("users");
}

export async function getNotionConnection(
  email: string
): Promise<NotionConnection | null> {
  const user = await (
    await users()
  ).findOne({ email }, { projection: { notionConnection: 1 } });
  if (!user?.notionConnection) return null;
  try {
    return {
      token: decrypt(user.notionConnection.encryptedToken),
      dataSourceId: user.notionConnection.dataSourceId,
    };
  } catch {
    throw new NotionError(
      "Please reconnect Notion; the saved connection could not be opened.",
      503
    );
  }
}

export async function saveNotionConnection(
  email: string,
  connection: NotionConnection
) {
  const encryptedToken = encrypt(connection.token);
  const result = await (
    await users()
  ).updateOne(
    { email },
    {
      $set: {
        notionConnection: {
          encryptedToken,
          dataSourceId: connection.dataSourceId,
        },
      },
    }
  );
  if (!result.matchedCount)
    throw new NotionError(
      "Your account could not be found. Sign in again.",
      401
    );
}

export async function removeNotionConnection(email: string) {
  await (
    await users()
  ).updateOne({ email }, { $unset: { notionConnection: "" } });
}
