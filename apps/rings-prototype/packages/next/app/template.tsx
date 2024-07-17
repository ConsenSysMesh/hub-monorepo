'use client';
import { NextProvider } from '@tipster/next/next.provider';
import '@farcaster/auth-kit/styles.css';

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css');
}

export default function Template({ children }: { children: React.ReactNode }) {
  return <NextProvider>{children}</NextProvider>
}
