'use client';
import { Card, YStack, XStack, H4, View } from "tamagui";
import Title from "@farcaster/rings-next/components/title/Title";
import { useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { selectLeaderboardByConfigId } from "@farcaster/rings-next/state/leaderboards/selectors";
import { selectUserStatsByConfigId } from "@farcaster/rings-next/state/userStats/selectors";
import data from "@farcaster/rings-next/data";
import BotStatCard from "@farcaster/rings-next/components/bot/BotStatCard";
import BotPointCard from "@farcaster/rings-next/components/bot/BotPointCard";
import { IS_USING_MOCK_DATA } from "@farcaster/rings-next/constants";
import BotDownloadDialog from "@farcaster/rings-next/components/bot/BotDownloadDialog";

type Params = { id: string }

export default function BotPage() {
  const { id } = useParams<Params>();

  let leaderboard = useSelector((state) => selectLeaderboardByConfigId(state, id));
  let userStats = useSelector((state) => selectUserStatsByConfigId(state, id));

  if (IS_USING_MOCK_DATA) {
    leaderboard = data.leaderboard;
    userStats = data.userStats;
  }

  return (
    <YStack gap="$3">
      <H4>Your Stats</H4>

      <Card
        backgroundColor="transparent"
        padding="$3"
        borderWidth={1}
        borderColor="$color6"
        borderRadius="$3"
      >
        <YStack>
          <Title marginBottom="$3">
            <Title.Avatar source={userStats?.pfpUrl} />
            <Title.Group>
              <Title.Heading size="$6">{userStats?.displayName}</Title.Heading>
              <Title.Heading size="$2" color="$color11">{userStats?.username}</Title.Heading>
            </Title.Group>
          </Title>

          <XStack gap="$3" flexWrap="wrap">
            <BotStatCard title="Rank" subTitle={userStats?.balance ? `${userStats?.rank} / ${leaderboard?.users?.length}` : '-'} />
            <BotStatCard title="Received" subTitle={userStats?.balance} />
            <BotStatCard title="Can Give Tips" subTitle={userStats?.isEligible ? 'Yes' : 'No'} />
            <BotStatCard title="Remaining Allowance" subTitle={userStats?.isEligible ? userStats?.allowance : 'N/A'} />
          </XStack>
        </YStack>
      </Card>

      {leaderboard?.users?.length > 0 && (
        <>
          <View flexDirection="row" alignItems="center">
            <H4>Leaderboard</H4>
            <BotDownloadDialog botConfigId={id}/>
          </View>

          <YStack gap="$2">
            {leaderboard?.users?.map((user, index) =>
              <BotPointCard key={user.id} user={user} index={index} />
            )}
          </YStack>
        </>
      )}

    </YStack>
  );
}
