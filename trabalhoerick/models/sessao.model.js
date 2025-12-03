const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Filme = require("./filme.model");

const Sessao = db.define("Sessao", {
    dataHora: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// RELACIONAMENTO
Filme.hasMany(Sessao);
Sessao.belongsTo(Filme);

module.exports = Sessao;