const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname,phone, email, password, color, plate, capacity, vehicleType, isActive, status
}) => {
    if (!firstname || !email ||!phone || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        phone,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
        isActive: isActive || true,
        status: status || 'available'
    })

    return captain;
}

// New function to update captain's socket ID
module.exports.updateSocketId = async (captainId, socketId) => {
    const captain = await captainModel.findByIdAndUpdate(
        captainId,
        { socketId },
        { new: true }
    );
    return captain;
}

// New function to update captain's status
module.exports.updateStatus = async (captainId, status) => {
    const captain = await captainModel.findByIdAndUpdate(
        captainId,
        { status },
        { new: true }
    );
    return captain;
}