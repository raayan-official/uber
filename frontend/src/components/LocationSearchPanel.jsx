import React from "react";

const LocationSearchPanel = ({
  suggestions = [], // Ensure it's an array to prevent errors
  setPickup,
  setDestination,
  activeField,
}) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description);
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
    }
    // setPanelOpen(false);
    // setVehiclePanelOpen(true);
  };

  return (
    <div className="p-2 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl text-center font-bold text-gray-900 mb-6">
        {activeField === "pickup" ? "Pickup Locations" : "Destination Locations"}
      </h3>

      {suggestions.length > 0 ? (
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          {suggestions.map((val, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(val)}
              className="cursor-pointer p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 h-12 w-12 flex items-center justify-center rounded-xl">
                  <i className="ri-map-pin-2-fill text-black text-xl"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {val.structured_formatting?.main_text || val.description}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {val.structured_formatting?.secondary_text || ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-white rounded-xl shadow-sm text-center">
          <p className="text-gray-600">No suggestions found.</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;