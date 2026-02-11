import type { GetServerSideProps } from "next";
import { randomUUID } from "crypto";
import { getDb } from "../lib/db";
import { emptyFicha, Ficha } from "../lib/schema";

export const getServerSideProps: GetServerSideProps = async () => {
  const db = await getDb();
  const fichas = db.collection<Ficha>("fichas");

  const existing = await fichas
    .find({})
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();

  let id = existing[0]?.id;

  if (!id) {
    id = randomUUID();
    const now = new Date().toISOString();
    const base = emptyFicha(id);
    const ficha: Ficha = { ...base, id, updatedAt: now };
    await fichas.insertOne(ficha as any);
  }

  return {
    redirect: {
      destination: `/ficha/${id}`,
      permanent: false
    }
  };
};

export default function HomeRedirect() {
  return null;
}
