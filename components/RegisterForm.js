import { RegisterUser } from '@/lib/auth'; // função que regista o utilizador na base de dados
import Link from 'next/link'; //importação do next link para que seja possivel redirecionar entre páginas
import React, { useState, useRef, useEffect } from "react"; // importação do useState que é usado apra gerir o estado dos componentes e o useEffect que permite executar efeitos colaterais em componentes
import { useRouter } from 'next/router'; //importação do next router para que possamos navegar entre routes e usar routes dinamicas
import {getData} from '@/lib/auth'; //importação da função getData que obtem os dados do utilizador com base no token


// função do formulario de registo
function RegisterForm() {
  const router = useRouter();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);               //inicialização de todos os campos de criação dos utiliazdor como nulos
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
// função que redericiona para a página login assim que o registo é realizado
const handleSubmit = async event => {
  event.preventDefault();

  if (username.length < 3 || username.length > 20) {
    setErrorMessage("Username must have between 3 and 20 characters");
  } else if (!(/^\S+@\S+\.\S+$/.test(email))) {
    setErrorMessage("Please enter a valid email address");
  } else if (password.length < 8 || password.length > 20) {
    setErrorMessage("Password must have between 8 and 20 characters");
  } else {
    await RegisterUser(username, email, password);
    router.push({
      pathname: '/login',
    });
  }
};

const togglePassword = () => {
  setShowPassword(!showPassword);
}

  // função que redireciona o utilizador para o perfil se o mesmo estiver autenticado e tentar fazer um registo
  useEffect(() => {
  
    async function fetchData() {
      const{ data } = await getData();
      if(data.loggedIn == true){
        console.log(data);
        router.push('/profile');
      }
    }
    fetchData().catch((error) => {
      console.log(error);
    });
  
  }, []);

  
//renderização do formulario de registo
  return (
    <div className="form_register">
      <div className="form_box">
        <h1>Create an account</h1>
        <form method="post">
          <div className="txt_field">
          <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} required />
            <span></span>
            <label>Username</label>
          </div>
          <div className="txt_field">
          <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <span></span>
            <label>Email</label>
          </div>
          <div className="txt_field">
            <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="passwordbutton" onClick={togglePassword}> {showPassword ? "Hide" : "Show"}</button>
              <span></span>
              <label>Password</label>
          </div>
          <input type="button" value="Register" onClick={handleSubmit} />
          <div className="login_link">
            Do you have an account? <Link href="/login">Login</Link>
          </div>
          {errorMessage && <p className="error_message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
