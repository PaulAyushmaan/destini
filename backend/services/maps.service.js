const axios = require('axios');
const captainModel = require('../models/captain.model');

const ORS_API_KEY = process.env.ORS_API_KEY;
const GEOCODE_URL = 'https://api.openrouteservice.org/geocode/search';
const DIRECTIONS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

/**
 * Get latitude and longitude for a given address using OpenRouteService
 */
module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(GEOCODE_URL, {
            params: {
                api_key: ORS_API_KEY,
                text: address,
                size: 1
            }
        });

        if (response.data.features.length === 0) {
            throw new Error('No coordinates found for this address');
        }

        const [lng, lat] = response.data.features[0].geometry.coordinates;
        return { lat, lng };
    } catch (error) {
        console.error('Geocoding Error:', error.message);
        throw error;
    }
};

/**
 * Get distance and estimated travel time between two locations using OpenRouteService
 */
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const originCoord = await module.exports.getAddressCoordinate(origin);
    const destinationCoord = await module.exports.getAddressCoordinate(destination);

    try {
        const response = await axios.post(DIRECTIONS_URL, {
            coordinates: [
                [originCoord.lng, originCoord.lat],
                [destinationCoord.lng, destinationCoord.lat]
            ]
        }, {
            headers: {
                'Authorization': ORS_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);

        const route = response.data.routes[0];
        console.log(route,route.summary);
        console.log(route.summary.distance, route.summary.duration);
        return {
            distance: route.summary.distance / 1000, // meters to kilometers
            duration: route.summary.duration / 60 // seconds to minutes
        };
    } catch (error) {
        console.error('Routing Error:', error.message);
        throw error;
    }
};

/**
 * Get autocomplete location suggestions using OpenRouteService
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    try {
        const response = await axios.get(GEOCODE_URL, {
            params: {
                api_key: ORS_API_KEY,
                text: input,
                size: 5
            }
        });

        if (response.data.features.length === 0) {
            throw new Error('No suggestions found');
        }

        return response.data.features.map(feature => feature.properties.label);
    } catch (error) {
        console.error('Autocomplete Error:', error.message);
        throw error;
    }
};

/**
 * Get captains within a given radius
 */
module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371] // Convert radius to radians
            }
        }
    });

    return captains;
};
