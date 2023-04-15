const Sequelize = require("sequelize");

//definição da base de dados
const myDB = new Sequelize(
    "hubo", 
    "admin", 
    "admin123", 
    {
        dialect: 'mariadb',
        define: {
          charSet: 'utf8mb4', // definir charset para utf8mb4
          collate: 'utf8mb4_general_ci',
        },
        host: 'localhost',
        logging: false
    }
);

module.exports = myDB;