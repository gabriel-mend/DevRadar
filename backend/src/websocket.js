const socketio = require('socket.io')
const parseStringAsArray = require('./Utils/parseStringAsArray')
const calculateDistance = require('./Utils/calculateDistance')

let io
const connectons = []

exports.setupWebsocket = (server) => {
    io = socketio(server)

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query
        connectons.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: parseStringAsArray(techs)
        })
    })
}
exports.findConnections = (coordinates, techs) => {
    return connectons.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)
    })
}