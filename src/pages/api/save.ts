import type {NextApiRequest, NextApiResponse} from "next";
import {writeFile} from "fs/promises";
import * as yaml from "yaml";

type Data = {
    content: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const content = yaml.stringify(req.body);
    const dir = process.cwd();
    const filename = dir + "/dconf/dconf.yml";
    await writeFile(filename, content, "utf-8");
    res.status(200).end();
}
