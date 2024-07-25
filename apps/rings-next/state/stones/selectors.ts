import _ from 'lodash';
import { createSelector } from 'reselect'
import { Message, ObjectRef } from '@farcaster/hub-web';
import { stonesAdapter } from "@farcaster/rings-next/state/stones/reducer";
import { getObjectRefStoreId } from "@farcaster/rings-next/state/utils";
import { RootState } from "@farcaster/rings-next/types";

export const { selectAll: selectStones, selectById: selectStonesById } =
    stonesAdapter.getSelectors((state: RootState) => state.stones);

export const selectStonesByRingId = createSelector(
    [selectStones],
    stones => {
        // const stones = Object.values(stonesById);
        const stonesByRingId = _.groupBy(stones,
            (rel: Message) => getObjectRefStoreId(rel.data?.tagBody?.target as ObjectRef),
        )
        return stonesByRingId;
    },
);