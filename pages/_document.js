import Document,{ Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render(){
  return (
    <Html lang="pt-PT">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Rubik&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      <style>{`
        body{
          font-family: Rubik;
        }
      `}
      </style>
    </Html>
  )
}
}
