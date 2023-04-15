import Head from 'next/head'
import React, { useEffect } from "react";
import '@/styles/index.css';
import '@/styles/LoginForm.css';
import '@/styles/RegisterForm.css';
import '@/styles/Profile.css';
import '@/styles/UsersPage.css';
import '@/styles/GroupsPage.css';
import '@/styles/GroupPage.css';
import '@/styles/AboutPage.css';


function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta charset="utf-8"/>
        <meta name="description" content="a webapp by Rodrigo Rodrigues and Nuno Teixeira"/>
        <meta name="viewport" content="with=device-width"/>
      </Head>
      <Component {...pageProps} />
    </div>
  )
}

export default App;
