import { usersAdapter } from "@farcaster/rings-next/state/users/reducer";
import { RootState } from "@farcaster/rings-next/types";

export const { selectById: selectUsersById, selectEntities: selectUserEntities } =
    usersAdapter.getSelectors((state: RootState) => state.users);