import 'tailwindcss/tailwind.css'
import { AnimateSharedLayout } from 'framer-motion'
import { SessionProvider } from 'next-auth/react'


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AnimateSharedLayout>
        <Component {...pageProps} />
      </AnimateSharedLayout>
    </SessionProvider>
  )
}

export default MyApp
