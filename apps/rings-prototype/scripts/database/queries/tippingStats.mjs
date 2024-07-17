// import envConfig from '@tipster/express/env-loader/index.mjs';
import {MongoClient} from "mongodb";
import logger from "@tipster/express/logger.mjs";
import _ from 'lodash';

const run = async () => {
    const client = new MongoClient('mongodb+srv://tipster-production:gbskEUV67K3RbFIo@sobol-production.6brj5.mongodb.net/tipster');
    const conn = await client.connect();
    logger.info('Connected to mongo successfully');

    try {
        // const tipCol = conn.db('tipster').collection('users');

        const oCol = conn.db('tipster').collection('tips');

        const thing = await oCol.find({ toFid: 438190 });
        const val = await thing.count;
        console.log('hello');
        console.log('test', val);
        await thing.forEach(doc => {
            console.log(JSON.stringify(doc, null, 2));
        });

        // const result = await tipCol.aggregate([
        //     {
        //         $group: {
        //             _id: { id: "$id", botConfigId: "$botConfigId" },
        //             count: { $sum: 1 },
        //             docs: { $push: "$$ROOT" }
        //         }
        //     },
        //     {
        //         $match: {
        //             count: { $gt: 1 }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             docs: 1
        //         }
        //     }
        // ]);
        //
        // await result.forEach(doc => {
        //     console.log(JSON.stringify(doc, null, 2));
        // });        // const now = new Date();
        //
        // // Calculate the time value for one week ago
        // const oneWeekAgoTime = now - (7 * 24 * 60 * 60 * 1000);
        //
        // // Create a new date object for one week ago
        // const oneWeekAgoDate = new Date(oneWeekAgoTime);
        //
        // // const cursor = await tipCol.find({
        // //     timestamp: {
        // //         $gte: oneWeekAgoDate,
        // //         $lte: now,
        // //     }
        // // }, {});
        // // const tips = await cursor.toArray();
        // //
        // // console.log('Number of tips:', tips.length);
        // //
        // // const fidToNumberOfTips = {};
        // // const fidToTipAmount = {};
        // // const activeBotConfigs = new Set();
        // //
        // // let maxTipper = null;
        // // let maxTip = 0;
        // // let maxNumberOfTipsTipper = null;
        // // let maxNumberOfTips = 0;
        // //
        // // tips.forEach((tip) => {
        // //     fidToNumberOfTips[tip.fromFid] = (fidToNumberOfTips[tip.fromFid] || 0) + 1;
        // //     fidToTipAmount[tip.fromFid] = (fidToTipAmount[tip.fromFid] || 0) + tip.tipAmount;
        // //
        // //     if (maxTip < fidToTipAmount[tip.fromFid]) {
        // //         maxTip = fidToTipAmount[tip.fromFid];
        // //         maxTipper = tip.fromFid;
        // //     }
        // //     if (maxNumberOfTips < fidToNumberOfTips[tip.fromFid]) {
        // //         maxNumberOfTips = fidToNumberOfTips[tip.fromFid];
        // //         maxNumberOfTipsTipper = tip.fromFid;
        // //     }
        // //     activeBotConfigs.add(tip.botConfigId);
        // // });
        // //
        // //
        // // // console.log(botConfigs);
        // //
        // // console.log('Most Frequent Tipper:', maxNumberOfTipsTipper, maxNumberOfTips);
        // // console.log('Highest Tipper:', maxTipper, maxTip);
        // //
        // // console.log('Number of active bots', activeBotConfigs.size);
        // // Array.from(activeBotConfigs).forEach((b) => {
        // //     console.log(botConfigMap[b].channelUrl, botConfigMap[b].botName, botConfigMap[b].triggerWord, b);
        // // });
        //
        // const botsWeAreInterestedIn = ['d46138fa-6a29-49ef-913d-7bf34b92ffdd'];
        // // Log the result
        //
        // const botConfigCol = conn.db('tipster').collection('botConfigs');
        // const userCol = conn.db('tipster').collection('users');
        //
        // const botConfigs = await botConfigCol.find({
        //     id: { $in: botsWeAreInterestedIn }
        // }).toArray();
        //
        // const botConfigMap = _.keyBy(botConfigs, 'id');
        //
        // const cursor = await tipCol.find({
        //     botConfigId: { $in: botsWeAreInterestedIn },
        //     timestamp: {
        //         $gte: oneWeekAgoDate,
        //         $lte: now,
        //     }
        // }, {});
        // const tips = await cursor.toArray();
        //
        // for (let i = 0; i < botsWeAreInterestedIn.length; i++) {
        //     const id = botsWeAreInterestedIn[i];
        //     console.log(botConfigMap[id].botName, 'stats:');
        //     const tipsForBot = tips.filter((t) => t.botConfigId === id);
        //     console.log('Number of tips', tipsForBot.length);
        //
        //     const fidToNumberOfTips = {};
        //     const fidToTipAmount = {};
        //
        //     let maxTipper = null;
        //     let maxTip = 0;
        //     let maxNumberOfTipsTipper = null;
        //     let maxNumberOfTips = 0;
        //
        //     tipsForBot.forEach((tip) => {
        //         fidToNumberOfTips[tip.fromFid] = (fidToNumberOfTips[tip.fromFid] || 0) + 1;
        //         fidToTipAmount[tip.fromFid] = (fidToTipAmount[tip.fromFid] || 0) + tip.tipAmount;
        //
        //         if (maxTip < fidToTipAmount[tip.fromFid]) {
        //             maxTip = fidToTipAmount[tip.fromFid];
        //             maxTipper = tip.fromFid;
        //         }
        //         if (maxNumberOfTips < fidToNumberOfTips[tip.fromFid]) {
        //             maxNumberOfTips = fidToNumberOfTips[tip.fromFid];
        //             maxNumberOfTipsTipper = tip.fromFid;
        //         }
        //     });
        //
        //     // console.log(user1, user2);
        //
        //
        //     const newMap = {}
        //     await Promise.all(_.keys(fidToTipAmount).map(async (fid) => {
        //         const user = await userCol.findOne({id: Number(fid), botConfigId: id});
        //         newMap[fid] = {
        //             name: user.username,
        //             numberOfTips: fidToNumberOfTips[fid],
        //             tipAmount: fidToTipAmount[fid],
        //         }
        //     }));
        //     console.log(newMap);
        // }
    } finally {
        await client.close();
    }
}

run().catch(console.error);