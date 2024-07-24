import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { updateWearer } from '@farcaster/rings-next/state/relationships/actions';
import { Message, RelationshipAddBody} from '@farcaster/hub-web';

export const useRelationshipActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      updateWearer: (fid: number, newWearer: RelationshipAddBody, existingWearer: Message | undefined) =>
        dispatch(updateWearer({ fid, newWearer, existingWearer })),
    }),
    [dispatch]
  );
};
