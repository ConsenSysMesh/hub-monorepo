import getDb from '@tipster/express/data/mongo-client.mjs';

// {
//     botConfigId: ''
//     fromFid: '',
//     toFid: '',
//     tipAmount: 50,
//     timestamp: new Date(),
// }

const getTipCol = async () => {
    const db = await getDb();
    return db.collection('tips');
};

const TipData = {
    createTipRecord: async (tip, session = null) => {
        const tipCol = await getTipCol();
        const cursor = await tipCol.insertOne(tip, { session });
        return cursor;
    },
    queryTipsByDateRange: async (botConfigId, startDate, endDate = new Date(), session = null) => {
        const tipCol = await getTipCol();
        const cursor = await tipCol.find({
            botConfigId,
            timestamp: {
                $gte: startDate,
                $lte: endDate,
            }
        }, { session });
        const tips = await cursor.toArray();
        return tips;
    },
};

export default TipData;