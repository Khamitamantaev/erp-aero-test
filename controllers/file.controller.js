const path = require('path')
exports.upload = (req, res) => {
    console.log(req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files uploaded.');
      }
      let sampleFile =  req.files.simple;
        //   const fulleName = sampleFile.name.slice(0, sampleFile.name.lastIndexOf("."));
      const mainpath = path.join(__dirname, '..', 'resources', sampleFile.name)
    
      sampleFile.mv(mainpath, function(err) {
        if (err)
          return res.status(500).send(err);
        res.send('File uploaded!');
      });
};

exports.list = (req, res) => {
    res.status(200).send("List");
}

exports.deleteById = (req, res) => {
    res.status(200).send("Delete by ID");
};