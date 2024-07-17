import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands/v2'
import { tokens, themes as themesIn } from '@tipster/next/tamagui.themes'
import { animations, fonts, media, mediaQueryDefaultActive } from '@tamagui/config/v3'
import type { CreateTamaguiProps } from '@tamagui/web'

// fix vite - react native uses global which it doesn't provide
globalThis['global'] ||= globalThis

export { shorthands } from '@tamagui/shorthands/v2'

export const selectionStyles = (theme: any) =>
  theme.color5
    ? {
      backgroundColor: theme.color5,
      color: theme.color11,
    }
    : null

// tree shake away themes in production
const themes =
  process.env.TAMAGUI_OPTIMIZE_THEMES === 'true' ? ({} as typeof themesIn) : themesIn

export const configBase = {
  animations,
  defaultFont: 'body',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  themes,
  media,
  shorthands,
  tokens,
  fonts,
  mediaQueryDefaultActive: mediaQueryDefaultActive,
  selectionStyles,
} satisfies CreateTamaguiProps;

export const config = createTamagui(configBase)

export default config;

export type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
