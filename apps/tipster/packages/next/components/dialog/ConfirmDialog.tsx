import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";

interface ConfirmDialogProps {
  triggerComponent?: React.ReactElement;
  title: string,
  message: string,
  confirmButtonText?: string,
  cancelButtonText?: string
  onConfirm: Function,
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ triggerComponent, title, message, confirmButtonText = 'Confirm', cancelButtonText = 'Cancel', onConfirm }) => {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        {triggerComponent}
      </AlertDialog.Trigger>

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
        >
          <YStack space>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>{message}</AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>{cancelButtonText}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onClick={onConfirm}>{confirmButtonText}</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}

export default ConfirmDialog;