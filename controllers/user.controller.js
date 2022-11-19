exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.privateAccess = (req, res) => {
    res.status(200).send("Private Content.");
};