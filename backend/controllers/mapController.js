const mapService = require("../services/mapService");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Extract address from query
    const { address } = req.query;

    // Check if address is provided
    if (!address || address.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Address parameter is required." });
    }

    // Fetch coordinates from mapService
    const coordinates = await mapService.getAddressCoordinates(
      req.query.address
    );

    // Return success response
    return res.status(200).json({ success: true, data: coordinates });
  } catch (error) {
    // Log the error for debugging
    console.error("Error in getCoordinates:", error.message);

    // Handle specific errors
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({
          success: false,
          error: "Address not found. Please check the input.",
        });
    }

    // Return general error response
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to fetch coordinates. Please try again later.",
      });
  }
};

module.exports.getDistanceTime = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ success: false, message: "Origin and destination are required." });
        }

        // Fetch distance and time
        const distanceTime = await mapService.getDistanceTime(origin, destination);

        return res.status(200).json({ success: true, data: distanceTime });

    } catch (error) {
        console.error("Error in getDistanceTime:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};




module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        // Validate request query parameters
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        // Extract input from query params
        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ success: false, message: "Input is required." });
        }

        // Fetch autocomplete suggestions from the service
        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        return res.status(200).json({ success: true, data: suggestions });

    } catch (error) {
        console.error("Error in getAutoCompleteSuggestions:", error.message);

        return res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch autocomplete suggestions." 
        });
    }
};
