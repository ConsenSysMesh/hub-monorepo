import React, { useState } from 'react';
import { BInput } from "@tipster/next/components/bento/BInput";
import BotFormError from "@tipster/next/components/bot/BotFormError";
import Select, { Item as SelectItem }  from "@tipster/next/components/select/Select";
import { View } from "tamagui";

interface Item {
  hatId: string;
  chainId: number;
}

interface HatsError {
  hatId: object;
  chainId: object;
}

interface HatsSelectorProps {
  value: Item;
  onChange?: (item: Item) => void;
  errors?: HatsError,
}

const chains = [
  { name: 'Ethereum', id: 1, avatar: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg' },
  { name: 'Optimism', id: 10, avatar: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg' },
  { name: 'Arbitrum', id: 42161, avatar: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg' },
  { name: 'Polygon', id: 137, avatar: 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg' },
  { name: 'Gnosis', id: 100, avatar: 'https://icons.llamao.fi/icons/chains/rsz_xdai.jpg' },
  { name: 'Base', id: 8453, avatar: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg' },
  { name: 'Celo', id: 42220, avatar: 'https://icons.llamao.fi/icons/chains/rsz_celo.jpg' },
  { name: 'Sepolia', id: 11155111, avatar: 'https://chainlist.org/unknown-logo.png' },
];

const HatsSelector: React.FC<HatsSelectorProps> = (props) => {
  const {
    onChange = () => {},
    value,
    errors,
  } = props;

  const [item, setItem] = useState<Item>(value || {
    hatId: '',
    chainId: chains[0].id,
  });

  const onHatIdChange = (hatId: Item['hatId']) => {
    const newData = {
      hatId,
      chainId: item?.chainId,
    };

    setItem(newData);
    onChange(newData);
  };

  const onChainIdChange = (chain: SelectItem) => {
    const newData: Item = {
      hatId: item.hatId,
      chainId: typeof chain.id === 'number' ? chain.id : Number(chain.id),
    };

    setItem(newData);
    onChange(newData);
  };

  return (
    <View gap="$4">
      <BInput
        size="$4"
        {...(errors?.hatId && {
          theme: 'red',
        })}
      >
        <BInput.Label>Hat ID</BInput.Label>
        <BInput.Box>
          <BInput.Area placeholder="0x000000..." onChangeText={onHatIdChange} value={value?.hatId} />
        </BInput.Box>

        {errors?.hatId ?
          <BotFormError error={errors.hatId} /> :
          <BInput.Info>Paste hatID for the hat worn by those who can tip</BInput.Info>
        }
      </BInput>

      <BInput
        size="$4"
        {...(errors?.chainId && {
          theme: 'red',
        })}
      >
        <BInput.Label>Chain ID</BInput.Label>
        <Select value={value?.chainId} items={chains} onChange={onChainIdChange} />

        {errors?.chainId ?
          <BotFormError error={errors.chainId} /> :
          <BInput.Info>Select the chain your hats tree is deployed on</BInput.Info>
        }
      </BInput>
    </View>
  )
}

export default HatsSelector;