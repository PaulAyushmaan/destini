const axios = require('axios');
const captainModel = require('../models/captain.model');

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

// Haversine formula for distance in km between two lat/lng
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => x * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Get latitude and longitude for a given address using OpenStreetMap Nominatim
 */
module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(NOMINATIM_SEARCH_URL, {
            params: {
                q: address,
                format: 'json',
                addressdetails: 1,
                limit: 1
            },
            headers: { 'User-Agent': 'destini-cab-service/1.0' }
        });
        if (!response.data.length) {
            throw new Error('No coordinates found for this address');
        }
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } catch (error) {
        console.error('Geocoding Error:', error.message);
        throw error;
    }
};

/**
 * Get distance and estimated travel time between two locations using Haversine formula
 */
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    const originCoord = await module.exports.getAddressCoordinate(origin);
    const destinationCoord = await module.exports.getAddressCoordinate(destination);
    const distance = haversineDistance(
        originCoord.lat, originCoord.lng,
        destinationCoord.lat, destinationCoord.lng
    );
    // Assume average speed 30 km/h for city
    const avgSpeed = 30; // km/h
    const duration = (distance / avgSpeed) * 60; // minutes
    return {
        distance: distance, // in km
        duration: duration // in minutes
    };
};

/**
 * Get autocomplete location suggestions using OpenStreetMap Nominatim
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }
    try {
        const response = await axios.get(NOMINATIM_SEARCH_URL, {
            params: {
                q: input,
                format: 'json',
                addressdetails: 1,
                limit: 5,
                countrycodes: 'IN' // Restrict to India
            },
            headers: { 'User-Agent': 'destini-cab-service/1.0' }
        });
        if (!response.data.length) {
            throw new Error('No suggestions found');
        }
        return response.data.map(feature => feature.display_name);
    } catch (error) {
        console.error('Autocomplete Error:', error.message);
        throw error;
    }
};

/**
 * Get all active captains
 */
module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    try {
        console.log('Finding all active captains');
        
        // Find all active captains
    const captains = await captainModel.find({
            isActive: true
        });

        console.log(`Found ${captains.length} active captains`);
    return captains;
    } catch (error) {
        console.error('Error finding captains:', error);
        throw error;
    }
};
