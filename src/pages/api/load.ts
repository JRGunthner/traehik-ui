import type {NextApiRequest, NextApiResponse} from "next";
import {readFile, access} from "fs/promises";
import * as process from "process";

type Data = {
    content: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const dir = process.cwd();
    try {
        const filename = dir + "/dconf/dconf.yml";
        console.log("carregando ", filename);
        await access(filename);
        const content = await readFile(filename, "utf-8");
        res.status(200).json({content});
    } catch (e) {
        console.error("arquivo dconf.yml não encontrado, carregando dconf.default.yml");
        const filename = dir + "/dconf.default.yml";
        const content = await readFile(filename, "utf-8");
        res.status(200).json({content});
    }
}
