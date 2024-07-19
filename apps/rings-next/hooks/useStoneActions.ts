import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { updateStone } from '@farcaster/rings-next/state/stones/actions';
import { TagBody } from '@farcaster/hub-web';

export const useStoneActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      updateStone: (fid: number, changes: TagBody) => dispatch(updateStone({ fid, changes })),
    }),
    [dispatch]
  );
};
