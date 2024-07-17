import React, { useState } from 'react';
import type { SizeTokens } from 'tamagui';
import {
  View,
  getTokenValue
} from 'tamagui';

interface AvatarGroupProps {
  size: SizeTokens;
  items: React.ReactNode[];
  [key: string]: any; // Allows any other props to be passed
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ size, items, ...otherProps }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <View
      flexDirection="row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...otherProps}
    >
      {items.map((item, index) => (
        <View
          key={index}
          zIndex={index}
          marginLeft={index !== 0 ? -(getTokenValue(size as any) ?? 20) * 1.5 : undefined}
          animation="bouncy"
          x={0}
          {...(hovered && {
            x: index * 8,
          })}
        >
          {item}
        </View>
      ))}
    </View>
  )
};

export default AvatarGroup;
