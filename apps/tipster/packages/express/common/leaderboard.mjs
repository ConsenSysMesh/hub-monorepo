import UserData from "../data/users.mjs";
import {getUserOrFetchAndCache} from "../utils/userUtils.mjs";

const LeaderboardModule = {
    getLeaderBoardStats: async (id, fid) => {
        const { balance, allowance, username, displayName, pfpUrl, isEligible} = await getUserOrFetchAndCache(fid, id);
        const leaderBoard = await UserData.getLeaderBoard(id);

        const rank = leaderBoard.findIndex((u) => u.id === fid) + 1;

        return ({
            botConfigId: id,
            userStats: {
                balance, allowance, username, displayName, pfpUrl, isEligible, rank
            },
            leaderBoard,
        });
    },
    getLeaderBoard: async (id) => {
        return await UserData.getLeaderBoard(id);
    }
}

export default LeaderboardModule;