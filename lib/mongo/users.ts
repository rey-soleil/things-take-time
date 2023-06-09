import { Collection, Db, MongoClient } from "mongodb";
import clientPromise from "./client";

let client: MongoClient;
let db: Db;
let users: Collection;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();
    users = await db.collection("users");
  } catch (error) {
    throw new Error("Failed to stablish connection to database");
  }
}

export async function updateUser(email: string, update: {}) {
  try {
    if (!users) await init();

    await users.updateOne({ email }, { $set: update });

    return { success: true };
  } catch (error) {
    return { error: "Failed to update user." };
  }
}
