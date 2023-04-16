// import Layout from "@/components/Layout";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import axios from 'axios';
// import { getToken } from '@/lib/auth';

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const token = getToken();
//         const { data } = await axios.get('http://129.151.255.136:3001/users', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(data);
//       } catch (error) {
//         router.push("/");
//       }
//     }
//     fetchData();
//   }, []);

//   return (
//     <>
//       <Layout>
//         {Array.isArray(users) && users.map((user) => (
//           <Link href={`/user/${user.username}`} key={user.id}>
//             <div className="user">
//                 {user.username}
//             </div>
//           </Link>
//         ))}
//       </Layout>
//     </>
//   );
// }

import Layout from "@/components/Layout";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { getToken } from '@/lib/auth';

export default function Users() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken();
        const { data } = await axios.get('http://129.151.255.136:3001/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(data);
      } catch (error) {
        router.push("/");
      }
    }
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const filteredUsers = users.filter((user) => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Layout>
        <div className="search-box">
          <input type="text" placeholder="Search users" value={searchTerm} onChange={handleSearch} />
        </div>
        <div className="users-container">
          {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
            <Link href={`/user/${user.username}`} key={user.id}>
              <div className="user" title={user.username} data-tooltip={user.username}>
                {user.username}
              </div>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  );
}
