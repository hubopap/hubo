const express = require("express");
const Sequelize = require('sequelize');
const { DataTypes,  Op } = require('sequelize');
const sequelize = require('./db');
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require('./models/user');
const Group = require('./models/group');
const Task = require('./models/task');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

/*---------------------------------------------------------------------------------*/ 
/*                        Funções relativas à base de dados                        */ 
/*---------------------------------------------------------------------------------*/ 

// definição das tabelas de relação
const UserGroup = sequelize.define('UserGroup', {}, {timestamps: true});
const GroupTask = sequelize.define('GroupTask', {}, {timestamps: true});
const UserTask = sequelize.define('UserTask', {permission: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1}}, {timestamps: false});
  
//definição das relações entre as tabelas
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });
Group.belongsToMany(Task, { through: GroupTask });
Task.belongsToMany(Group, { through: GroupTask });
User.belongsToMany(Task, { through: UserTask });
Task.belongsToMany(User, { through: UserTask });
  
//Configurações da Base de Dados e Reset das Tabelas
sequelize.sync().then(() => {
    console.log('Tabelas criadas com sucesso.');
}).catch((error) => {
    console.error('Erro ao criar tabelas:', error);
});

/*---------------------------------------------------------------------------------*/ 
/*                          Funções relativas ao servidor                          */ 
/*---------------------------------------------------------------------------------*/ 

//Configurações do express e do servidor da API
const app = express();
app.listen(3001, () => {
    console.log('api iniciada em http://hubo.pt:3001');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    methods: ["GET", "POST"],
    credentials: true
}));


/*---------------------------------------------------------------------------------*/ 
/*                          Funções relativas a ficheiros                          */ 
/*---------------------------------------------------------------------------------*/ 

//Função Para upload de ficheiros
app.post('/upload_file', authenticateToken, async (req, res) => {
    let { id_group } = req.query;
    const uploadFolder = path.join(__dirname, '../../uploads', id_group.toString());

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            fs.mkdirSync(uploadFolder, { recursive: true });
            cb(null, uploadFolder);
        },
        filename: (req, file, cb) => {
            const fileName = file.originalname;
            const filePath = path.join(uploadFolder, fileName);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    cb(null, fileName);
                } else {
                    cb(new Error(`File ${fileName} already exists`));
                }
            });
        }
    });

    const upload = multer({ storage: storage }).single('file');

    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send(err.message);
        } else {
            res.send({message:'File uploaded successfully'});
        }
    });
});
  
//Função Para listar ficheiros
app.post('/files_list', authenticateToken, (req, res) => {
const id_group = req.body.id_group;
const groupFolder = path.join(__dirname, '../../uploads', id_group.toString());

fs.readdir(groupFolder, (err, files) => {
    if (err) {
    console.error(err);
    res.status(500).send({message:'Failed to read files in group folder'});
    } else {
    const fileNames = files.map((file) => ({ name: file.toString() }));
    res.send({ files: fileNames });
    }
});
});

