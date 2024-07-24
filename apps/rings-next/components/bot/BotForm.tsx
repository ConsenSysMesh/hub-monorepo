import {
  Paragraph,
  Button,
  H1,
  Spinner,
  View,
  XStack,
  Text,
  YStack,
  useMedia, Card,
} from 'tamagui';
import { BInput } from "@farcaster/rings-next/components/bento/BInput";
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@farcaster/rings-next/provider/AuthProvider";
import { useBotActions } from "@farcaster/rings-next/hooks/useBotActions";
import getClient from '@farcaster/rings-next/api-client';
import { useParams, useRouter } from "next/navigation";
import AutoCompleteList from "@farcaster/rings-next/components/autocomplete/AutoCompleteList";
import { Item } from "@farcaster/rings-next/components/autocomplete/AutoComplete";
import Clipboard from "@farcaster/rings-next/components/clipboard/Clipboard";
import BotDeleteAlert from "@farcaster/rings-next/components/bot/BotDeleteAlert";
import HorizontalRadio from "@farcaster/rings-next/components/bento/HorizontalRadio";
import HatsSelector from "@farcaster/rings-next/components/hats/HatsSelector";
import BotFormError from "@farcaster/rings-next/components/bot/BotFormError";
import Visibility from "@farcaster/rings-next/components/visibility/Visibility";
import { eligibilityEnums } from "@farcaster/rings-next/constants";
import schema from "@farcaster/rings-next/components/bot/formSchema";
import { AlertCircle } from "@tamagui/lucide-icons";

const eligibilityTypes = [eligibilityEnums.AllowList, eligibilityEnums.HatsGated];

const convertUser = (user: any) => {
  const id = user.id || user.fid;

  return (
    {
      title: user.displayName || id.toString(),
      id,
      subTitle: user.username,
      icon: user.pfpUrl || 'https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fwarpcast.com%2Favatar.png',
      disabled: user.disabled,
    }
  );
}

async function searchUsers(queryStr: string) {
  const apiClient = await getClient();
  const result = await apiClient.searchUsers(queryStr);
  return (result.data || []).map(convertUser);
}

const filterUsers = (item: Item, index: number, term: string) =>
    item.subTitle!.toLowerCase().includes(term.toLowerCase());

const castToInt = (text: string, onChange: Function) => {
  const numericValue = text.replace(/[^0-9]/g, '');
  const integerValue = parseInt(numericValue, 10);
  onChange(isNaN(integerValue) ? 0 : integerValue);
};

interface BotFormProps {
  onSubmit?: (data: z.infer<typeof schema>) => void;
  onCancel?: () => void;
  isNewBot: boolean;
  defaultValues: z.infer<typeof schema>;
}

type Params = { id: string }

const BotFormHatAlert = () => (
  <Card padding="$3" flexDirection="row" alignItems="center" marginBottom="$3">
    <AlertCircle marginRight="$3" color="$color11" />
    <View>
      <Paragraph fontWeight="bold">1hr Update Frequency</Paragraph>
      <Paragraph color="$color11">Eligibility may take an hour when hats update</Paragraph>
    </View>
  </Card>
);

