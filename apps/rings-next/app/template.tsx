'use client';
import { NextProvider } from '@farcaster/rings-next/next.provider';
import '@farcaster/auth-kit/styles.css';
import FidProvider from '@farcaster/rings-next/provider/FidProvider';

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css');
}

export default function Template({ children }: { children: React.ReactNode }) {
  return <NextProvider><FidProvider>{children}</FidProvider></NextProvider>
}
