exports.upload = (req, res) => {
    res.status(200).send("upload");
};

exports.list = (req, res) => {
    res.status(200).send("List");
};

exports.deleteById = (req, res) => {
    res.status(200).send("Delete by ID");
};