const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    console.log('Distance and Time:', distanceTime);

    // Base fare for each vehicle type
    const baseFare = {
        auto: 10,
        car: 30,
        moto: 15
    };

    // Per kilometer rate
    const perKmRate = {
        auto: 1,
        car: 3,
        moto: 2
    };

    // Per minute rate
    const perMinuteRate = {
        auto: 1,
        car: 2,
        moto: 1.5
    };

    // Get current time for time-based pricing
    const currentHour = new Date().getHours();
    const isNightTime = currentHour >= 22 || currentHour < 5;
    const isRushHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);

    // Time-based multipliers
    const timeMultiplier = isNightTime ? 1.5 : isRushHour ? 1.3 : 1.0;

    // Distance-based surge pricing
    const distanceMultiplier = (() => {
        if (distanceTime.distance > 20) return 1.4; // Long distance premium
        if (distanceTime.distance > 10) return 1.2; // Medium distance premium
        return 1.0; // Normal distance
    })();

    // Duration-based surge pricing
    const durationMultiplier = (() => {
        if (distanceTime.duration > 60) return 1.3; // Long duration premium
        if (distanceTime.duration > 30) return 1.15; // Medium duration premium
        return 1.0; // Normal duration
    })();

    // Calculate base fare components
    const calculateFare = (vehicleType) => {
        const base = baseFare[vehicleType];
        const distanceComponent = distanceTime.distance * perKmRate[vehicleType];
        const timeComponent = distanceTime.duration * perMinuteRate[vehicleType];

        // Apply multipliers
        const totalFare = (base + distanceComponent + timeComponent) * 
                         timeMultiplier * 
                         distanceMultiplier * 
                         durationMultiplier;

        // Add minimum fare guarantee
        const minimumFare = baseFare[vehicleType] * 1.5;
        
        // Add waiting time component (if applicable)
        const waitingTimeComponent = Math.min(distanceTime.duration * 0.5, 50); // Cap at 50 rupees

        return Math.round(Math.max(totalFare + waitingTimeComponent, minimumFare));
    };

    const fare = {
        auto: calculateFare('auto'),
        car: calculateFare('car'),
        moto: calculateFare('moto')
    };

    // Add fare breakdown for transparency
    const fareBreakdown = {
        baseFares: baseFare,
        distanceComponent: {
            auto: Math.round(distanceTime.distance * perKmRate.auto),
            car: Math.round(distanceTime.distance * perKmRate.car),
            moto: Math.round(distanceTime.distance * perKmRate.moto)
        },
        timeComponent: {
            auto: Math.round(distanceTime.duration * perMinuteRate.auto),
            car: Math.round(distanceTime.duration * perMinuteRate.car),
            moto: Math.round(distanceTime.duration * perMinuteRate.moto)
        },
        multipliers: {
            timeMultiplier,
            distanceMultiplier,
            durationMultiplier
        },
        finalFares: fare
    };

    console.log('Fare Breakdown:', fareBreakdown);
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
    try {
        // Get distance and duration
        const { distance, duration } = await mapService.getDistanceTime(pickup, destination);
        
        // Calculate fare
        const fare = await this.getFare(pickup, destination);
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Create the ride
        const ride = await rideModel.create({
            user,
            pickup,
            destination,
            vehicleType,
            fare: fare[vehicleType],
            otp,
            distance,
            duration
        });

        console.log('Created ride:', {
            id: ride._id,
            pickup,
            destination,
            vehicleType,
            fare: fare[vehicleType]
        });

        return ride;
    } catch (error) {
        console.error('Error in createRide service:', error);
        throw error;
    }
};

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

// Helper: get multiplier for schedule period
function getSchedulePeriodMultiplier(period) {
    switch (period) {
        case '15-days':
            return { multiplier: 14, discount: 0.10 }; // 14 rides, 10% off
        case '1-month':
            return { multiplier: 30, discount: 0.15 }; // 30 rides, 15% off
        case '3-months':
            return { multiplier: 90, discount: 0.20 }; // 90 rides, 20% off
        case '6-months':
            return { multiplier: 180, discount: 0.25 }; // 180 rides, 25% off
        case '1-year':
            return { multiplier: 365, discount: 0.30 }; // 365 rides, 30% off
        default:
            return { multiplier: 1, discount: 0 };
    }
}

module.exports.scheduleRide = async ({ user, pickup, destination, vehicleType, scheduleStartDate, schedulePeriod }) => {
    try {
        // Get distance and duration
        const { distance, duration } = await mapService.getDistanceTime(pickup, destination);
        // Calculate base fare
        const fareObj = await module.exports.getFare(pickup, destination);
        let fare = fareObj[vehicleType];
        // Apply schedule period multiplier and discount
        const { multiplier, discount } = getSchedulePeriodMultiplier(schedulePeriod);
        let totalFare = fare * multiplier;
        if (discount > 0) {
            totalFare = totalFare * (1 - discount);
        }
        totalFare = Math.round(totalFare);
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Create the scheduled ride
        const ride = await rideModel.create({
            user,
            pickup,
            destination,
            vehicleType,
            fare: totalFare,
            otp,
            distance,
            duration,
            isScheduled: true,
            scheduleStartDate,
            schedulePeriod
        });
        return ride;
    } catch (error) {
        console.error('Error in scheduleRide service:', error);
        throw error;
    }
};

