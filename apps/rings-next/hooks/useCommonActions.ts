import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { fetchUserRings } from '@farcaster/rings-next/state/common-actions';

export const useCommonActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
        fetchUserRings: (fid: number) => dispatch(fetchUserRings(fid)),
    }),
    [dispatch]
  );
};
