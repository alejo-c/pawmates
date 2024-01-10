import { DataTypes } from 'sequelize'
import { db } from '../database/config.db.js'

export const Breed = db.define('breed', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

export const getBreedById = id => Breed.findByPk(id)