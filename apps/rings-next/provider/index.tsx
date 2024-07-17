import {
  TamaguiProvider,
  TamaguiProviderProps,
  Theme,
  View,
} from 'tamagui';
import config from "@farcaster/rings-next/tamagui.config";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { CustomToast } from "@farcaster/rings-next/components/toast/CustomToast";
import { useColorScheme } from 'react-native'
import AuthProvider from '@farcaster/rings-next/provider/AuthProvider'
import { AuthKitProvider as FarcasterAuthProvider } from '@farcaster/auth-kit'
import { Provider as StoreProvider } from 'react-redux';
import store from '@farcaster/rings-next/state/store';

const farcasterAuthConfig = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'tipster.bot',
  siweUri: 'https://tipster.bot/login',
};

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme();

  return (
    <StoreProvider store={store}>
      <TamaguiProvider
        config={config}
        disableInjectCSS
        defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
        {...rest}
      >
        <Theme name="violet">
          <View
            backgroundColor="$background"
            height="100%"
            minHeight="100vh"
            minWidth="100vw"
          >
            <ToastProvider>
              <FarcasterAuthProvider config={farcasterAuthConfig}>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </FarcasterAuthProvider>

              <CustomToast />
              <ToastViewport left={0} right={0} top={10} />
            </ToastProvider>
          </View>
        </Theme>
      </TamaguiProvider>
    </StoreProvider>
  );
}
