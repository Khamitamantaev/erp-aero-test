const path = require('path')
const db = require("../models");
const fs = require('fs');
const { file: File } = db;
exports.upload = async (req, res) => {
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
        const findFile = await File.findOne({ where: { title: sampleFile.name.slice(0, sampleFile.name.lastIndexOf(".")) } })
        if (!findFile) {
            await File.create({
                title: sampleFile.name.slice(0, sampleFile.name.lastIndexOf(".")),
                expansion: expansion,
                mimeType: sampleFile.mimetype,
                size: sampleFile.size,
                downloadAt: new Date()
            })
            sampleFile.mv(mainpath);
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send('File uploaded!')
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.status(403).send(`File with name: ${findFile.title} already exist!`)
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

exports.list = async (req, res) => {
    const getPagination = (page, size) => {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;

        return { limit, offset };
    };

    const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: files } = data;
        const currentPage = page ? + page : 0;
        const totalPages = Math.ceil(totalItems / limit);
      
        return { totalItems, files, totalPages, currentPage };
      };

    const { page, list_size, title } = req.query;
    let haveCondition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, list_size);

    File.findAndCountAll({ where: haveCondition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}

exports.deleteById = async (req, res) => {
    const file = await File.findOne({ where: { id: req.params.id } })
    if (!file) {
        res.status(404).send(`Not found file with id: ${req.params.id}`);
    } else {
        let resource = path.join(__dirname, '..', 'resources')
        await File.destroy({ where: { id: file.id } })
        fs.unlink(path.join(resource, file.title + '.' + file.expansion), function (err) {
            if (err) {
                throw err
            }
        })
        res.status(200).send("Delete by ID");
    }
};