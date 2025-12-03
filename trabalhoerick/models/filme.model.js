const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Filme = db.define("Filme", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Filme;