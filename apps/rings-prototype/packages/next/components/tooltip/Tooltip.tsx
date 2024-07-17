import React from 'react';
import type { TooltipProps as TTooltipProps } from "tamagui";
import { Tooltip as TTooltip } from "tamagui";

interface TooltipProps extends TTooltipProps {
  Icon?: any;
  children: React.ReactNode,
  content: React.ReactNode,
}

const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    Icon,
    children,
    content = null,
    ...otherProps
  } = props;

  return (
    <TTooltip {...otherProps}>
      <TTooltip.Trigger>
        {children}
      </TTooltip.Trigger>
      <TTooltip.Content
        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <TTooltip.Arrow />
        {content}
      </TTooltip.Content>
    </TTooltip>
  )
}

export default Tooltip;
