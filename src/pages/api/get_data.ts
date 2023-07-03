import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'});
        return;
    }
    // get all Data with a given runId
    const {runId} = req.body;
    const prisma = new PrismaClient();

    try {
        const data = await prisma.data.findMany({
            where: {
                runId: runId
            },
            select: {
                id: false,
                runId: false,
                topic: false,
                time: true,
                endoAvg: true,
                endoSd: true,
                heartAvg: true,
                heartSd: true,
            },
            orderBy: {
                time: 'asc'
            }
        });
        const dataTransformed = data.map((d) => {
            const dTransformed = {
                ...d,
                time: d.time.toString()
            }
            return dTransformed;
        });
        res.status(200).json({message: 'Success', data: dataTransformed});
        return;
    }
    catch (error) {
        res.status(401).json({message: 'Error'});
        return;
    }
}