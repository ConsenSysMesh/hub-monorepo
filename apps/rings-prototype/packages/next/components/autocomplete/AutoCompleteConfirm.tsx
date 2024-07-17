import React from 'react';
import { AlertDialog, Button, XStack, YStack, AlertDialogProps } from 'tamagui';
import config from "@tipster/next/tamagui.config";

export interface ConfirmProps {
  title?: string;
  subTitle?: string;
  buttonTitle?: string;
  cancelButtonTitle?: string;
}

interface AlertProps extends AlertDialogProps, ConfirmProps{
  onCancel?: () => void;
  onRemove?: () => void;
}

const confirmText = {
  title: 'Remove Item?',
  subTitle: 'Are you sure you want to remove this item?',
  buttonTitle: 'Remove',
  cancelButtonTitle: 'Cancel',
};

const AutoCompleteConfirm: React.FC<AlertProps> = (props) => {
  const {
    open = false,
    onCancel = () => {},
    onRemove = () => {},
    title,
    subTitle,
    buttonTitle,
    cancelButtonTitle,
    ...otherProps
  } = props;

  return (
    <AlertDialog native open={open}>
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
          maxWidth={config.media.xxs.maxWidth}
          {...otherProps}
        >
          <YStack gap="$3">
            <AlertDialog.Title color="$red11">{title || confirmText.title}</AlertDialog.Title>

            <AlertDialog.Description>{subTitle || confirmText.subTitle}</AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button chromeless onPress={onCancel}>{cancelButtonTitle || confirmText.cancelButtonTitle}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="red" onPress={onRemove}>{buttonTitle || confirmText.buttonTitle}</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}

export default AutoCompleteConfirm;
