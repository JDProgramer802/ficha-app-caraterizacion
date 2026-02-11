import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string | undefined;
const dbName = process.env.MONGODB_DB as string | undefined;

if (!uri) {
  throw new Error("MONGODB_URI no está definido en las variables de entorno");
}

if (!dbName) {
  throw new Error("MONGODB_DB no está definido en las variables de entorno");
}

let client: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  if (!client) {
    // En este punto ya validamos que uri no es undefined
    client = new MongoClient(uri!);
    await client.connect();
  }
  cachedDb = client.db(dbName);
  return cachedDb;
}
