import "../styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { Layout } from "../common/components/Layout";
import Script from "next/script";
import { Stream } from "../components/Stream";

function MyApp({ Component, pageProps }: AppProps) {
  const title = "JPCS Code Rush";
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="1024" />
        <meta property="og:type" content="website" />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        defer
        data-domain="code-rush"
        src="https://plausible.io/js/plausible.js"
      />
      <NextNProgress
        options={{ showSpinner: false }}
        color="#d6bbfa"
        height={2}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* <Stream /> */}
    </div>
  );
}

export default MyApp;
