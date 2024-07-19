'use client';
import React, { useEffect } from "react";
import { Spinner, XStack, YStack } from 'tamagui';
import Title from "@farcaster/rings-next/components/title/Title";
import BotList from "@farcaster/rings-next/components/bot/BotList";
import Navbar from "@farcaster/rings-next/components/navbar/Navbar";
import { useCommonActions } from '@farcaster/rings-next/hooks/useCommonActions';
import { selectRings } from '@farcaster/rings-next/state/common-selectors';
import { selectRingsIsLoading } from '@farcaster/rings-next/state/rings/selectors';
import { useSelector } from 'react-redux';
import BotDialog from "@farcaster/rings-next/components/bot/BotDialog";
import Container from "@farcaster/rings-next/components/container/Container";
import data from "@farcaster/rings-next/data";
import {IS_USING_MOCK_DATA} from "@farcaster/rings-next/constants";
import { Ring } from '@farcaster/rings-next/types';

const FID = 773349;

export default function HomePage() {
  const { fetchUserRings } = useCommonActions();
  const rings = useSelector(selectRings) as Array<Ring>;
  const isLoading = useSelector(selectRingsIsLoading);

  useEffect(() => {
    fetchUserRings(FID);
      // .then(r => console.log(r));

    // TODO: for some reason this fetch is being executed twice on initial page load. Check to see why.
    // fetchBots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <XStack flexDirection="column">
      <Navbar />

      <Container>
        <Title marginBottom="$4">
          <Title.Group>
            <Title.Heading size="$9" marginBottom="$5">Home</Title.Heading>
            <Title.Heading size="$7">Your Community TipBots</Title.Heading>
          </Title.Group>
        </Title>

        { isLoading && !IS_USING_MOCK_DATA ?
          <YStack flex={1} marginBottom="$4" justifyContent="center" alignItems="center">
            <Spinner size="large" color="$violet8" />
          </YStack> :
          IS_USING_MOCK_DATA ?
            <div>Mock data</div> :
            <YStack
              gap="$4"
              marginBottom="$4"
            >
              <table>
                <thead>
                  <tr>
                    <th>Ring</th>
                    <th>Stone</th>
                    <th>Owner</th>
                    <th>Wearer</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    rings.map((r: Ring) =>
                      <tr>
                        <td>{`${r.ring.data?.objectAddBody?.displayName} ${r.ring.hash}`}</td>
                        <td>{`${r.stone?.data?.tagBody?.name}`}</td>
                        <td>{`${r.owner.fid}`}</td>
                        <td>{`${r.wearer?.fid}`}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </YStack>
        }
        {/* <BotDialog /> */}
      </Container>
    </XStack>
  )
}
