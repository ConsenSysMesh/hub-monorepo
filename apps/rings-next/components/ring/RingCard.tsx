import React, { useState } from 'react';
import type { Ring } from "@farcaster/rings-next/types";
import Select, { Item as SelectItem } from '@farcaster/rings-next/components/select/Select';
import Title from "@farcaster/rings-next/components/title/Title";
import { useRouter } from "next/navigation";
import {fids} from '@farcaster/rings-next/constants';
import {
    Button,
  ListItem, XStack
} from 'tamagui';
import { ChevronRight } from "@tamagui/lucide-icons";
import { useForm, Controller } from 'react-hook-form';

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

const stones: SelectItem[] = [{ id: "Honest", name: "Honest" }, { id: "Hardworking", name: "Hardworking"}, { id: "Smart", name: "Smart"}];

const RingCard: React.FC<RingCardProps> = ({ ring, id, editable = true, ...otherProps }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            stone1: ring.stone?.data?.tagBody?.name,
            stone2: '', //ring.stone?.data?.tagBody?.name,
            stone3: '', //ring.stone?.data?.tagBody?.name,
            wearerFid: ring.wearer?.fid || 0
        },
    });

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
            <Select value={value} items={fids} onChange={(item) => { onChange(item!.id)}} disabled={!editable} />
          )}}
        />


        {isDirty && <Button>Submit Changes</Button>}
        </XStack>
    );
}

export default RingCard;