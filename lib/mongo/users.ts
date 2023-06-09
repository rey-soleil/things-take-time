import clientPromise from "./client";

let client;
// TODO: use db's actual type
let db: any | null;
// TODO: use user's actual type
let users: any | null;

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

// TODO: use update's actual type
export async function updateUser(email: string, update: any) {
  try {
    if (!users) await init();

    await users.updateOne({ email }, { $set: update });

    return { success: true };
  } catch (error) {
    return { error: "Failed to update user." };
  }
}
