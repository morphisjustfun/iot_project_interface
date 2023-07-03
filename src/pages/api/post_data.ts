import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'});
        return;
    }

    const {endoAvg, endoSd, heartAvg, heartSd, time, runId, topic} = req.body;
    const prisma = new PrismaClient();

    try {
        const data = await prisma.data.create(
            {
                data: {
                    runId: runId,
                    topic: topic,
                    endoAvg: endoAvg,
                    endoSd: endoSd,
                    heartAvg: heartAvg,
                    heartSd: heartSd,
                    time: time
                }
            }
        );
        res.status(200).json({message: 'Success'});
        return;
    }
    catch (error) {
        res.status(401).json({message: 'Error'});
        return;
    }
}