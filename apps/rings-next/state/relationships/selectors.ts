import _ from 'lodash';
import { createSelector } from 'reselect'
import { Message, ObjectRef } from '@farcaster/hub-web';
import { relationshipsAdapter } from "@farcaster/rings-next/state/relationships/reducer";
import { getObjectRefStoreId } from "@farcaster/rings-next/state/utils";
import { RootState } from "@farcaster/rings-next/types";

export const { selectAll: selectRelationships, selectById: selectRelationshipsById } =
    relationshipsAdapter.getSelectors((state: RootState) => state.relationships);

export const selectRelationshipsBySource = createSelector(
    [selectRelationships],
    rels => {
        // const rels = Object.values(relationshipsById);
        const relsBySource = _.groupBy(rels,
            (rel: Message) => getObjectRefStoreId(rel.data?.relationshipAddBody?.source as ObjectRef),
        )
        return relsBySource;
    },
);

export const selectRelationshipsByTarget = createSelector(
    [selectRelationships],
    rels => {
        // const rels = Object.values(relationshipsById);
        const relsByTarget = _.groupBy(rels,
            (rel: Message) => getObjectRefStoreId(rel.data?.relationshipAddBody?.target as ObjectRef),
        )
        return relsByTarget;
    },
);