const BotForm: React.FC<BotFormProps> = (props) => {
  const {
    onCancel = () => {},
    onSubmit: providedOnSubmit = () => {},
    isNewBot,
    defaultValues = {},
    ...otherProps
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { session } = useAuth();
  const { replace } = useRouter();
  const { createBot, updateBot } = useBotActions();
  const { id } = useParams<Params>();
  const { sm } = useMedia();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eligibilityType, setEligibilityType] = useState(defaultValues?.eligibilityType || eligibilityTypes[0]);
  const [adminEligibilityType, setAdminEligibilityType] = useState(defaultValues?.adminEligibilityType || eligibilityTypes[0]);

  const submitButtonText = isNewBot ? 'Create' : 'Update';

  const eligibleUsers = defaultValues?.eligibilityCriteria?.userObjs ?
    defaultValues.eligibilityCriteria.userObjs.map(convertUser) : [convertUser(session)];

  const adminEligibleUsers = defaultValues?.adminEligibilityCriteria?.userObjs ?
    defaultValues.adminEligibilityCriteria.userObjs.map(convertUser) : [convertUser(session)];

  const eligibleHatWearer = defaultValues?.eligibilityCriteria?.[eligibilityEnums.HatsGated] || {
    hatId: '',
    chainId: 1,
  };

  const adminEligibleHatWearer = defaultValues?.adminEligibilityCriteria?.[eligibilityEnums.HatsGated] || {
    hatId: '',
    chainId: 1,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      channelUrl: '',
      botName: '',
      triggerWord: '',
      eligibilityExplanation: '',
      dailyAllowance: 0,
      eligibilityType: eligibilityTypes[0],
      adminEligibilityType: eligibilityTypes[0],
      ...defaultValues,
      eligibleUsers,
      adminEligibleUsers,
      eligibleHatWearer,
      adminEligibleHatWearer,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);

    if (!data.eligibleUsers || data.eligibleUsers.length === 0) {
      data.eligibleUsers = eligibleUsers;
    }

    const payload = {
      channelUrl: data.channelUrl,
      ownerId: session.fid,
      dailyAllowance: data.dailyAllowance,
      triggerWord: data.triggerWord,
      botName: data.botName,
      eligibilityExplanation: data.eligibilityExplanation,
      eligibilityType: data.eligibilityType,
      eligibilityCriteria: {
        [eligibilityEnums.AllowList]: data.eligibleUsers.map(u => u.id),
        [eligibilityEnums.HatsGated]: {
          hatId: data.eligibleHatWearer.hatId,
          chainId: data.eligibleHatWearer.chainId,
        }
      },
      adminEligibilityType: data.adminEligibilityType,
      adminEligibilityCriteria: {
        [eligibilityEnums.AllowList]: data.adminEligibleUsers.map(u => u.id),
        [eligibilityEnums.HatsGated]: {
          hatId: data.adminEligibleHatWearer.hatId,
          chainId: data.adminEligibleHatWearer.chainId,
        }
      }
    };

    try {
      let botConfig;
      if (isNewBot) {
        botConfig = await createBot(payload);
      } else {
        payload.id = id;
        botConfig = await updateBot(payload);
      }
      if (!botConfig.error) {
        providedOnSubmit(botConfig.payload);
      } else {
        setError(botConfig.payload.message)
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await getClient().deleteBot(id);
      // Navigate to home
      replace('/');
    } finally {
      setLoading(false);
    }
  }

  const onError = (error: any) => {
    console.error(error);
    setLoading(false);
  }

  const onShouldAdminRemove = (user) => {
    const adminId = user.id || user.fid;
    const owner = defaultValues?.ownerId || session.fid;

    if (adminId === owner) {
      return {
        confirm: {
          title: 'Delete Yourself?',
          subTitle: 'If you delete yourself as an admin, you will lose access to settings. This is not easily reversed and would require contacting another admin to add you back.',
          buttonTitle: 'Delete Me',
          theme: 'red',
        }
      }
    }

    return true;
  }

  return (
    <View
      flexDirection="column"
      alignItems="stretch"
      minWidth="100%"
      $gtXs={{ width: 400 }}
      gap="$5"
      {...otherProps}
    >
      <View gap="$4">
        <H1 size="$8" $xs={{ size: '$7' }}>
          Basics
        </H1>

        <Controller
          control={control}
          name="botName"
          render={({ field: { onChange, onBlur, value } }) => (
            <BInput
              {...(errors.botName && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <BInput.Label>Bot Name</BInput.Label>
              <BInput.Box>
                <BInput.Area autoFocus={isNewBot} placeholder="e.g. Tipster Bot" onChangeText={onChange} value={value} />
              </BInput.Box>

              {errors.botName ?
                <BotFormError error={errors.botName} /> :
                <BInput.Info>Something to help you remember it</BInput.Info>
              }
            </BInput>
          )}
        />

        <Controller
          control={control}
          name="channelUrl"
          render={({ field: { onChange, onBlur, value } }) => (
            <BInput
              {...(errors.channelUrl && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <BInput.Label>Community Channel URL</BInput.Label>
              <BInput.Box>
                <BInput.Area
                  placeholder="e.g. https://warpcast.com/~/channel/tipster"
                  onChangeText={(t) => {
                    if (t.startsWith('/')) {
                      onChange(`https://warpcast.com/~/channel${t}`);
                    } else {
                      onChange(t);
                    }
                  }}
                  value={value}
                />
              </BInput.Box>
              {errors.channelUrl ?
                <BotFormError error={errors.channelUrl} /> :
                <BInput.Info>Can only create bots for channels you own</BInput.Info>
              }
            </BInput>
          )}
        />

        <Controller
          control={control}
          name="triggerWord"
          render={({ field: { onChange, onBlur, value } }) => (
            <BInput
              {...(errors.triggerWord && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <BInput.Label>Trigger Word</BInput.Label>
              <BInput.Box>
                <BInput.Area placeholder="e.g. $TIP" onChangeText={onChange} value={value} />
              </BInput.Box>
              {errors.triggerWord ?
                <BotFormError error={errors.triggerWord} /> :
                <BInput.Info>Reply cast looks like: &quot;Here&apos;s 500 &lt;Trigger Word&gt;&quot;</BInput.Info>
              }
            </BInput>
          )}
        />
      </View>

      {!isNewBot && (
        <View gap="$4">
          <H1 size="$8" $xs={{ size: '$7' }}>
            Frame Setup
          </H1>

          <YStack>
            <Paragraph color="$color11">
              To help frens join in the game:
            </Paragraph>

            <Text>1. Copy this frame link,</Text>
            <Text>2. Share it in your channel, and</Text>
            <Text>3. Pin it for all to see.</Text>
          </YStack>

          <Clipboard label="Frame Link" value={`${process.env.NEXT_PUBLIC_URL}/frame/${id}`} />
        </View>
      )}

      <View gap="$4">
        <H1 size="$8" $xs={{ size: '$7' }}>
          Eligibility Criteria
        </H1>

        <Paragraph>Select community members are allowlisted to tip but anyone can receive tips. </Paragraph>

        <Controller
          control={control}
          name="eligibilityExplanation"
          render={({ field: { onChange, onBlur, value } }) => (
            <BInput
              {...(errors.eligibilityExplanation && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <BInput.Label>Eligibility Explanation</BInput.Label>
              <BInput.Box>
                <BInput.Area
                  placeholder="Enter eligibility explanation"
                  onChangeText={onChange}
                  value={value}
                  maxLength={300}
                  multiline
                  numberOfLines={4}
                />
              </BInput.Box>

              {errors.eligibilityExplanation ?
                <BotFormError error={errors.eligibilityExplanation} /> :
                <BInput.Info>Describe your community rules around how someone becomes eligible to give tips ({value?.length || 0}/300)</BInput.Info>
              }
            </BInput>
          )}
        />

        <H1 size="$7" $xs={{ size: '$6', textTransform: 'none' }}>
          Accounts That Can Tip
        </H1>

        <Controller
          control={control}
          name="eligibilityType"
          render={({ field: { onChange, value } }) => (
            <HorizontalRadio
              value={value}
              items={eligibilityTypes}
              onChange={(item) => {
                onChange(item);
                setEligibilityType(item);
              }}
              label="Select method for defining accounts that can tip"
            />
          )}
        />

        <Visibility visible={eligibilityType === eligibilityEnums.AllowList}>
          <Controller
            control={control}
            name="eligibleUsers"
            render={({ field: { onChange, onBlur, value } }) => (
              <AutoCompleteList
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                searchFunc={searchUsers}
                filterFunc={filterUsers}
                placeholder="Add Account"
              />
            )}
          />
        </Visibility>

        <Visibility visible={eligibilityType === eligibilityEnums.HatsGated}>
          <BotFormHatAlert />

          <Controller
            control={control}
            name="eligibleHatWearer"
            render={({ field: { onChange, onBlur, value } }) => (
              <HatsSelector
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                errors={errors?.eligibleHatWearer}
              />
            )}
          />
        </Visibility>
      </View>

      <View gap="$4">
        <H1 size="$8" $xs={{ size: '$7' }}>
          Emissions
        </H1>

        <Paragraph>Select community members are allowlisted to tip but anyone can receive tips. </Paragraph>

        <Controller
          control={control}
          name="dailyAllowance"
          render={({ field: { onChange, onBlur, value } }) => (
            <BInput
              {...(errors.dailyAllowance && {
                theme: 'red',
              })}
              onBlur={onBlur}
              size="$4"
            >
              <BInput.Label>Daily Allowance</BInput.Label>
              <BInput.Box>
                <BInput.Area
                  placeholder="Enter daily allowance"
                  onChangeText={text => castToInt(text, onChange)}
                  value={value}
                  keyboardType="numeric"
                />
              </BInput.Box>
              {errors.dailyAllowance ?
                <BotFormError error={errors.dailyAllowance} /> :
                <BInput.Info>Max amount each player can tip per day</BInput.Info>
              }
            </BInput>
          )}
        />

        {error && <XStack gap="$2" marginTop="$3"><BotFormError error={error}/></XStack> }
      </View>

      <View gap="$4">
        <H1 size="$8" $xs={{ size: '$7' }}>
          Bot Admins
        </H1>

        <Controller
          control={control}
          name="adminEligibilityType"
          render={({ field: { onChange, value } }) => (
            <HorizontalRadio
              value={value}
              items={eligibilityTypes}
              onChange={(item) => {
                onChange(item);
                setAdminEligibilityType(item);
              }}
              label="Select method for defining accounts that can tip"
            />
          )}
        />

        <Visibility visible={adminEligibilityType === eligibilityEnums.AllowList}>
          <Controller
            control={control}
            name="adminEligibleUsers"
            render={({ field: { onChange, onBlur, value } }) => (
              <AutoCompleteList
                onShouldRemove={onShouldAdminRemove}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                requireValue
                searchFunc={searchUsers}
                filterFunc={filterUsers}
                placeholder="Add Account"
              />
            )}
          />
        </Visibility>

        <Visibility visible={adminEligibilityType === eligibilityEnums.HatsGated}>
          <BotFormHatAlert />

          <Controller
            control={control}
            name="adminEligibleHatWearer"
            render={({ field: { onChange, onBlur, value } }) => (
              <HatsSelector
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                errors={errors?.adminEligibleHatWearer}
              />
            )}
          />
        </Visibility>
      </View>

      <XStack
        gap="$2"
        justifyContent="flex-end"
        marginTop="$3"
        flexDirection={sm ? "column" : "row"}
      >
        {!isNewBot ?
          <Button
            theme="red"
            onPress={() => setDeleteOpen(true)}>
            Delete
          </Button> :
          <Button
            chromeless
            onPress={onCancel}
          >
            Cancel
          </Button>
        }

        <Button
          disabled={loading}
          onPress={handleSubmit(onSubmit, onError)}
          cursor={loading ? 'progress' : 'pointer'}
          icon={loading ?
            <Spinner
              size="small"
              color="$color"
              key="loading-spinner"
              opacity={1}
              scale={0.5}
              animation="quick"
              enterStyle={{
                opacity: 0,
                scale: 0.5,
              }}
              exitStyle={{
                opacity: 0,
                scale: 0.5,
              }}
            /> : null
          }
        >
          {submitButtonText}
        </Button>
      </XStack>

      <BotDeleteAlert
        onDelete={onDelete}
        onCancel={() => setDeleteOpen(false)}
        open={deleteOpen}
      />
    </View>
  );
}

export default BotForm;
