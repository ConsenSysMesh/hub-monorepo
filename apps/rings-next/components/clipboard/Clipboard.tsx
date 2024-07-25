import { View } from "tamagui";
import { useToastController } from "@tamagui/toast";
import { BInput } from "@farcaster/rings-next/components/bento/BInput";
import { Copy } from "@tamagui/lucide-icons";
import React from "react";
import NativeClipboard from '@react-native-clipboard/clipboard';

export const Clipboard = ({ value, label }) => {
  const toast = useToastController();

  const copyToClipboard = () => {
    NativeClipboard.setString(value);
    toast.show('Successfully copied!');
  };

  return (
    <View flexDirection="column" justifyContent="center" alignItems="center" height={100}>
      <BInput size="$3" minWidth="100%">
        {label && <BInput.Label>{label}</BInput.Label>}

        <BInput.Box>
          <BInput.Section>
            <BInput.Area
              focusStyle={{
                outlineOffset: 1,
              }}
              placeholder={value}
            />
          </BInput.Section>
          <BInput.Section>
            <BInput.Button onPress={copyToClipboard}>
              <BInput.Icon>
                <Copy />
              </BInput.Icon>
            </BInput.Button>
          </BInput.Section>
        </BInput.Box>
      </BInput>
    </View>
  );
}

export default Clipboard;