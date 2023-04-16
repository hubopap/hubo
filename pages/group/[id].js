import Layout from '@/components/Layout'; //importação do layout 
import { useRouter } from 'next/router';//importação do next router para que possamos navegar entre routes e usar routes dinamicas
import axios from 'axios'; //importação do axios para fazer requests à API
import { getToken } from '@/lib/auth'; //importação da função getToken para receber o token do utilizador
import { useState, useEffect } from 'react';   // importação do useState que é usado apra gerir o estado dos componentes e o useEffect que permite executar efeitos colaterais em componentes
import { getData } from '@/lib/auth';
import { TrashOutline } from 'ionicons/icons';
import moment from 'moment';

//função grupo que contem todas as funções da página grupo
export default function Group({ group }) {
  const router = useRouter();
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [nonGroupUsers, setNonGroupUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [selectedUser, setSelectedUser]= useState('');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [originalDeadline, setOriginalDeadline] = useState('');
  const [desc_task, setDeskTask] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [assignedUserPerm, setAssignedUserPerm] = useState();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);;
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [editDescTask, setEditDescTask] = useState('');
  const [selectedState, setSelectedState] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentDate = new Date();
  const [filesopen, setFilesOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(false);
  const [filesList, setFilesList] = useState(false);
  const [files, setFiles] = useState([]);
  const [id_group, setIdGroup] = useState(null);
  const [groupInfo, setGroupInfo] = useState(false);

//criar tarefa
const handleCreateTaskPopUp = () => {
  setCreateTaskOpen(true);
};

const isUserInGroup = async () => {
  try {
    const user_data = await getData();
    const token = await getToken();
    const nongroup = await axios.post('https://hubo.pt:3001/non_group_users', {
      id_group: group.id_group
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const isUserInNonGroup = nongroup.data.users.some(user => user.username === user_data.data.user.username);
    if(isUserInNonGroup){
      router.push('/groups');
    }

  } catch (error) {
    console.error(error);
  }
}

const handleCreateTask = async (e) => {
  e.preventDefault();
  const deadline_create = deadline + "T23:59:59.999Z";
  const selectedDate = new Date(deadline_create);

  if (!desc_task || !assignedUser || !assignedUserPerm || !deadline) {
    setErrorMessage('All fields are required.');
    return;
  }else if (selectedDate < currentDate){ 
    setErrorMessage('Please select a future date.');
    return;
  }else{
    try {
      const token = await getToken();
      await axios.post('https://hubo.pt:3001/create_task', {
        id_group: group.id_group,
        deadline_task: deadline_create,
        assigned_user: assignedUser,
        assigned_user_perm: assignedUserPerm,
        desc_task: desc_task,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreateTaskOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrorMessage('Error creating task. You must fill all the fields.');
    }
  };
}

const format_date = (date_string) => {
  const day = date_string.slice(8, 10);
  const month = date_string.slice(5, 7);
  const year = date_string.slice(0, 4);
  const date = day + "/" + month + "/" + year;
  return date;
}

//editar tarefa
const handleEditTaskPopUp= () =>{
  setOriginalDeadline(new Date(moment(selectedTask.task.deadline_task).format("YYYY-MM-DDT23:59:59.999[Z]")).toISOString().split('T')[0]);
  setEditDescTask(selectedTask.task.desc_task);
  setEditDeadline(new Date(moment(selectedTask.task.deadline_task).format("YYYY-MM-DDT23:59:59.999[Z]")).toISOString().split('T')[0]);
  setEditTaskOpen(true);
  setIsOpen(false); 
}
const handleEditTask = async (e) => {
  e.preventDefault();
  const deadline_create = editDeadline + "T23:59:59.999Z";
  const selectedDate = new Date(deadline_create);
  if (!desc_task && !editDeadline) {
    setErrorMessage('At least change one thing before editing ');
    return;
  }else if (new Date(moment(editDeadline).format("YYYY-MM-DDT23:59:59.999[Z]")).toISOString().split('T')[0] < new Date().toISOString().split('T')[0] && new Date(moment(originalDeadline).format("YYYY-MM-DDT23:59:59.999[Z]")).toISOString().split('T')[0] != new Date(moment(editDeadline).format("YYYY-MM-DDT23:59:59.999[Z]")).toISOString().split('T')[0]){ 
    setErrorMessage('Select a future date to edit.');
    return;
  }else{
  try {
    const token = await getToken();
    await axios.post(
      'https://hubo.pt:3001/update_task_info',
      {
        id_task: selectedTask.task.id_task,
        deadline_task: editDeadline,
        desc_task: editDescTask,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEditTaskOpen(false);
    setSelectedTask(null);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};
}
//marcar a tarefa como concluida
const setAsdoneTask = async ( selectedtask ) => {
  try {
    const token = await getToken();
    const response = await axios.post('https://hubo.pt:3001/update_task_state', {
      id_task: selectedTask.task.id_task,
      state_task: 2,
    },
     {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data.message); 
  } catch (error) {
    console.error(error);
  }
  setSelectedTask(null);
  window.location.reload();
}
//
//eliminar a tarefa
const deleteTask = async ( selectedtask ) => {
  try {
    const token = await getToken();
    const response = await axios.post('https://hubo.pt:3001/update_task_state', {
      id_task: selectedTask.task.id_task,
      state_task: 4,
    },
     {
        headers: { Authorization: `Bearer ${token}` },
      });
    console.log(response.data.message); 
  } catch (error) {
    console.error(error);
  }
  setSelectedTask(null);
  window.location.reload();
}
//
//
//pop-up info da tarefa
const handleTaskClick = async (task) => {
  const token = localStorage.getItem("token");
    setSelectedTask(task); 
    setIsOpen(true);
};

const handleCloseModal = () => {
  setIsOpen(false);
};


 
const TaskModal = ({ task }) => {
  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>Task Description: {task.desc_task}</p>
            <p>Deadline: {format_date(task.deadline_task)}</p>
            <button
              style={{ cursor: "pointer", backgroundColor: "gray" }}
              onClick={handleCloseModal}
            >
              Close
            </button>
           
            {selectedTask.permission == "2" && selectedTask.task.state_task != "2" && (
              <button onClick={setAsdoneTask}>Set as done</button>
            )}
            {selectedTask.permission == "3" && selectedTask.task.state_task != "2" && (
              <>
                <button style={{ cursor: "pointer" }} onClick={deleteTask}>
                  Delete
                </button>
                <button style={{ cursor: "pointer" }} onClick={handleEditTaskPopUp}>
                  Edit
                </button>
                <button style={{ cursor: "pointer" }} onClick={setAsdoneTask}>
                  Set as done
                </button>
                
              </>
            )}
             {selectedTask.permission == "3" && selectedTask.task.state_task == "2" && (
               <button style={{ cursor: "pointer" }} onClick={deleteTask}>Delete</button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
//
//filtrar as tarefas por estado
const filterTasksByState = (tasks) => {
  if (selectedState === 0) {
    return tasks;
  }else if (selectedState === 3){
    return tasks.filter(task => task.task.state_task != "2" && new Date(task.task.deadline_task) < new Date());
  } else if(selectedState === 1 || selectedState === 2){
    return tasks.filter(task => task.task.state_task === selectedState);
  }
}

//
//adicionar user ao grupo
const handleAddUser = (user) => {
  setSelectedUser(user);
  addUserToGroup(user);
  setAddUserOpen(false);
};

const handleAddUserPopUp = () => {
  if (nonGroupUsers.length === 0) {
    alert("No users available to add");
    return;
  }
  setAddUserOpen(true);
};



const addUserToGroup = async (user) => {
  try {
    const token = await getToken();
    if (!user || !user.id_user) {
      throw new Error('No user selected.');
    }
    await axios.post(
      'https://hubo.pt:3001/add_user_to_group',
      {
        user_to_add: user.id_user,
        group_id: group.id_group,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchNonGroupUsers();
    setSelectedUser(null);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};
//
 //users que não estão no grupo
  const fetchNonGroupUsers = async () => {
    try {
      const token = await getToken();
      const response = await axios.post('https://hubo.pt:3001/non_group_users', {
        id_group: group.id_group
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNonGroupUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };
//
// users do grupo
  const fetchGroupUsers = async () => {
    try {
      const token = await getToken();
      const response = await axios.post('https://hubo.pt:3001/group_users', {
      id_group: group.id_group
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groupUsers = response.data.users;
      setGroupUsers(groupUsers);
    } catch (error) {
      console.error(error);
    }
  };
//

//atualizar users 
  useEffect(() => {
    isUserInGroup();
    fetchNonGroupUsers();   
    fetchGroupUsers();
  }, [group]);
  //
  
//mostrar as tarefas do grupo
useEffect(() => {
  const fetchTasksByGroup = async () => {
    try {
      const res = await fetch("https://hubo.pt:3001/tasks_by_group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id_group: group.id_group,
        }),
      });
      const data = await res.json();

      setTasks(data);

    } catch (err) {
      console.error(err);
    }
  };
  fetchTasksByGroup();
}, []);
//pop-up das funcionalidades de ficheiros
const handleFilesPopUp = () => {
  setFilesOpen(true);
 }
 //
//fazer updload de ficheiros
const handleUploadFilesPopUp= () => {
  setFilesOpen(false);
  setUploadFiles(true);
  
}
function FileUploader() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    console.log(file);
    console.log(fileName);
  };

  const handleUpload = async () => {
    const instance_file = axios.create();
    instance_file.interceptors.request.use(
        async (config) => {
            const token = await localStorage.getItem('token'); 
            if (token) {
                config.headers.authorization = `Bearer ${token}`; 
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
    try {
      const formData = new FormData();
      formData.append('file', file, fileName);
      const response = await instance_file.post(
        `https://hubo.pt:3001/upload_file?id_group=${group.id_group}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setFile(null);
      setFileName('');
      alert('File added successfully!');
      {setUploadFiles(false)};
    } catch (error) {
      alert('Error! Check if the file you want to upload is not already there!');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button  style={{ cursor: "pointer" , marginLeft: "8px"}} onClick={handleUpload}>Upload File</button>
      <button style={{ cursor: "pointer" }} onClick={() => {setUploadFiles(false) ; setFilesOpen(true);}}>Back</button>
    </div>
  );
}
//
//lista de ficheiros download e apagar
const handleFilesListPopUp = async () => {
  setIdGroup(id_group);
  setFilesOpen(false);
  setFilesList(true);

  try {
    const response = await axios.post("https://hubo.pt:3001/files_list", { id_group: group.id_group }, {
      
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setFiles(response.data.files);
  } catch (error) {
    console.error(error);
  }
};

const handleDelete = async (fileName) => {
  const instance_delete = axios.create();
  instance_delete.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem('token'); 
        if (token) {
            config.headers.authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => Promise.reject(error)
);

  try {
    const response = await instance_delete.post(
      'https://hubo.pt:3001/delete_file',
      {
        id_group: group.id_group,
        file_name: fileName
      }
    );
    alert("File successfully deleted!")
    try {
      const response = await axios.post("https://hubo.pt:3001/files_list", { id_group: group.id_group }, {
        
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setFiles(response.data.files);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    alert("An error as happened!");
  }
};

function FileList({ files }) {
  
  return (
    <div className="modal2">
      <div className="modal-content2">
        <h2>List of Files</h2>
        <div>
          {files.map((file) => (
            <li style={{ listStyle: 'none' , margintop : "20px"  }} key={file.name}>
              <a  style={{ marginRight : "8px" }}href={`https://hubo.pt:3001/download_file?id_group=${group.id_group}&file_name=${file.name}`}>
                {file.name}
              </a>
              <a style={{ cursor: "pointer", color: "red"}} onClick={() => handleDelete(file.name)}>Erase</a>
            </li>
          ))}
        </div>
        <button
          style={{ cursor: "pointer", marginLeft: "5px", marginTop: "20px ", background: "gray" }}
          onClick={() => setFilesList(false)}>Close</button>
      </div>
    </div>
  );
}
//
//informções do grupo
const handleGroupInfoPopUp = () => {
  setGroupInfo(true);
}
//

  if (!group) {
    return <Layout><p>Loading...</p></Layout>;        //se o grupo ainda nao estiver definido ou não existir dar return de um loading
  }
  //renderização do front-end tudo o que o utilizador vai ver com os respetivos pop-ups 
  return (
    <Layout>
      <h1>{group.name_group}</h1>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', justifyContent: 'flex-end', width: '500px' }}>
        <div style={{ marginRight: '10px' }}>
          <button onClick={handleCreateTaskPopUp} style={{ cursor: "pointer", backgroundColor: '#285E89', color: 'white', borderRadius: '50px', padding: '10px 20px', fontSize: '16px' }}>Create Task</button>
        </div>
        <div style={{ marginRight: '10px' }}>
          <button onClick={handleAddUserPopUp} style={{ cursor: "pointer", backgroundColor: '#285E89', color: 'white', borderRadius: '50px', padding: '10px 20px', fontSize: '16px' }}>Add User</button>
        </div>
        <div style={{ marginRight: '10px' }}>
          <button onClick={handleFilesPopUp} style={{ cursor: "pointer", backgroundColor: '#285E89', color: 'white', borderRadius: '50px', padding: '10px 20px', fontSize: '16px' }}>Files</button>
        </div>
        <div style={{ marginRight: '10px' }}>
          <button onClick={handleGroupInfoPopUp} style={{ cursor: "pointer", backgroundColor: '#285E89', color: 'white', borderRadius: '50px', padding: '10px 20px', fontSize: '16px' }}>Group Info</button>
        </div>
      </div>

      
    
      <select value={selectedState} onChange={e => setSelectedState(Number(e.target.value))}>   
        <option value={0}>All</option>
        <option value={1}>On going tasks</option>
        <option value={2}>Completed tasks</option>
        <option value={3}>Delayed tasks</option>
      </select>

      {addUserOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setAddUserOpen(false)}>&times;</span>
            <h2>Add user</h2>
            <div>
              {
              nonGroupUsers.map((user) => (
                <div key={user.id_user}>
                  <p>
                      {user.username} 
                      <button style={{ cursor: "pointer" }} onClick={() => handleAddUser(user)}>ADD</button> 
                  </p> 
                </div>
              ))
              }
            </div>

          </div>
        </div>
      )}
      {editTaskOpen && (
         <div className="modal2">
          <div className="modal-content2">
          <h2>Edit task</h2><br/>
                <form onSubmit={handleEditTask}>
                <div>
                    <input
                      type="text"
                      id="desc_task"
                      placeholder="Task Description"
                      value={editDescTask}
                      onChange={(e)=>setEditDescTask(e.target.value)}
                      />
                  </div>
                  <div>
                    <label htmlFor="deadline_task">Deadline</label>
                    <input
                      type="date"
                      id="deadline_task"
                      placeholder="Due date (dd/mm/yyyy)"
                      value={editDeadline}
                      onChange={(e)=>setEditDeadline(e.target.value)}
                      />
                  </div> 
                 
                  <button  style={{ cursor: 'pointer' , marginLeft: '5px', background: 'gray' }}  onClick={() => {setEditTaskOpen(false); setDeskTask(''); setDeadline(null); setErrorMessage('')}}>Close</button>
                  <button  style={{ cursor: 'pointer' }} type="submit" onClick={handleEditTask}>Edit</button><br/><br/>
                  {errorMessage && <p className="error_message">{errorMessage}</p>}
                </form>
          </div>
         </div>
      )}
      {createTaskOpen && (
        <div className="modal2">
            <div className="modal-content2">
                <span className="close" onClick={()=> setCreateTaskOpen(false)}>&times;</span>
                <h2>Create Task</h2><br/>
                <form onSubmit={handleCreateTask}>
                <div>
                    <input
                      type="text"
                      id="desc_task"
                      placeholder="Task Description"
                      value={desc_task}
                      onChange={(e)=>setDeskTask(e.target.value)}
                      />
                  </div>
                  <div>
                      <label htmlFor="assigned_user">Assigned user</label><br/>
                      <select
                        id="assigned_user"
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}>
                        <option value="">Select a user</option>
                        {groupUsers.map((user) => (
                          <option key={user.id_user} value={user.id_user}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                  </div><br/>
                  <div>
                      <label htmlFor="assigned_user_perm">Assigned user permission</label><br/>
                      <select
                        id="assigned_user_perm"
                        value={assignedUserPerm}
                        onChange={(e)=> setAssignedUserPerm(e.target.value)} >
                        <option value="">Select a user permission</option>
                        <option value="2">Set as done</option>
                        <option value="3">Edit and delete</option>
                      </select><br/>
                  </div><br/>
                  <div>
                    <label htmlFor="deadline_task">Deadline</label>
                    <input
                      type="date"
                      id="deadline_task"
                      placeholder="Due date (dd/mm/yyyy)"
                      value={deadline}
                      onChange={(e)=>setDeadline(e.target.value)}
                      />
                  </div>
                <button  style={{ cursor: 'pointer' , marginLeft: '5px', background: 'gray' }}  onClick={() => {setCreateTaskOpen(false); setErrorMessage('');}}>Close</button>
                <button  style={{ cursor: 'pointer'  }} type="submit" onClick={handleCreateTask}>Create</button><br/><br/><br/>
                {errorMessage && <p className="error_message">{errorMessage}</p>}
                </form>
            </div>
        </div>
      )} 
      {filesopen && (
        <div className="modal2">
          <div className="modal-content2">
            <div>
                <button  style={{ cursor: 'pointer' , marginLeft: '5px', background: 'gray' }}  onClick={() => setFilesOpen(false)} >Close</button>
                <button  style={{ cursor: 'pointer', marginLeft: '12px', marginRight: '12px' }} onClick={handleUploadFilesPopUp}>Upload a file</button>
                <button  style={{ cursor: 'pointer' }} onClick={handleFilesListPopUp}>Files List</button>
               
            </div>
          </div>  
        </div>
      )}
      {uploadFiles && (
        <div className="modal2">
          <div className="modal-content2">
            <FileUploader/>
          </div>
        </div>
        
      )}
      {filesList && <FileList files={files} id_group={id_group}/>}

      {groupInfo && (
        <div className="modal2">
        <div className="modal-content2">
          <h2>Group Info</h2>
          <span className="close" onClick={()=> setGroupInfo(false)}>&times;</span>
          <p>Group name: {group.name_group } </p><br/>
          <p>Group description: {group.desc_group} </p><br/>
          <p>Group users: <br /><br />{groupUsers.map((user, index) => (<span key={user._id}>{user.username}{index === groupUsers.length - 1 ? '' : ','}<br /></span>))}</p>
        </div>
      </div>
      )}
      <div>
      

{filterTasksByState(tasks).map(task => {
  const comparisonDate = new Date(new Date(task.task.deadline_task).toISOString());
  const currentDate = new Date();
  var classToApply;
  const isPastDeadline = comparisonDate < currentDate;

  if (isPastDeadline && task.task.state_task != 2){
    classToApply = "state-3"
  }else if(task.task.state_task == 1){
    classToApply = "state-1"
  }else if(task.task.state_task == 2){
    classToApply = "state-2"
  }


  return (
    <div
      key={task.task.id_task}
      className={`task ${classToApply}`}
      onClick={() => handleTaskClick(task)}
      style={{
        backgroundColor: "white",
        padding: "20px",
        margin: "20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        cursor: 'pointer'
      }}
    >
      <p>{task.task.desc_task}</p>
    </div>
  );
})}
      
      {selectedTask && <TaskModal task={selectedTask.task}/>}
    </div>
    </Layout>
  );
}
//renderização do servidor para obter as informações do grupo antes da página dar load
export async function getServerSideProps({ params, req }) {
  const { id } = params;
  const token = await getToken(); 

  try {
    const response = await axios.get(`https://hubo.pt:3001/group/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { props: { group: response.data } };
  } catch (error) {
    console.error(error);
    return { props: {} };
  }
}
