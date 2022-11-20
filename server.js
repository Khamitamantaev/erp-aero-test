const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require('path')
const fs = require('fs')
const session = require('express-session')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const bcrypt = require("bcryptjs");
const app = express();

let corsOptions = {
    origin: "http://localhost:8081"
};
app.use(fileUpload())
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
const db = require("./models");
const User = db.user;
const File = db.file;

db.sequelize.sync({ force: true }).then(() => {
    init();
});

async function init() {
    await User.findOrCreate({
        where: { id: 'khamitamantaev' },
        defaults: {
            id: 'khamitamantaev',
            password: bcrypt.hashSync(process.env.USER_PASSWORD, 8)
        }
    });

    await File.bulkCreate([
        { title: 'Jack', expansion: 'mp3', mimeType: 'audio/mpeg', downloadAt: new Date(), size: 99223 },
    ]);

    let resources = path.join(__dirname, 'resources')
    const filesFDB = await File.findAll()
    fs.readdir(resources, (err, files) => {
        if (err) throw err;
        
        for (const filew of files) {
            const fileName = filesFDB.find(file => file.title === filew.slice(0, filew.lastIndexOf(".")))
            if(!fileName) {
                fs.unlink(path.join(resources, filew), (err) => {
                    if (err) throw err;
                });
            }
        }
    });

    if (!fs.existsSync(resources)) {
        fs.mkdirSync(resources);
    }

    if (fs.existsSync('resources')) {
        const filepath = path.join(__dirname, 'resources', 'Jack.mp3')
        fs.writeFile(filepath, '', (err) => {
            if (err) throw err;
        });
    }
}

//routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/file.routes.js')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});