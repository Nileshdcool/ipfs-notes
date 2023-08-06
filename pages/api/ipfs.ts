// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { create } from "ipfs-http-client";

import db from '../../utils/db';

// connect to the default API address http://localhost:5001
const client = create();

// arbitrary response format
export type BasicIpfsData = {
  cid: string;
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    saveData(req, res);
  } else {
    retrieveAllData(req, res);
  }
}

const retrieveAllData = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  try {
    const notes = await db.collection('notes').orderBy('created').get();
    const notesData = notes.docs.map(entry => ({
      id: entry.id,
      ...entry.data()
    }));
    res.status(200).json(notesData);
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw error;
  }
};

// this is if we want to retrive all records by cid from ipfs server

const saveData = async (
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData | null>
) => {
  try {
    const { txt } = req.body;
    const notes = await db.collection('notes').get();
    const notesData = notes.docs.map(entry => entry.data());
    if (notesData.some(entry => entry.content === txt)) {
      res.status(200).send(null);
    } else {
      const data: any = await client.add(txt);
      const ipfs = { cid: data.path, content: txt };
      const { id } = await db.collection('notes').add({
        ...ipfs,
        created: new Date().toISOString(),
      });
      console.log(id);
      res.status(200).json({ cid: data.path, content: txt });
    }
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw error;
  }
};
