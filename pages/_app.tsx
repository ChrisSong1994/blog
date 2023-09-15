import { AppProps } from 'next/app'
import 'highlight.js/styles/stackoverflow-dark.css';

import '../styles/index.css'
import '../styles/codeCopyStyle.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
