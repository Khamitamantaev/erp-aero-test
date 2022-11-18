const express = require("express");
const cors = require("cors");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

var corsOptions = {
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
        where: { username: 'khamitamantaev' },
        defaults: {
            username: 'khamitamantaev',
            password: '123321',
            email: 'khamitamantaev@gmail.com'
        }
    });
    console.log('created or find user with username: ', user.username)
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to erp-aero test application." });
});

// CHECK PORT .ENV
console.log(process.env.PORT)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});