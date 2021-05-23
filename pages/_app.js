import React from 'react';
import App from 'next/app';
import Head from 'next/head';

class MyApp extends App {
  render() {
    const { Component, pageProps, shopOrigin } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Invoice Generator</title>
          <meta charSet="utf-8" />
        </Head>
          <Component {...pageProps} />
      </React.Fragment>
    )
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  console.log(ctx)
  return {
    shopOrigin: ctx.query.shop,
  }
}

export default MyApp;