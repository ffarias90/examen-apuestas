const Sequelize = require('sequelize');


// acá creamos la conexión a la Base de Datos
const sql = new Sequelize('examen_apuestas', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});

// acá inicializamos los modelos (tablas)
const User = sql.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar un nombre'
            },
            len: {
                args: [2],
                msg: 'El nombre debe ser de largo al menos 2'
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar un email'
            },
            len: {
                args: [3],
                msg: 'El email debe ser de largo al menos 3'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar una contraseña'
            },
            len: {
                args: [3],
                msg: 'La contraseña debe ser de largo al menos 3'
            },
        }
    },
});

const Bid = sql.define('Bid', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product: {
        type: Sequelize.INTEGER,
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar una apuesta'
            },
            len: {
                args: [3],
                msg: 'la apuesta no debe estar vacia'
            }
        }
    }
});

User.hasMany(Bid);
Bid.belongsTo(User);

//  después sincronizamos nuestro código con la base de datos
sql.sync()
    .then(() => {
        console.log('Base de datos y tablas creadas (SI NO EXISTEN)');
    });


// finalmente acá listamos todos los modelos que queremos exportar
module.exports = {
    User,
    Bid
};