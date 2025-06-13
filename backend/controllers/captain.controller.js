const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('Registering captain with data:', req.body);
    const { fullname, email, password, vehicle, phone } = req.body;
    console.log('phone:', phone);
    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        phone,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
        isActive: true,
        status: 'available'
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set initial status on login
    captain.isActive = true;
    captain.status = 'available';
    await captain.save();

    const token = captain.generateAuthToken();
    res.cookie('token', token);

    // Return the updated captain data
    const updatedCaptain = await captainModel.findById(captain._id);
    res.status(200).json({ token, captain: updatedCaptain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (req.captain) {
        req.captain.isActive = false;
        req.captain.status = 'offline';
        req.captain.socketId = null;
        await req.captain.save();
    }

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}

module.exports.updateCaptainStatus = async (req, res, next) => {
    try {
        const { status, socketId } = req.body;
        
        if (!req.captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (status) {
            if (!['available', 'busy', 'offline'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            req.captain.status = status;
            req.captain.isActive = status !== 'offline';
        }

        if (socketId) {
            console.log('Updating socket ID to:', socketId);
            req.captain.socketId = socketId;
        }

        await req.captain.save();
        console.log('Updated captain:', req.captain);

        res.status(200).json({ captain: req.captain });
    } catch (error) {
        console.error('Error updating captain status:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports.toggleAvailability = async (req, res, next) => {
    try {
        if (!req.captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Toggle status between available and offline
        const newStatus = req.captain.status === 'available' ? 'offline' : 'available';
        
        // Update both status and isActive
        req.captain.status = newStatus;
        req.captain.isActive = newStatus === 'available';
        
        // Save the changes
        await req.captain.save();

        // Log the update
        console.log('Captain status updated:', {
            id: req.captain._id,
            status: req.captain.status,
            isActive: req.captain.isActive
        });

        res.status(200).json({ 
            captain: req.captain,
            message: `Status updated to ${newStatus}`
        });
    } catch (error) {
        console.error('Error toggling availability:', error);
        res.status(500).json({ message: error.message });
    }
}