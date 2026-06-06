import { useEffect, useState } from "react";

// Expanded dictionary for the MVP
const locationData = {
  // Top 5 Destinations
  "USA": ["California", "New York", "Texas", "Massachusetts", "Illinois"],
  "UK": ["England", "Scotland", "Wales", "Northern Ireland"],
  "Canada": ["Ontario", "British Columbia", "Quebec", "Alberta"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia"],
  "India": ["Karnataka", "Telangana", "Tamil Nadu", "Maharashtra", "Delhi"],
  
  // Secondary Destinations
  "Germany": ["Bavaria", "Berlin", "Hesse", "North Rhine-Westphalia"],
  "Singapore": ["Central Region", "East Region", "North Region"],
  "New Zealand": ["Auckland", "Wellington", "Canterbury"],
  "Ireland": ["Dublin", "Cork", "Galway"],
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah"]
};

const topCountries = ["USA", "UK", "Canada", "Australia", "India"];
const otherCountries = Object.keys(locationData).filter(c => !topCountries.includes(c));

export default function SidebarFilters({
  selectedCountries,
  setSelectedCountries,
  selectedStates,
  setSelectedStates,
  maxBudget,
  setMaxBudget,
}) {
  // New state to manage the "Show All" toggle
  const [showAllCountries, setShowAllCountries] = useState(false);

  const availableStates = selectedCountries.reduce((acc, country) => {
    return [...acc, ...locationData[country]];
  }, []);

  // CLEANUP: If a country is unchecked, remove its states from the selection
  useEffect(() => {
    const validStates = selectedStates.filter((state) =>
      availableStates.includes(state)
    );
    if (validStates.length !== selectedStates.length) {
      setSelectedStates(validStates);
    }
  }, [selectedCountries, availableStates, selectedStates, setSelectedStates]);

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

        {/* COUNTRY FILTER */}
        <div className="mb-8">
          <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider">
            Target Countries
          </h4>
          
          <div className="space-y-2">
            {/* 1. Render Top Countries Always */}
            {topCountries.map((country) => (
              <label key={country} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country)}
                  onChange={() => toggleArrayItem(country, selectedCountries, setSelectedCountries)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-600 group-hover:text-gray-900">{country}</span>
              </label>
            ))}

            {/* 2. Render Secondary Countries if toggled */}
            {showAllCountries && (
              <div className="pt-3 pb-2 space-y-2 border-t border-gray-100 mt-3 animate-in fade-in slide-in-from-top-2">
                {otherCountries.map((country) => (
                  <label key={country} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => toggleArrayItem(country, selectedCountries, setSelectedCountries)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 group-hover:text-gray-900">{country}</span>
                  </label>
                ))}
              </div>
            )}
            
            {/* 3. The Toggle Button (Updated for visibility) */}
            <button 
              type="button"
              onClick={() => setShowAllCountries(!showAllCountries)}
              className="mt-4 w-full py-2 px-4 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {showAllCountries ? "− Show Less Countries" : "+ Show All Countries"}
            </button>
          </div>
        </div>

        {/* STATE FILTER */}
        {selectedCountries.length > 0 && (
          <div className="mb-8">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider">
              Target States/Provinces
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {availableStates.map((state) => (
                <label key={state} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedStates.includes(state)}
                    onChange={() => toggleArrayItem(state, selectedStates, setSelectedStates)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900">{state}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET FILTER */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider">
            Max Budget (USD)
          </h4>
          <input
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>
    </aside>
  );
}