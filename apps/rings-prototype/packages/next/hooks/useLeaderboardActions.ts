import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { fetchLeaderboard } from '@tipster/next/state/leaderboards/actions';
import {fetchUserStats} from "@tipster/next/state/userStats/actions";

export const useLeaderboardActions = () => {
    const dispatch = useDispatch();

    return useMemo(
        () => ({
            fetchLeaderboard: (id) => dispatch(fetchLeaderboard(id)),
            fetchUserStats: (id) => dispatch(fetchUserStats(id))
        }),
        [dispatch]
    );
};
