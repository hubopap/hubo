import axios from 'axios'; 

const instance = axios.create();
  
// definições padrão de requests
instance.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem('token'); 
        if (token) {
            config.headers.authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => Promise.reject(error)
);
//função que regista na base de dados os dados do utilizador
export const RegisterUser = async (username, email, password) => {;
    await instance.post(
        "https://hubo.pt:3001/register",
        {
            username: username,
            password: password,
            email: email
        }
    )
}
//função que atribui o token ao utilizador que efetua o login
export const LoginUser = async (username, password) => {
    const response = await instance.post(
        "https://hubo.pt:3001/login",
        {
            username: username,
            password: password,
        }
    );
    localStorage.setItem("token", response.data.token);
}   
//função que define os dados do utilizador com base no token
export const getData = async () => {
    const token = await localStorage.getItem('token');
    let data = Object;
    if(!token){
        data.loggedIn = false;
    }else{
        data = await instance.get(
            "https://hubo.pt:3001/userdata",
        );
    }
    return data;
}

//função que obtem o token
export function getToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? token : null;
    }
    return null;
  }