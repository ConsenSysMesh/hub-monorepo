import {Avatar, ListItem, ListItemSubtitle, ListItemText, YStack} from 'tamagui';
import { ImageURISource } from "react-native";
import React, {ReactNode} from "react";
import type { Item } from "@tipster/next/components/autocomplete/AutoComplete";
import type { ListItemProps } from 'tamagui';

const AutoCompleteItemAvatar = ({ source }: { source: ImageURISource }) => (
  <Avatar circular size="$4">
    <Avatar.Image source={source} />
    <Avatar.Fallback backgroundColor="red" />
  </Avatar>
);

interface AutoCompleteItemProps extends ListItemProps {
  item: Item,
  onChange?: (item: Item) => void,
}

const AutoCompleteItem: React.FC<AutoCompleteItemProps> = (props) => {
  const {
    item,
    onChange = () => {},
    ...otherProps
  } = props;

  const generateIcon = (icon: ReactNode | ImageURISource | string) => {
    if (typeof icon === 'string') {
      return <AutoCompleteItemAvatar source={icon} />
    }
    return icon;
  }

  return (
    <ListItem
      unstyled
      onPress={() => onChange(item)}
      hoverTheme
      icon={generateIcon(item?.icon)}
      key={item?.title?.toLowerCase() || item?.id}
      hoverStyle={{
        cursor: 'pointer',
      }}
      {...otherProps}
    >
      <YStack flex={1}>
        <ListItemText hoverStyle={{ cursor: 'pointer' }}>{item?.title}</ListItemText>
        <ListItemSubtitle hoverStyle={{ cursor: 'pointer' }}>{item?.subTitle}</ListItemSubtitle>
      </YStack>
    </ListItem>
  )
}

export default AutoCompleteItem;
