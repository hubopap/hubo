import Layout from "@/components/Layout"; //importação do layout
import {getData} from '@/lib/auth'; //importação da função getData que otem os dados do utilizador
import { useEffect, useState } from 'react';  // importação do useState que é usado apra gerir o estado dos componentes e o useEffect que permite executar efeitos colaterais em componentes
import Link from 'next/link'; //importação do next link para que seja possivel redirecionar entre páginas
import { useRouter } from 'next/router'; //importação do next router para que possamos usar routes dinamicas
import axios from 'axios'; //importação do axios para fazer requests à API



//função dos grupos do utilizador e todas as suas funções para que  assim como as rendizaçoes da página

export default function MyGroups(){
    const [userData, setUserData] = useState('');
    const [name_group, setNameGroup] = useState('');
    const [desc_group, setDescGroup] = useState('');
    const [groups, setGroups] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');
//use effect para se o utilzador não estar autenticado ser rederecionado para o index e se estiver atenticado mostrar os grupos do utilizador
    useEffect(() => {
        async function fetchData() {
          const  { data }  = await getData();
          if(data.loggedIn == false){
            router.push('/');
          }else{
            setUserData(data);
            const token = localStorage.getItem("token");
            const { data: groupsData } = await axios.get('https://hubo.pt:3001/groups_by_user', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setGroups(groupsData);
            console.log(groupsData);
          }
        }
        fetchData().catch((error) => {
            router.push('/');
        });
      
    }, []);
//criar grupos
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name_group ) {
      setError('You must provide a group name');
      return;
    }else if(!desc_group) {
        setError('You must provide a group description');
    }else{

    const token = localStorage.getItem("token");
    const { data } = await axios.post('https://hubo.pt:3001/create_group', {
      name_group: name_group,
      desc_group: desc_group
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setGroups([...groups, data]);
    setNameGroup('');
    setDescGroup('');
    setModalOpen(false);
    setError('');
  } 
}
    //renderização do front-end que mostra as grupos em que o utilizador se econtra o botão que mostra o pop-up para criar os grupos 
    return (
      <div>
        <Layout>
          <h1>My Groups</h1>
          <button className="button_cgroups" onClick={() => setModalOpen(true)}>+</button>
    
          {modalOpen && (
            <div className="modal_groups">
              <form onSubmit={handleSubmit}>
                <label>
                  Group name
                  <input type="text" value={name_group} onChange={(event) => setNameGroup(event.target.value)} />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <label>
                  Group description <br/>
                  <textarea className="group_textarea" type="text" value={desc_group} onChange={(event) => setDescGroup(event.target.value)} />
                </label>
                <div className="buttons_container">
                  <button className="button_groups" type="submit">Create</button>
                  <button className="button_groups" onClick={() => {setNameGroup('');setDescGroup('');setModalOpen(false);}}>Close</button>
                </div>
              </form>
    
            </div>
          )}
  
        {groups.map((group) => (
          <Link href={`/group/${group.id_group}`} key={group.id_group}>
          
            <div className="container_groups">
              <p className="name_group">{group.name_group}</p>
              <pre className="desc_group" >{group.desc_group}</pre>
            </div>
         
        </Link>
))}
        </Layout>
      </div>
    );        
}    