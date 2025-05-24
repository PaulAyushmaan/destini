const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    console.log(distanceTime);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



const fare = {
    auto: Math.round(baseFare.auto + (distanceTime.distance * perKmRate.auto) + (distanceTime.duration * perMinuteRate.auto)),
    car: Math.round(baseFare.car + (distanceTime.distance * perKmRate.car) + (distanceTime.duration * perMinuteRate.car)),
    moto: Math.round(baseFare.moto + (distanceTime.distance * perKmRate.moto) + (distanceTime.duration * perMinuteRate.moto))
};

    console.log(fare);

    return fare;


}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);



    const ride = await rideModel.create({
        ...(user ? { user } : {}),
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    });

    return ride;
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    console.log('Starting ride with ID:', rideId);
    console.log('OTP provided:', otp);

    // First find the ride without any conditions
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    console.log('Found ride:', {
        id: ride._id,
        status: ride.status,
        otp: ride.otp,
        storedOtp: ride.otp
    });

    // Check if ride is already ongoing
    if (ride.status === 'ongoing') {
        throw new Error('Ride is already ongoing');
    }

    // Check if ride is in a valid state to start
    if (ride.status !== 'accepted' && ride.status !== 'pending') {
        console.log('Invalid ride status:', ride.status);
        throw new Error(`Cannot start ride in ${ride.status} status`);
    }

    if (!ride.otp) {
        console.log('No OTP found in ride data');
        throw new Error('No OTP found for this ride');
    }

    if (ride.otp !== otp) {
        console.log('OTP mismatch:', { provided: otp, stored: ride.otp });
        throw new Error('Invalid OTP');
    }

    try {
        // Update the ride status to ongoing
        const updatedRide = await rideModel.findOneAndUpdate(
            { _id: rideId },
            { $set: { status: 'ongoing' } },
            { new: true }
        ).populate('user').populate('captain').select('+otp');

        if (!updatedRide) {
            throw new Error('Failed to update ride status');
        }

        console.log('Updated ride status:', updatedRide.status);
        return updatedRide;
    } catch (error) {
        console.error('Error updating ride status:', error);
        throw new Error('Failed to update ride status');
    }
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}

