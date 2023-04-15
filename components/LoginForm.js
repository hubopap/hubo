import { LoginUser } from '@/lib/auth'; // importação da função login que atribui os tokens aos utilizadores
import Link from 'next/link'; //importação do next link para que seja possivel redirecionar entre páginas
import React, { useState, useRef, useEffect } from "react"; // importação do useState que é usado apra gerir o estado dos componentes e o useEffect que permite executar efeitos colaterais em componentes
import { useRouter } from 'next/router'; //importação do next router para que possamos navegar entre routes e  usar routes dinamicas
import { getData } from '@/lib/auth'; // importação da função getData que obtem os dados do utilizador com base no token


//função do formulario de login
function LoginForm () {
  const router = useRouter();
  const [username, setUsername] = useState(""); //criação das variaveis username e password e atribuir-lhes um estado nulo
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

 
//função que redereciona o utilizador para a página perfil asssim que obter os dados de login corretos
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    await LoginUser(username, password);
    router.push({
      pathname: '/profile',
      state: { username, password }
    });
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      setErrorMessage('Invalid username or password.');
    } else {
      setErrorMessage('Something went wrong. Check your credentials.');
    }
  }
};
// função que rederiona o utilizador para a página perfil caso este aceda á página login e ja estiver atenticado
  useEffect(() => {
  
    async function fetchData() {
      const{ data } = await getData();
      if(data.loggedIn == true){
        router.push('/profile');
      }
    }
    fetchData().catch((error) => {
      console.log(error);
    });
  
  }, []);
 
  const togglePassword = () => {
    setShowPassword(!showPassword);
  }

//renderização do formulário de login
  return (
    <div className="form_login">
      <div className="form_box">
        <h1>Login</h1>
        <form method="post">
          <div className="txt_field">
            <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} required />
            <span></span>
            <label >Username</label>
          </div>
          <div className="txt_field">
          <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" className="passwordbutton" onClick={togglePassword}> {showPassword ? "Hide" : "Show"}</button>
             
            <span></span>
            <label>Password</label>
          </div>
          <input type="button" value="Login" onClick={handleSubmit} />
          <div className="login_link">
            Don´t have an account? <Link href="/register">Register</Link>
          </div><br/>
          {errorMessage && <p className="error_message">{errorMessage}</p>}
        </form>
       
      </div>
    </div>
   
  );
}

LoginForm.getInitialProps = async ({ query }) => {
  const { username, password } = query;
  if (username && password) {
    await LoginUser(username, password);
  }
  return {};
};

export default LoginForm;
