import { IdentityProvider } from '@/providers/Identity';
import { MessegerProvider } from '@/providers/Messenger';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <IdentityProvider>
        <MessegerProvider>
          <Component {...pageProps} />
        </MessegerProvider>
      </IdentityProvider>
      <ToastContainer />
    </>
  )
}
