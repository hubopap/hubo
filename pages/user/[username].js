import Layout from '@/components/Layout'; //importação do layout 
import { useRouter } from 'next/router'; //importação do next router para que possamos usar routes dinamicas
import axios from 'axios';//importação do axios para fazer requests à API
import { useState, useEffect } from 'react'; // importação do useState que é usado apra gerir o estado dos componentes e o useEffect que permite executar efeitos colaterais em componentes
import { getData } from '@/lib/auth';


//função do perfil do utilizador
export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);
//use effect que vai a route buscar o username para que possa defenir os dados do utilizador com base na route
  useEffect(() => {

    async function checkUser(){
      const user_data = await getData();
      if (user_data.data.user.username == username) {
        router.replace('/profile');
      }
    }

    checkUser();

    async function fetchData() {
      try {
        const { data } = await axios.get(`http://129.151.255.136:3001/user/${username}`, {
        });
        setUser(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [username]);

  if (!user) {
    return <div>Loading...</div>;    //loading se o utilizador ainda nao estiver definido ou se não for definido fica em loop
  }
//renderização do front-end com todas os dados do utilizador
  return (
    <div>
      <Layout>
        <div className="profile">
        <img src="/static/profile_pic.png" alt="Profile Picture" className="profile_pic"/>
          <p>
            <label htmlFor="username">
              <span className="profile_labels">Username:</span><br/>
            <input
              type="text"
              id="username"
              value={user.username}
              readOnly
            />
            </label>
          </p>
          <p>
            <label htmlFor="email">
              <span className="profile_labels">Email:</span><br/>
            <input
              type="text"
              id="email"
              value={user.email_user}
              readOnly
            />
            </label>
          </p>
          <p>
          <label htmlFor="email">
              <span className="profile_labels">Bio:</span><br/>
            <input
              type="text"
              id="bio_user"
              value={user.bio_user}
              readOnly
            />
            </label>
          </p>
        </div>
      </Layout>
    </div>
  );
}
