import { X, Download } from '@tamagui/lucide-icons';

import {
  Adapt,
  Button,
  Dialog,
  Sheet,
  Unspaced,
  View,
  ScrollView,
  useMedia, Text, Paragraph,
} from 'tamagui';

import React, { useState } from "react";
import RangePicker from "@tipster/next/components/bento/date/RangePicker";
import getClient from '@tipster/next/api-client';

const CONTENT_PADDING = '$5';

interface BotDownloadDialogProps {
  botConfigId: string;
}

const BotDownloadDialog: React.FC<BotDownloadDialogProps> = (props) => {
  const { botConfigId } = props;

  const [open, setOpen] = useState(false);
  const { sm } = useMedia();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [error, setError] = useState('');

  const validate = (val: Date[]) => {
    if (val.length === 0) {
      setError('Date range is required');
    } else {
      setError('');
    }
  }

  const onDownloadPress = async () => {
    validate(selectedDates);
    try {
      const apiClient = await getClient();
      const response = await apiClient.downloadCSV(botConfigId, selectedDates[0].getTime(), selectedDates[1].getTime());
      // Create a Blob from the response data
      const blob = new Blob([response.data], {type: 'text/csv'});

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and trigger a download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'data.csv'; // Specify the file name
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onDateChange = (val: Date[]) => {
    setSelectedDates(val);
    validate(val);
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button ml="auto" icon={Download} size="$3">CSV</Button>
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
            <Dialog.Title size="$7">CSV export of tipping data</Dialog.Title>
          </View>

          <ScrollView>
            <View
              paddingLeft={CONTENT_PADDING}
              paddingRight={CONTENT_PADDING}
              paddingBottom={CONTENT_PADDING}
              gap="$4"
            >
              <View>
                <Text>Date Range</Text>
                <RangePicker
                  error={error}
                  label="Select date range to export"
                  value={selectedDates}
                  onChange={onDateChange}
                />
              </View>

              <View>
                <Text>Export Format</Text>
                <Paragraph color="$color11">
                  &lt;displayName&gt;, &lt;fname&gt;, &lt;wallet&gt;, &lt;totalTipsReceived&gt;
                </Paragraph>
              </View>

              <Button onPress={onDownloadPress}>Start Download</Button>
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

export default BotDownloadDialog;