import express from 'express';
import TipData from "../data/tips.mjs";
import { stringify } from 'csv-stringify';
import _ from 'lodash';
import UserData from "../data/users.mjs";

const router = express.Router();

router.get('/download-csv', async (req, res) => {
    const {botConfigId, start, end} = req.query;
    const tips = await TipData.queryTipsByDateRange(botConfigId, new Date(Number(start)), new Date(Number(end)));

    const amountMap = {};

    tips.forEach((tip) => {
        amountMap[tip.toFid] = (amountMap[tip.toFid] || 0) + tip.tipAmount;
    })

    const fidsToFetch = Object.keys(amountMap).map(Number);

    const users = await UserData.getSpecificUsersForBot(botConfigId, fidsToFetch);
    const csv = users.map(({ id, displayName, username, verifiedEthAddresses, addressesGrantingEligibility }) => ({
        displayName,
        fname: username,
        wallet: addressesGrantingEligibility && addressesGrantingEligibility[0] ? addressesGrantingEligibility[0] :
            verifiedEthAddresses && verifiedEthAddresses[0] ? verifiedEthAddresses[0] : 'N/A',
        totalTipsReceived: amountMap[id],
    }));

    // Convert data to CSV
    stringify(csv, {
        header: true,
        columns: { displayName: 'displayName', fname: 'fname', wallet: 'wallet', totalTipsReceived: 'totalTipsReceived' }
    }, (err, output) => {
        if (err) {
            res.status(500).send('Error generating CSV');
            return;
        }

        // Set the headers for CSV file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

        // Send the CSV file
        res.send(output);
    });
});

export default router;
