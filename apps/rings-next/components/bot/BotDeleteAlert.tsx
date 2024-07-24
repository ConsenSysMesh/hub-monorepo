import React from 'react';
import { AlertDialog, Button, XStack, YStack, AlertDialogProps } from 'tamagui';

interface AlertProps extends AlertDialogProps {
  onCancel: () => void;
  onDelete: () => void;
}

const BotDeleteAlert: React.FC<AlertProps> = (props) => {
  const {
    onCancel = () => {},
    onDelete = () => {},
    ...otherProps
  } = props;

  return (
    <AlertDialog native {...otherProps}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          margin="$4"
          theme="red"
        >
          <YStack gap="$3">
            <AlertDialog.Title color="$red11">Delete Bot</AlertDialog.Title>

            <AlertDialog.Description>
              Are you sure you want to delete this bot?
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button chromeless onPress={onCancel}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="red" onPress={onDelete}>Delete</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}

export default BotDeleteAlert;
