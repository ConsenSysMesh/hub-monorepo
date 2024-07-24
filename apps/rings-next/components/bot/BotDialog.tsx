import { X, Plus } from '@tamagui/lucide-icons';

import {
  Adapt,
  Button,
  Dialog,
  Sheet,
  Unspaced,
  View,
  ScrollView,
  Paragraph,
  H4,
  Text,
  YStack,
  useMedia,
} from 'tamagui';

import BotForm from "@farcaster/rings-next/components/bot/BotForm";
import Clipboard from "@farcaster/rings-next/components/clipboard/Clipboard";
import React, { useState } from "react";
import { Bot } from "@farcaster/rings-next/types";

const CONTENT_PADDING = '$5';

const BotDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [bot, setBot] = useState<Bot | null>(null);
  const { sm } = useMedia();

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button icon={Plus} variant="outlined">Create Bot</Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet snapPoints={[91]} animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
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

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          maxHeight={!sm ? "90vh" : "100%"}
          maxWidth={!sm ? "600px" : "100%"}
          width="100%"
          padding={0}
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap={0}
        >

          <View padding={CONTENT_PADDING}>
            <Dialog.Title>{bot ? '🥳 Bot Created' : 'Create Bot'}</Dialog.Title>
          </View>

          <ScrollView>
            <View
              paddingLeft={CONTENT_PADDING}
              paddingRight={CONTENT_PADDING}
              paddingBottom={CONTENT_PADDING}
            >
              {bot ?
                <>
                  <View gap="$4">
                    <H4>Setup your frame.</H4>

                    <YStack>
                      <Paragraph color="$color11">
                        To help frens join in the game:
                      </Paragraph>

                      <Text>1. Copy this frame link,</Text>
                      <Text>2. Share it in your channel, and</Text>
                      <Text>3. Pin it for all to see.</Text>
                    </YStack>

                    <Clipboard label="Frame Link" value={`${process.env.NEXT_PUBLIC_URL}/frame/${bot?.id}`} />
                  </View>
                </> :
                <BotForm
                  onCancel={() => setOpen(false)}
                  onSubmit={setBot}
                  isNewBot
                />
              }
            </View>
          </ScrollView>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default BotDialog;