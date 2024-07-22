import React, { useState } from 'react';
import type { Ring } from "@farcaster/rings-next/types";
import { StoneTagNames, StoneTypes } from "@farcaster/rings-next/types.d";
import Select, { Item as SelectItem } from '@farcaster/rings-next/components/select/Select';
import Title from "@farcaster/rings-next/components/title/Title";
import { useRouter } from "next/navigation";
import { fidItems } from '@farcaster/rings-next/constants';
import {
    Button,
    ListItem,
    XStack,
    Spinner,
} from 'tamagui';
import { ChevronRight } from "@tamagui/lucide-icons";
import { useForm, Controller } from 'react-hook-form';
import { useStoneActions } from '@farcaster/rings-next/hooks/useStoneActions';
import { getObjectRefForMessage } from '@farcaster/rings-next/state/utils';
import { useFid } from '@farcaster/rings-next/provider/FidProvider';

interface RingCardProps {
  ring: Ring;
  id: number;
  editable?: boolean;
}

type Inputs = {
    stone1: string;
    stone2: string;
    stone3: string;
    wearerFid: number;
}

const stones: SelectItem[] = Object.values(StoneTypes).map((stone) => ({ id: stone, name: stone, avatar: "" } as SelectItem));

const RingCard: React.FC<RingCardProps> = ({ ring, id, editable = true, ...otherProps }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
    } = useForm({
        defaultValues: {
            stone1: ring.stone1?.data?.tagBody?.content,
            stone2: ring.stone2?.data?.tagBody?.content,
            stone3: ring.stone3?.data?.tagBody?.content,
            wearerFid: ring.wearer?.fid || 0
        },
    });
    const { updateStone } = useStoneActions();

    const [loading, setLoading] = useState(false);
    const { fid } = useFid();

    const onError = (error: any) => {
        console.error(error);
        setLoading(false);
    }
    const onSubmit = async (data: Inputs) => {
        setLoading(true);

        const { stone1: stone1Changed, stone2: stone2Changed, stone3: stone3Changed, wearerFid: wearerFidChanged } = dirtyFields;
    
        try {
            if (stone1Changed) {
                // Update Stone1 Tag
                console.log(data.stone1);
                
                await updateStone(fid, {
                  name: StoneTagNames.stone1,
                  target: getObjectRefForMessage(ring.ring),
                  content: data.stone1
                });
            }
            
            if (stone2Changed) {
                // Update Stone2 Tag
                console.log(data.stone2);
                
                await updateStone(fid, {
                  name: StoneTagNames.stone2,
                  target: getObjectRefForMessage(ring.ring),
                  content: data.stone2
                });
            } 
            
            if (stone3Changed) {
                // Update Stone3 Tag
                console.log(data.stone3);

                await updateStone(fid, {
                  name: StoneTagNames.stone3,
                  target: getObjectRefForMessage(ring.ring),
                  content: data.stone3
                });
            }
            
            if (wearerFidChanged) {
                // Update Wearer Relationship
                
                // TODO: hook up updating of the wearer
                
                console.log(data.wearerFid);
            }
        } finally {
          setLoading(false);
        }
      };
    // const [stone1, setStone1] = useState(ring.stones?.[0]?.attribute);

    // const isChanged = stone1 !== ring.stones?.[0]?.attribute;

    return (
        <XStack display="flex" gap={8}>
        <Title>
            <Title.Avatar size="$3" source={`https://i.pravatar.cc/150?img=1`} />
            <Title.Group>
            <Title.Heading size="$2" width={150}>{ring?.ring?.data?.objectAddBody?.displayName || `Ring ${id}`}</Title.Heading>
            </Title.Group>
        </Title>

        <Controller
          control={control}
          name="stone1"
          render={({ field: { onChange, value } }) => {
            return (
            <Select value={value || ""} items={stones} onChange={(item) => { onChange(item!.id)}} disabled={!editable} />
          )}}
        />

        <Controller
          control={control}
          name="stone2"
          render={({ field: { onChange, value } }) => {
            return (
            <Select value={value || ""} items={stones} onChange={(item) => { onChange(item!.id)}} disabled={!editable} />
          )}}
        />

        <Controller
          control={control}
          name="stone3"
          render={({ field: { onChange, value } }) => {
            return (
            <Select value={value || ""} items={stones} onChange={(item) => { onChange(item!.id)}} disabled={!editable} />
          )}}
        />

        {/* TODO: Use a input instead of select  */}
        <Controller
          control={control}
          name="wearerFid"
          render={({ field: { onChange, value } }) => {
            return (
            <Select value={value} items={fidItems} onChange={(item) => { onChange(item!.id)}} disabled={!editable} />
          )}}
        />


        {isDirty &&
            <Button
                disabled={loading}
                onPress={handleSubmit(onSubmit, onError)}
                cursor={loading ? 'progress' : 'pointer'}
                icon={loading ?
                <Spinner
                    size="small"
                    color="$color"
                    key="loading-spinner"
                    opacity={1}
                    scale={0.5}
                    animation="quick"
                    enterStyle={{
                    opacity: 0,
                    scale: 0.5,
                    }}
                    exitStyle={{
                    opacity: 0,
                    scale: 0.5,
                    }}
                /> : null
                }
            >
                Submit Changes
            </Button>}
        </XStack>
    );
}

export default RingCard;