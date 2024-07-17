import React from 'react';
import { useId, useState } from 'react';
import {Label, RadioGroup, View, styled, Paragraph} from 'tamagui';
import _ from 'lodash';

export const Card = styled(View, {
  variants: {
    unstyled: {
      false: {
        cursor: 'pointer',
        width: '100%',
        borderRadius: '$4',
        padding: '$3',
        backgroundColor: '$background',
        borderColor: '$borderColor',
        borderWidth: 1,
        focusStyle: {
          backgroundColor: '$backgroundFocus',
          borderColor: '$borderColorFocus',
        },
        hoverStyle: {
          backgroundColor: '$backgroundFocus',
          borderColor: '$borderColorFocus',
        },
      },
    },
    active: {
      true: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$borderColorFocus',
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

interface HorizontalRadioProps {
  items: string[];
  value: string;
  onChange: (item: string) => void;
  label?: string;
}

const HorizontalRadio: React.FC<HorizontalRadioProps> = (props) => {
  const {
    items = [],
    value: defaultValue = null,
    onChange = () => {},
    label = null,
  } = props;

  const uniqueId = useId()
  const [value, setValue] = useState(defaultValue)

  const onValueChange = (item: string) => {
    setValue(item);
    onChange(item);
  };

  return (
    <View
      flexDirection="column"
      width="100%"
      maxWidth={600}
    >
      <RadioGroup
        flexWrap="wrap"
        gap="$4"
        rowGap="$2"
        flexDirection="row"
        value={value}
      >
        {items.map((item) => (
          <Card
            key={item}
            flexDirection="row"
            flex={1}
            flexBasis={150}
            alignItems="center"
            gap="$3"
            padding={0}
            minWidth="100%"
            active={value === item}
            paddingHorizontal="$2.5"
            cursor="pointer"
            onPress={() => onValueChange(item)}
            $gtXs={{
              minWidth: 'auto',
            }}
          >
            <View onPress={(e) => e.stopPropagation()}>
              <RadioGroup.Item id={uniqueId + item} value={item} onPress={() => onValueChange(item)}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            </View>

            <Label cursor="pointer" htmlFor={uniqueId + item}>
              {_.startCase(_.camelCase(item))}
            </Label>
          </Card>
        ))}
      </RadioGroup>

      {label &&
        <Paragraph color="$color11">
          {label}
        </Paragraph>
      }
    </View>
  )
}

export default HorizontalRadio;
