import type { DatePickerProviderProps } from '@rehookify/datepicker'
import {
  DatePickerProvider as _DatePickerProvider,
  useDatePickerContext,
} from '@rehookify/datepicker'
import { getFontSized } from '@tamagui/get-font-sized'
import { Calendar, ChevronLeft, ChevronRight, X } from '@tamagui/lucide-icons'
import type { GestureReponderEvent } from '@tamagui/web'
import type { PopoverProps } from 'tamagui'
import {
  Adapt,
  AnimatePresence,
  Button,
  Popover,
  Text,
  View,
  createStyledContext,
  styled,
  withStaticProperties,
} from 'tamagui'
import { BInput } from '@farcaster/rings-next/components/bento/BInput';
import useDateAnimation from "@farcaster/rings-next/components/bento/date/useDateAnimation";
import React from "react";

/** rehookify internally return `onClick` and that's incompatible with native */
export function swapOnClick<D>(d: D) {
  //@ts-ignore
  d.onPress = d.onClick
  return d
}

const DatePickerProvider =
  _DatePickerProvider as React.ComponentType<DatePickerProviderProps>

type DatePickerProps = PopoverProps & { config: DatePickerProviderProps['config'] }

export const { Provider: HeaderTypeProvider, useStyledContext: useHeaderType } =
  createStyledContext({ type: 'day', setHeader: (_: 'day' | 'month' | 'year') => {} })

const DatePickerImpl = (props: DatePickerProps) => {
  const { children, config, ...rest } = props

  return (
    <DatePickerProvider config={config}>
      <Popover keepChildrenMounted size="$5" allowFlip {...rest}>
        <Adapt when="sm" platform="touch">
          <Popover.Sheet modal dismissOnSnapToBottom snapPointsMode="fit">
            <Popover.Sheet.Frame padding="$4">
              <Adapt.Contents />
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Popover.Sheet>
        </Adapt>
        {children}
      </Popover>
    </DatePickerProvider>
  )
}

const Trigger = Popover.Trigger

const DatePickerContent = styled(Popover.Content, {
  animation: [
    '100ms',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
  variants: {
    unstyled: {
      false: {
        padding: 12,
        borderWidth: 1,
        borderColor: '$borderColor',
        enterStyle: { y: -10, opacity: 0 },
        exitStyle: { y: -10, opacity: 0 },
        elevate: true,
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const DatePicker = withStaticProperties(DatePickerImpl, {
  Trigger,
  Content: withStaticProperties(DatePickerContent, {
    Arrow: styled(Popover.Arrow, {
      borderWidth: 1,
      borderColor: '$borderColor',
    }),
  }),
})

type DatePickerInputProps = {
  onReset: () => void
  onButtonPress?: (e: GestureReponderEvent) => void
  label?: string;
  error?: string;
}

export const DatePickerInput = BInput.Area.styleable<DatePickerInputProps>(
  (props, ref) => {
    const { value, onButtonPress, size = '$3', onReset, ...rest } = props
    return (
      <View $platform-native={{ minWidth: '100%' }}>
        <BInput
          {...(props.error && {
            theme: 'red',
          })}
          size={size}
        >
          <BInput.Box>
            <BInput.Section>
              <BInput.Area value={value} ref={ref} {...rest} />
            </BInput.Section>
            <BInput.Section>
              <BInput.Button
                {...(props.error && {
                  theme: 'red',
                })}
                onPress={(e) => {
                  if (value) {
                    e.stopPropagation()
                    onReset()
                  } else {
                    onButtonPress?.(e)
                  }
                }}
              >
                {value ? (
                  <BInput.Icon>
                    <X />
                  </BInput.Icon>
                ) : (
                  <BInput.Icon
                  >
                    <Calendar />
                  </BInput.Icon>
                )}
              </BInput.Button>
            </BInput.Section>
          </BInput.Box>

          {(props.label || props.error) &&
            <BInput.Info
              {...(props.error && {
                theme: 'red',
             })}
            >
              {props.error || props.label}
            </BInput.Info>
          }
        </BInput>
      </View>
    )
  }
)

export function MonthPicker({
                              onChange = (e, date) => {},
                            }: { onChange?: (e: MouseEvent, date: Date) => void }) {
  const {
    data: { months },
    propGetters: { monthButton },
  } = useDatePickerContext()

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'year',
  })

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View
        {...prevNextAnimation()}
        flexDirection="row"
        flexWrap="wrap"
        gap="$2"
        animation="100ms"
        flexGrow={0}
        $platform-native={{
          justifyContent: 'space-between',
          width: '100%',
        }}
        $gtXs={{ width: 285 }}
      >
        {months.map((month) => (
          <Button
            themeInverse={month.active}
            borderRadius="$true"
            flexShrink={0}
            flexBasis={90}
            backgroundColor={month.active ? '$background' : 'transparent'}
            key={month.$date.toString()}
            chromeless
            padding={0}
            {...swapOnClick(
              monthButton(month, {
                onClick: onChange as any,
              })
            )}
          >
            <Button.Text color={month.active ? '$gray12' : '$gray11'}>
              {month.month}
            </Button.Text>
          </Button>
        ))}
      </View>
    </AnimatePresence>
  )
}

export function YearPicker({
                             onChange = () => {},
                           }: { onChange?: (e: MouseEvent, date: Date) => void }) {
  const {
    data: { years, calendars },
    propGetters: { yearButton },
  } = useDatePickerContext()
  const selectedYear = calendars[0].year

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'years',
  })

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View
        {...prevNextAnimation()}
        animation={'quick'}
        flexDirection="row"
        flexWrap="wrap"
        gap="$2"
        width={'100%'}
        maxWidth={280}
        justifyContent="space-between"
      >
        {years.map((year) => (
          <Button
            themeInverse={year.year === Number(selectedYear)}
            borderRadius="$true"
            flexBasis="30%"
            flexGrow={1}
            backgroundColor={
              year.year === Number(selectedYear) ? '$background' : 'transparent'
            }
            key={year.$date.toString()}
            chromeless
            padding={0}
            {...swapOnClick(
              yearButton(year, {
                onClick: onChange as any,
              })
            )}
          >
            <Button.Text
              color={year.year === Number(selectedYear) ? '$gray12' : '$gray11'}
            >
              {year.year}
            </Button.Text>
          </Button>
        ))}
      </View>
    </AnimatePresence>
  )
}
export function YearRangeSlider() {
  const {
    data: { years },
    propGetters: { previousYearsButton, nextYearsButton },
  } = useDatePickerContext()

  return (
    <View
      flexDirection="row"
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <Button circular size="$4" {...swapOnClick(previousYearsButton())}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronLeft />
        </Button.Icon>
      </Button>
      <View y={2} flexDirection="column" alignItems="center">
        <SizableText size="$5">
          {`${years[0].year} - ${years[years.length - 1].year}`}
        </SizableText>
      </View>
      <Button circular size="$4" {...swapOnClick(nextYearsButton())}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronRight />
        </Button.Icon>
      </Button>
    </View>
  )
}

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})