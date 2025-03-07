const axios = require("axios");
const captainModel = require("../models/captainModel");

module.exports.getAddressCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Google Maps API key is missing. Set the GOOGLE_MAP_API_KEY environment variable."
    );
  }
  const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const { status, results } = response.data;
    if (status !== "OK") {
      let errorMessage = "Failed to fetch coordinates.";
      switch (status) {
        case "ZERO_RESULTS":
          errorMessage = "No results found for the provided address.";
          break;
        case "OVER_QUERY_LIMIT":
          errorMessage =
            "Google Maps API query limit exceeded. Try again later.";
          break;
        case "REQUEST_DENIED":
          errorMessage = "Request denied. Check your API key and permissions.";
          break;
        case "INVALID_REQUEST":
          errorMessage = "Invalid request. Address parameter may be missing.";
          break;
        default:
          errorMessage = `Google Maps API error: ${status}`;
      }
      throw new Error(errorMessage);
    }

    if (!results.length || !results[0].geometry?.location) {
      throw new Error("Invalid location data received from Google Maps API.");
    }

    const { lat: latitude, lng: longitude } = results[0].geometry.location;
    return { latitude, longitude };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timeout.");
      throw new Error(
        "Request to Google Maps API timed out. Please try again later."
      );
    }

    if (error.response) {
      console.error("Google Maps API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }

    throw new Error(
      error.message ||
        "Unable to fetch coordinates. Please check the address and try again."
    );
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required.");
  }

  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Google Maps API key is missing. Set the GOOGLE_MAP_API_KEY environment variable."
    );
  }

  const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });

    const { status, rows } = response.data;

    if (status !== "OK") {
      throw new Error(`Google Maps API error: ${status}`);
    }

    if (
      !rows ||
      !rows.length ||
      !rows[0].elements ||
      !rows[0].elements.length
    ) {
      throw new Error("Invalid response format from Google Maps API.");
    }

    const element = rows[0].elements[0];

    if (element.status !== "OK") {
      throw new Error(`Distance calculation error: ${element.status}`);
    }

    return {
      distance: element.distance.text,
      duration: element.duration.text,
    };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timeout.");
      throw new Error(
        "Request to Google Maps API timed out. Please try again later."
      );
    }

    console.error("Error fetching distance:", error.message);
    throw new Error(error.message || "Failed to fetch distance and time.");
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }

  const apiKey = process.env.GOOGLE_MAP_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Google Maps API key is missing. Set the GOOGLE_MAP_API_KEY environment variable."
    );
  }

  const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
  
    const response = await axios.get(url, { timeout: 5000 });
 

    if (
      response.status !== 200 ||
      !response.data ||
      !response.data.predictions
    ) {
      throw new Error(
        `Invalid response from Google Maps API: ${JSON.stringify(
          response.data
        )}`
      );
    }

    return response.data.predictions;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Error: Request timeout.");
      throw new Error(
        "Request to Google Maps API timed out. Please try again later."
      );
    } else if (error.response) {
      console.error("Google Maps API Error:", error.response.data);
      throw new Error(
        error.response.data.error_message ||
          "Failed to fetch autocomplete suggestions."
      );
    } else {
      console.error("Error fetching autocomplete suggestions:", error.message);
      throw new Error(
        error.message || "Failed to fetch autocomplete suggestions."
      );
    }
  }
};
module.exports.getCaptainsInTheRadius = async (latitude, longitude, radius) => {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius) * 10000; // Convert km to meters

    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      console.error("❌ Invalid input:", { lat, lng, rad });
      throw new Error("Invalid latitude, longitude, or radius");
    }


    // Check if MongoDB index exists
    const indexes = await captainModel.collection.indexes();
    if (!indexes.some(idx => idx.key && idx.key.location === "2dsphere")) {
      console.warn("⚠️ Creating missing 2dsphere index on location...");
      await captainModel.collection.createIndex({ location: "2dsphere" });
    }

    // Query for available captains
    const captains = await captainModel.find({
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: rad, // Search radius in meters
        },
      },
      "vehicle.vehicleStatus": "available",
    });

    return captains;
  } catch (error) {
    console.error("❌ Error fetching captains in radius:", error.message);
    return [];
  }
};
