'use client';
import {
  H2,
  H6,
  H4,
} from 'tamagui';
import { SignInButton } from '@farcaster/auth-kit';
import Logo from "@tipster/next/components/logo/Logo";
import { useAuth } from "@tipster/next/provider/AuthProvider";
import Container from "@tipster/next/components/container/Container";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <Container
      outerProps={{
        height: '100vh',
      }}
      innerProps={{
        alignItems: 'center',
        gap: '$4'
      }}
    >
      <Logo />

      <H2 textAlign="center">tipster.bot</H2>

      <H6 textAlign="center" textTransform="uppercase" color="$color11" marginBottom="$2">
        A Tipping Game for Every <br />
        farcaster community
      </H6>

      <H4 textAlign="center">Log in to get started</H4>

      <SignInButton onSuccess={(signInData) => { login(signInData) }} />
    </Container>
  )
}
