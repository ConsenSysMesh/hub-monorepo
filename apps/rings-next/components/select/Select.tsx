import React, { useMemo } from 'react';
import { View, Avatar, FontSizeTokens, SelectProps as TSelectProps } from 'tamagui';
import { Select as TSelect, Sheet, Adapt, YStack, getFontSize } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';

export interface Item {
  name: string;
  id: number | string;
  avatar: string;
}

interface SelectProps extends TSelectProps {
  items: Item[];
  onChange: (item: Item | undefined) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
}

interface SelectAvatarProps {
  item: Item;
}

const SelectAvatar: React.FC<SelectAvatarProps> = ({ item }) => {
  return item?.avatar ? (
    <Avatar circular size="$1">
      <Avatar.Image
        accessibilityLabel="Cam"
        src={item.avatar}
      />
      <Avatar.Fallback backgroundColor="$blue10" />
    </Avatar>
  ) : null;
}

const Select: React.FC<SelectProps> = (props) => {
  const {
    items= [],
    value,
    onChange = () => {},
    placeholder = 'Select a Stone',
    disabled = false,
  } = props;

  const currentItem = useMemo(() => {
    return items.find(i => i.id === value)
  }, [value])

  const onValueChange = (val: Item['id']) => {
    const selectedItem = items.find(i => i.id === val);
    onChange(selectedItem);
  };

  return (
    <TSelect value={value} onValueChange={onValueChange} disablePreventBodyScroll {...props}>
      <TSelect.Trigger disabled={disabled} iconAfter={ChevronDown} width={150} paddingLeft="$3">
        <View
          flexDirection="row"
          alignItems="center"
          gap="$2"
        >
          <SelectAvatar item={currentItem} />
          <TSelect.Value placeholder={placeholder} />
        </View>
      </TSelect.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <TSelect.Content zIndex={200000}>
        <TSelect.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
        </TSelect.ScrollUpButton>

        <TSelect.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <TSelect.Group>
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <TSelect.Item
                      index={i}
                      key={item.id}
                      value={item.id}
                      hoverStyle={{
                        cursor: "pointer",
                        backgroundColor: "$color3"
                      }}
                    >
                      <View flexDirection="row" alignItems="center" gap="$2" width="100%">
                        <SelectAvatar item={item} />
                        <TSelect.ItemText>{item.name}</TSelect.ItemText>
                        <TSelect.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </TSelect.ItemIndicator>
                      </View>
                    </TSelect.Item>
                  )
                }),
              [items]
            )}
          </TSelect.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown
                size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
              />
            </YStack>
          )}
        </TSelect.Viewport>

        <TSelect.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </TSelect.ScrollDownButton>
      </TSelect.Content>
    </TSelect>
  )
};

export default Select;
