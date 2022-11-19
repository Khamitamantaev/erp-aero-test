const express = require("express");
const cors = require("cors");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const bcrypt = require("bcryptjs");
const app = express();

let corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const User = db.user;

db.sequelize.sync({ force: true }).then(() => {
    console.log('Dropped User');
    init();
});

async function init() {
    const [user, created] = await User.findOrCreate({
        where: { id: 'khamitamantaev' },
        defaults: {
            id: 'khamitamantaev',
            password: bcrypt.hashSync(process.env.USER_PASSWORD, 8)
        }
    });
    console.log('created or find user with id: ', user.id)
}

//routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// CHECK PORT .ENV
console.log(process.env.PORT)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});