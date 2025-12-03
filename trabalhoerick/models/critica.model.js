const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Filme = require("./filme.model");

const Critica = db.define("Critica", {
    autor: {
        type: DataTypes.STRING,
        allowNull: false
    },

    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    nota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 10
        }
    }
});

// RELACIONAMENTO
Filme.hasMany(Critica);
Critica.belongsTo(Filme);

module.exports = Critica;
