import { ringsAdapter, selectors } from "@farcaster/rings-next/state/rings/reducer";
import { RootState } from "@farcaster/rings-next/types";

export const { selectById: selectRingsById, selectEntities: selectRingEntities } =
    ringsAdapter.getSelectors((state: RootState) => state.rings);

export const selectRingsIsLoading = (state: RootState) => state.rings.isLoading;