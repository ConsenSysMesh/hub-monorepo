import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'tipster.bot',
  description: 'A tipping bot built on farcaster.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
          <meta property="og:title" content="tipster.bot" />
          <meta property="og:description" content="A tipping game for every farcaster community" />
          <meta property="og:image:url" content={`${process.env.NEXT_PUBLIC_API_URL}/api/public/images/tipster.png`} />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}