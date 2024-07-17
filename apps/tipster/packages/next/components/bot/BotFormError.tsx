import { FieldError } from "react-hook-form";
import React from "react";
import { AnimatePresence, View } from "tamagui";
import { BInput } from "@tipster/next/components/bento/BInput";

interface BotFormErrorProps {
  error?: FieldError | string;
}

const BotFormError: React.FC<BotFormErrorProps> = ({ error }) => (
  <AnimatePresence>
    {error && (
      <View
        bottom="$-5"
        theme='red'
        left={0}
        position="absolute"
        flexDirection="row"
        animation="bouncy"
        scaleY={1}
        enterStyle={{
          opacity: 0,
          y: -10,
          scaleY: 0.5,
        }}
        exitStyle={{
          opacity: 0,
          y: -10,
          scaleY: 0.5,
        }}
      >
        <BInput.Info>{typeof error === 'string' ? error : error.message}</BInput.Info>
      </View>
    )}
  </AnimatePresence>
);

export default BotFormError;