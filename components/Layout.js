import Link from 'next/link'; //importação do next link para que seja possivel redirecionar entre páginas
import Head from 'next/head'; //importação do next head para adicionar informações ao cabeçalho
import React, { useState, useEffect } from "react";

export default ({ children, title }) => {
  const [hasToken, setHasToken] = useState(false);
//verifica se existe um token na local storage para decidir se mostra determinadas routes no menu
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    setHasToken(!!token);
  }, []);
//renderização do menu com verificações do tokken, se o utilizador estiver autenticado pode ver sertas routes do menu se não apenas vê o index o login e o about us
  return (
    <div className="root">
      <Head>
        <title>Hubo</title>
      </Head>
      <header className="header">
        <nav className="navbar">
          <Link href="/"><img src="/static/hubologo.png" alt="Hubi"/></Link>
          {hasToken ? (
            <>
              <Link href="/profile">Profile</Link>
              <Link href="/groups">Groups</Link>
              <Link href="/users">Users</Link>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
          <Link href="/about">About us</Link>
        </nav>
      </header>

      <h1>{title}</h1>
      <div className="container">{children}</div>


      <footer>&copy; Work smart, Work Hubo</footer>

      <style>{`
        .root {
          green:#16a085;
          black:#444;
          light-color:#777;
          border:.2rem solid var(--green);
        }
        
        * {
          margin:0;
          padding: 0;
          box-sizing: border-box;
          outline: none;
          border: none;
          text-decoration: none;
        }
        
        html {
          overflow-x: hidden;
          scroll-padding-top: 7rem;
          scroll-behavior: smooth;
        }
        
        img {
          justify-content: space-around;
          width: 50px;
          height: 50px;
          vertical-align: middle;
        }
        
        nav {
          color: white;
        }
        
        header {
          width: 100%;
          display: flex;
          justify-content: space-around;
          padding: 1em;
          font-size: 1.2rem;
          background-color: #285e89;
        }
        
        .header .logo {
          font-size: 2.5rem;
          color: var(--black);
        }
        
        .header .navbar a {
          font-size: 1.7rem;
          color: var(--light-color);
          margin-left: 2rem;
        }
        
        footer {
          position: fixed;
          bottom: 0;
          width: 50%;
    
          
        }
      `}</style>
    </div>
  );
}