//Função Para fazer download de ficheiros
app.get('/download_file', async (req, res) => {
    const { id_group, file_name } = req.query;
    const filePath = path.join(__dirname, '../../uploads', id_group.toString(), file_name.toString());
    try {
        if (fs.existsSync(filePath)) {
        res.download(filePath);
        } else {
        res.status(404).send({message:'File not found'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({message:'Failed to download file'});
    }
});

//Função para fazer download da APK
app.get('/download_apk', async (req, res) => {
    const filePath = path.join(__dirname, '../../build/hubo.apk');
    try {
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).send({message:'File not found'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({message:'Failed to download file'});
    }
});

//Função Para eliminar ficheiros
app.post('/delete_file', authenticateToken, async (req, res) => {
    const { id_group, file_name } = req.body;
    const filePath = path.join(__dirname, '../../uploads', id_group.toString(), file_name.toString());
    try {
        if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send({message:'File deleted successfully'});
        } else {
        res.status(404).send({message: 'File not found'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({message:'Failed to delete file'});
    }
});
  

/*---------------------------------------------------------------------------------*/ 
/*                         Funções relativas a autenticação                        */
/*---------------------------------------------------------------------------------*/ 

//Função de Register de Utilizadores
app.post("/register", async (req, res)=>{

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;


    try {
        const findUser = await User.findOne({where: {username: username}});
        if (findUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            password: hashedPassword,
            email_user: email,
        });

        const token = jwt.sign({ id: newUser.id }, "secretkey");

        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Função de Login de Utilizadores
app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await User.findOne({where: {username: username}});
    if(findUser === null) {
        console.log("null");
        res.status(401).send({message: "User does not exist!"});
    } else {
        const compare = await bcrypt.compare(password, findUser.password);
        if(compare) {
            const token = jwt.sign({ userId: findUser.id_user }, "secretkey", { expiresIn: "100y" });
            res.send({ message: "Login feito com sucesso", token });
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    }
});

//Atribuição do Token de Login
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


/*---------------------------------------------------------------------------------*/ 
/*                         Funções relativas a utilizadores                        */
/*---------------------------------------------------------------------------------*/ 

//Função para ir buscar dados do user que está a usar a app
app.get("/userdata", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);
    if(user) {
        res.status(201).send({loggedIn: true, user: user})
    } else {
        res.status(401).send({ message: "User not found" });
    }
});

//Função para ir buscar dados do user baseados na route dinâmica
app.get('/user/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ where: { username: username } });
      console.log(user);
      if (user) {
        res.status(200).json(user.toJSON()); // return user data as JSON
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
});

//Função para alterar a Biografia de um utilizador
app.post("/update_bio", authenticateToken, async (req, res)=>{
    const userId = req.user.userId;
    const bio = req.body.bio_user;
    console.log(userId, bio);
    User.update(
        {
            bio_user: bio
        },
        {
            where: {id_user: userId}
        }
    ).then(() => {
        res.status(201).send({message: "bio updated successfully!"});
    }).catch((error) => {
        res.status(401).send({message: error});
    })
});

//Função para ir buscar um utilizador pedido no request
app.post("/user_details", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const query_user = req.body.user_query;
    const user = await User.findByPk(query_user);
  
    if (!user){
        res.status(201).send ({message: "user does not exist"});
    }else if(user.id_user == userId){
        res.status(201).send ({editable: true, user:user});
    }else{
        res.status(201).send ({editable: false, user:user});
    }
});

//Função que devolve todos os utilizadores da App
app.get("/users", authenticateToken, async (req, res) => {
    const users = await User.findAll({
        attributes: ['id_user', 'username'],
        raw: true
    });
    res.status(201).send(users);
});

//Função que devolve os grupos em que o utilizador está
app.get("/groups_by_user", authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }

        const groups = await user.getGroups({
            attributes: ["id_group", "name_group", "desc_group", "createdAt", "updatedAt"],
            joinTableAttributes: []
        });
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


/*---------------------------------------------------------------------------------*/ 
/*                            Funções relativas a grupos                           */
/*---------------------------------------------------------------------------------*/ 

//Função para ir buscar dados do grupo baseados na route dinâmica
app.get("/group/:id", async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            attributes: ["id_group", "name_group", "desc_group", "createdAt", "updatedAt"],
        });
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }
        res.json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Função para criar um grupo
app.post('/create_group', authenticateToken, async (req, res) => {

    const name_group = req.body.name_group;
    const desc_group = req.body.desc_group;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const group = await Group.create({
            name_group,
            desc_group
        });

        await user.addGroup(group);

        res.status(201).send(group);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Something went wrong' });
    }
    
});

//Função para ver os utilizadores de um grupo
app.post("/group_users", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const groupId = req.body.id_group;

    try {
        const group = await Group.findByPk(groupId, {
            include: [{
                model: User,
                attributes: ['id_user','username'],
                through: {
                    attributes: []
                }
            }]
        });
        if (!group) {
            return res.status(404).send({ error: 'Group not found' });
        }
        const users = group.Users;
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Função para ver os utilizadores que não pertencem a um determinado grupo
app.post("/non_group_users", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const groupId = req.body.id_group;
    try {
        const group = await Group.findByPk(groupId, {
            include: [{
                model: User,
                attributes: ['id_user','username'],
                through: {
                    attributes: []
                }
            }]
        });
        if (!group) {
            return res.status(404).send({ error: 'Group not found' });
        }
        const groupUserIds = group.Users.map(user => user.id_user);
        const allUsers = await User.findAll({
            attributes: ['id_user','username'],
            where: {
                id_user: { [Op.notIn]: groupUserIds }
            }
        });
        res.status(200).json({ users: allUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
  
//Função para adicionar um utilizador a um determinado grupo
app.post('/add_user_to_group', authenticateToken, async (req, res) => {

    const user_to_add = req.body.user_to_add;
    const groupId = req.body.group_id;

    try {
        const user = await User.findByPk(user_to_add);
        const group = await Group.findByPk(groupId);

        if (!user || !group) {
            return res.status(404).send({ error: 'User or Group not found' });
        }

        await user.addGroup(group);

        const tasks = await group.getTasks();

        for (let task of tasks) {
            await user.addTask(task, { through: { permission: 1 } });
        }

        res.status(200).send({ message: 'User added to group and linked to tasks' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

/*---------------------------------------------------------------------------------*/ 
/*                            Funções relativas a tarefas                          */
/*---------------------------------------------------------------------------------*/ 

//Função para criar tasks
app.post("/create_task", authenticateToken, async (req, res) => {
    try {
        const { deadline_task, assigned_user, assigned_user_perm, id_group, desc_task} = req.body;

        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const group = await Group.findByPk(id_group);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const assignedUser = await User.findByPk(assigned_user);
        if (!assignedUser) {
            return res.status(404).json({ error: "Assigned user not found" });
        }

        const task = await Task.create({
            desc_task: desc_task,
            deadline_task: new Date(deadline_task),
            state_task: 1,
        });

        await group.addTask(task, { through: { permission: 3 } });
        await user.addTask(task, { through: { permission: 3 } });

        await assignedUser.addTask(task, { through: { permission: assigned_user_perm } });
        

        const excludedUsers = [assigned_user, req.user.userId];
        const groupUsers = await group.getUsers({ where: { id_user: {[Op.notIn]: excludedUsers}}});
        for (const groupUser of groupUsers) {
            await groupUser.addTask(task, { through: { permission: 1 } });
        }

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
  
//Função para ver as tasks de um grupo
app.post("/tasks_by_group", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const id_group = req.body.id_group;
  
    try {
      const tasks = await Task.findAll({
        where: {
          state_task: {
            [Op.ne]: 4 // "ne" means "not equal to"
          }
        },
        include: [
          {
            model: Group,
            where: { id_group },
            attributes: []
          }
        ]
      });
  
      const taskPermissions = await Promise.all(
        tasks.map(async (task) => {
          const userTask = await UserTask.findOne({
            where: { UserIdUser: userId, TaskIdTask: task.id_task }
          });
  
          const permission = userTask ? userTask.permission : 0;
          return { task, permission };
        })
      );
        console.log(taskPermissions);
      res.send(taskPermissions);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
});
  
//Função para ver a informação detalhada de uma task
app.post("/task_info", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const id_task = req.body.id_task;

    try {
        const task = await Task.findOne({
            where:{
                id_task:id_task
            }
        });
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

});

//Função para alterar o estado de uma task
app.post("/update_task_state", authenticateToken, async (req, res) => {
    const id_task = req.body.id_task;
    const state_task = req.body.state_task;
    try {
      const task = await Task.update(
        {
          state_task: state_task
        },
        {
          where: {
            id_task: id_task
          }
        }
      );
      console.log('Task:', task);
      if(!task){
        res.status(404).send({message: "Task not found"});
      }else{
        res.status(201).send({message: "Task updated successfully"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

//Função para alterar dados da task, nomeadamente o prazo ou a descrição
app.post("/update_task_info", authenticateToken, async (req, res) => {
    const id_task = req.body.id_task;
    const deadline_task = req.body.deadline_task;
    const desc_task = req.body.desc_task;
    try {
        const task = await Task.update(
            {
                deadline_task: deadline_task,
                desc_task: desc_task
            },
            {
                where: {
                    id_task: id_task
                }
            }
        );
        if(!task){
            res.status(404).send({message: "Task not found"});
        }else{
            res.status(201).send({message: "Task updated successfully"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});