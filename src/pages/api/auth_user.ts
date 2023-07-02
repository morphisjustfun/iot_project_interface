import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'});
        return;
    }
    const {mail, password} = req.body;
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                mail: mail
            }
        });
        if (user.password !== password) {
            res.status(401).json({message: 'Invalid credentials'});
            return;
        }
        res.status(200).json({message: 'Logged in'});
        return;
    } catch (error) {
        res.status(401).json({message: 'Invalid credentials'});
        return;
    }

}