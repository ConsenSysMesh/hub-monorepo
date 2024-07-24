'use client';
import React, { useEffect, useState } from "react";
import type { TabsContentProps } from 'tamagui';
import { YStack, Tabs, H5, Separator, SizableText } from 'tamagui';
import Title from "@farcaster/rings-next/components/title/Title";
// import Navbar from "@farcaster/rings-next/components/navbar/Navbar";
import { useCommonActions } from '@farcaster/rings-next/hooks/useCommonActions';
import { selectRings } from '@farcaster/rings-next/state/common-selectors';
import { selectRingsIsLoading } from '@farcaster/rings-next/state/rings/selectors';
import { useSelector } from 'react-redux';
import Container from "@farcaster/rings-next/components/container/Container";
// import data from "@farcaster/rings-next/data";
import apiClient from "@farcaster/rings-next/api-client";
import {
  ObjectRefTypes,
} from "@farcaster/hub-web";
import RingCard from "@farcaster/rings-next/components/ring/RingCard";
import { Ring } from "@farcaster/rings-next/types";
import Select, { Item as SelectItem } from '@farcaster/rings-next/components/select/Select';
import { fidItems as fids } from '@farcaster/rings-next/constants';

const HUB_URL = "http://127.0.0.1:2281"; // URL + Port of the Hub
const FID = 773349;



const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      // alignItems="center"
      // justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}

const RingTableHeading = () => (
  <Title>
      <Title.Heading width={200} size="$6" marginBottom="$2">Ring</Title.Heading>
      <Title.Heading width={150} size="$6" marginBottom="$2">Stone 1</Title.Heading>
      <Title.Heading width={150} size="$6" marginBottom="$2">Stone 2</Title.Heading>
      <Title.Heading width={150} size="$6" marginBottom="$2">Stone 3</Title.Heading>
      <Title.Heading width={150} size="$6" marginBottom="$2">Wearer</Title.Heading>
      {/* <Title.Heading size="$7">Your Community TipBots</Title.Heading> */}
  </Title>
);

export default function HomePage() {
  const { fetchUserRings } = useCommonActions();
  const rings = useSelector(selectRings) as Array<Ring>;
  const isLoading = useSelector(selectRingsIsLoading);

      // .then(r => console.log(r));
  // const bots = useSelector(selectBots);
  // const isLoading = useSelector(selectBotsIsLoading);

  const [fid, setFid] = useState(Number(process.env.NEXT_PUBLIC_FID_2));


  useEffect(() => {
    fetchUserRings(fid);
  }, [fid]);

  const ownedRings = rings.filter((r: Ring) => r.owner.fid === fid);
  const wornRings = rings.filter((r: Ring) => r.wearer?.fid === fid);

  console.log(rings);

  return (
      <Container>
        <H5>You are: </H5>
        <Select value={fid} items={fids} onChange={(item) => { setFid(item!.id)}} />
        {/* { isLoading && !IS_USING_MOCK_DATA ?
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
            <BotList bots={data.bots} marginBottom="$4" /> :
            <BotList bots={bots} marginBottom="$4" />
        } */}

      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        height={800}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
      >
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText fontFamily="$body">Table</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText fontFamily="$body">Node</SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
        <TabsContent value="tab1">
          <Title marginBottom="$4">
            <Title.Group>
              <Title.Heading size="$9">Rings You Own</Title.Heading>
              {/* <Title.Heading size="$7">Your Community TipBots</Title.Heading> */}
            </Title.Group>
          </Title>
          <YStack
            gap="$4"
            marginBottom="$6"
          >
            {/* {(!rings || rings.length === 0) &&
              <Card padding="$3">
                <Paragraph fontWeight="bold">Welcome! You don&apos;t have any tipbots yet.</Paragraph>
                <Paragraph color="$color11">No worries you can go from noob to first bot in just few minutes. LFG! 🚀</Paragraph>
              </Card>
            } */}
            <RingTableHeading/>
            {ownedRings.map((ring: Ring, i: number) => <RingCard key={`${fid}-${i}`} id={i} ring={ring} />)}
          </YStack>
          <Title marginBottom="$4">
            <Title.Group>
              <Title.Heading size="$9">Rings You Wear</Title.Heading>
              {/* <Title.Heading size="$7">Your Community TipBots</Title.Heading> */}
            </Title.Group>
          </Title>
          <YStack
            gap="$4"
          >
            {/* {(!rings || rings.length === 0) &&
              <Card padding="$3">
                <Paragraph fontWeight="bold">Welcome! You don&apos;t have any tipbots yet.</Paragraph>
                <Paragraph color="$color11">No worries you can go from noob to first bot in just few minutes. LFG! 🚀</Paragraph>
              </Card>
            } */}
            <RingTableHeading/>
            {wornRings.map((ring: Ring, i: number) => <RingCard key={`${fid}-${i}`} id={i} ring={ring} editable={false} />)}
          </YStack>
        </TabsContent>

        <TabsContent value="tab2">
          <H5>Node Explorer</H5>
        </TabsContent>
      </Tabs>

          
        {/* <BotDialog /> */}
      </Container>
  )
}
