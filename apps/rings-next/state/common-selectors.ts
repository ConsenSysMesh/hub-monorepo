import _ from 'lodash';
import { createSelector } from 'reselect'
import { Message, ObjectRef } from '@farcaster/hub-web';
import { RelationshipTypes } from '@farcaster/rings-next/constants'
import { selectRingsById, selectRingEntities } from "@farcaster/rings-next/state/rings/selectors";
import { selectUsersById, selectUserEntities } from "@farcaster/rings-next/state/users/selectors";
import { selectStonesByRingId } from "@farcaster/rings-next/state/stones/selectors";
import { selectRelationshipsBySource } from "@farcaster/rings-next/state/relationships/selectors";
import { getObjectRefStoreId } from "@farcaster/rings-next/state/utils";
import { Ring } from '@farcaster/rings-next/types';

export const selectRings = createSelector(
    [selectRingEntities, selectUserEntities, selectStonesByRingId, selectRelationshipsBySource],
    (ringsById, usersById, stonesByRingId, relationshipsBySource) => {
        const rings: Array<Ring> = [];
        for (let [ringId, ring] of _.entries(ringsById)) {
            const rels = relationshipsBySource[ringId] as Array<Message>;
            const ownerRel = rels.find(r => r.data?.relationshipAddBody?.type === RelationshipTypes.Owner);
            const wearerRel = rels.find(r => r.data?.relationshipAddBody?.type === RelationshipTypes.Wearer);
            const owner = usersById[ownerRel?.data?.relationshipAddBody?.target?.fid];
            const wearer = usersById[wearerRel?.data?.relationshipAddBody?.target?.fid];
            const stones = stonesByRingId[ringId] || [];
            rings.push({
                ring,
                owner,
                wearer,
                stone: stones[0], // assuming only one store for now
            })
        }
        return rings;
    },
);