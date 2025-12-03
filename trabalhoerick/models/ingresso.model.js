const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Sessao = require("./sessao.model");

const Ingresso = db.define("Ingresso", {
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

// RELACIONAMENTO
Sessao.hasMany(Ingresso);
Ingresso.belongsTo(Sessao);

module.exports = Ingresso;