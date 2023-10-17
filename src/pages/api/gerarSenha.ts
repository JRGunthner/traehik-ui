import bcrypt from "bcryptjs";
import type {NextApiRequest, NextApiResponse} from "next";

type Data = {
    content: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const ROUNDS = 1; // Número de rounds para encriptar a senha

    const senha = (req.body);
    const hash = bcrypt.hashSync(senha, ROUNDS);
    res.status(200).json({content: hash});
}
