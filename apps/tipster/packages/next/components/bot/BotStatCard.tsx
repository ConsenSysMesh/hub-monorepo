import React from 'react';
import { Card, Paragraph } from "tamagui";
import { getTokens } from "@tamagui/core";

interface BotStatCardProps {
  title: string;
  subTitle: string;
}

const BotStatCard: React.FC<BotStatCardProps> = (props) => {
  const {
    title,
    subTitle,
  } = props;

  const { size } = getTokens();
  const outerContainerGap = size.$3.val;

  return (
    <Card
      padding="$3"
      flex={1}
      style={{ width: `calc(25% - ${outerContainerGap}px)` }}
      borderColor="$color5"
      borderWidth="1px"
      borderStyle="solid"
      minWidth="100px"
    >
      <Paragraph textAlign="center" color="$color11" fontSize="10px">{title}</Paragraph>
      <Paragraph textAlign="center" fontSize="$4" fontWeight="bold">{subTitle}</Paragraph>
   </Card>
  );
}

export default BotStatCard;