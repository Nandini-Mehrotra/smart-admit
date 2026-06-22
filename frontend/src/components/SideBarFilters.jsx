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
  const [showAllCountries, setShowAllCountries] = useState(false);

  const availableStates = selectedCountries.reduce((acc, country) => {
    return [...acc, ...locationData[country]];
  }, []);

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
    <aside className="w-full lg:w-64 flex-shrink-0 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm sticky top-6 transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">Filters</h3>

        {/* COUNTRY FILTER */}
        <div className="mb-8">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-slate-400 mb-3 uppercase tracking-wider transition-colors duration-300">
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
                  className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 rounded border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
                <span className="text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">{country}</span>
              </label>
            ))}

            {/* 2. Render Secondary Countries if toggled */}
            {showAllCountries && (
              <div className="pt-3 pb-2 space-y-2 border-t border-gray-100 dark:border-slate-700 mt-3 animate-in fade-in slide-in-from-top-2 transition-colors duration-300">
                {otherCountries.map((country) => (
                  <label key={country} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => toggleArrayItem(country, selectedCountries, setSelectedCountries)}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 rounded border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    />
                    <span className="text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">{country}</span>
                  </label>
                ))}
              </div>
            )}
            
            {/* 3. The Toggle Button */}
            <button 
              type="button"
              onClick={() => setShowAllCountries(!showAllCountries)}
              className="mt-4 w-full py-2 px-4 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800"
            >
              {showAllCountries ? "− Show Less Countries" : "+ Show All Countries"}
            </button>
          </div>
        </div>

        {/* STATE FILTER */}
        {selectedCountries.length > 0 && (
          <div className="mb-8">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-slate-400 mb-3 uppercase tracking-wider transition-colors duration-300">
              Target States/Provinces
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {availableStates.map((state) => (
                <label key={state} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedStates.includes(state)}
                    onChange={() => toggleArrayItem(state, selectedStates, setSelectedStates)}
                    className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 rounded border-gray-300 dark:border-slate-600 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  />
                  <span className="text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">{state}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET FILTER */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 dark:text-slate-400 mb-3 uppercase tracking-wider transition-colors duration-300">
            Max Budget (USD)
          </h4>
          <input
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>
    </aside>
  );
}