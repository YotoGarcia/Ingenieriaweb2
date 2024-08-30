const {
    log
} = require('console');
const mongoose = require('mongoose');

const getConection = async () => {

    try {
        const url = 'mongodb+srv://webdb:9nTljZG1NECV3iJr@cluster0.80l3q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

        await mongoose.connect(url);
        console.log('conexion exitosa')

    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    getConection
}