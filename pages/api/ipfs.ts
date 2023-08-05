// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { create } from "ipfs-http-client";

// connect to the default API address http://localhost:5001
const client = create();

// arbitrary response format
export type BasicIpfsData = {
  cid: string;
  content: string;
};


const userNotes: BasicIpfsData[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData>
) {
  if (req.method === "POST") {
    saveData(req, res);
  } else {
    // Handle any other HTTP method
    retrieveData(req, res);
  }
}


const retrieveData = async (
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData>
) => {
  try {
    const data = [];
    for await (const chunk of client.cat("QmcbyRoeU3w7PUS5wH1i1jGzmfCzBQEQvsGFV5GBoYvADV")) {
      data.push(chunk);
    }
    // Join the chunks into a single buffer
    const contentBuffer = Buffer.concat(data);
    let result = contentBuffer.toString();
    res.status(200).json({ cid: "QmcbyRoeU3w7PUS5wH1i1jGzmfCzBQEQvsGFV5GBoYvADV", content: result });
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw error;
  }
};

const saveData = async (
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData>
) => {
  const { txt } = req.body;
  const string = txt;
  const data: any = await client.add(string);
  userNotes.push({
    cid: data.path,
    content: string
  });
  res.status(200).json({ cid: data.path, content: string });
};
