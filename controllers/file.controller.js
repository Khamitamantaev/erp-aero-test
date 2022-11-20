const path = require('path')
const db = require("../models");
const fs = require('fs');
const { file: File } = db;
exports.upload = async (req, res) => {
    console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    try {
        let sampleFile = req.files.simple;
        let resource = path.join(__dirname, '..', 'resources')
    
        const mainpath = path.join(resource, sampleFile.name)
    
        if (!fs.existsSync(resource)) {
            fs.mkdirSync(resource);
        }
    
        const words = sampleFile.name.split('.');
        const [expansion] = words.slice(-1)
        await File.create({
            title: sampleFile.name.slice(0, sampleFile.name.lastIndexOf(".")),
            expansion: expansion,
            mimeType: sampleFile.mimetype,
            size: sampleFile.size,
            downloadAt: new Date()
        })
        sampleFile.mv(mainpath);
        res.send('File uploaded!');
    } catch(err) {
        return res.status(500).send(err);
    }
};

exports.list = (req, res) => {
    res.status(200).send("List");
}

exports.deleteById = (req, res) => {
    res.status(200).send("Delete by ID");
};