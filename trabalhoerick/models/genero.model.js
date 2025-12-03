const { Model, DataTypes } = require('sequelize');
const db = require('../config/database');

class Genero extends Model {}

Genero.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  modelName: 'Genero'
});

module.exports = Genero;
