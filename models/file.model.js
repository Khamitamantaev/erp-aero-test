const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("files", {
        title: {
            type: Sequelize.STRING,
        },
        expansion: {
            type: Sequelize.STRING
        },
        mimeType: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.INTEGER
        },
        downloadAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return File;
};