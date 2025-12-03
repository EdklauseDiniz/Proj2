const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Ator = db.define("Ator", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Ator;