import React, { useEffect, useState } from 'react';
import { Search, MapPin, ChevronRight, Check } from 'lucide-react';

interface LocationResult {
  id: string;
  city: string;
  country: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: LocationResult) => void;
  selectedLocation: LocationResult | null;
}

function LocationSearch({ value, onChange, onSelect, selectedLocation }: LocationSearchProps) {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

const fetchData = async (searchTerm: string) => {
  if (!searchTerm || searchTerm.length < 2) {
    setResults([]);
    setShowResults(false);
    return;
  }

  setLoading(true);
  setShowResults(true);

  try {
    const [city, country] = searchTerm.split(',').map((item) => item.trim());

    const cityResponse = await fetch(`https://6802fd740a99cb7408ead6e1.mockapi.io/cities/location?city=${city}`);
    const cityData = await cityResponse.json();

    if (Array.isArray(cityData) && cityData.length === 0 && country) {
      const countryResponse = await fetch(`https://6802fd740a99cb7408ead6e1.mockapi.io/cities/location?country=${country}`);
      const countryData = await countryResponse.json();
      setResults(Array.isArray(countryData) ? countryData : []);
    } else {
      setResults(Array.isArray(cityData) ? cityData : []);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setResults([]);
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSelectCity = (item: LocationResult) => {
    const locationString = `${item.city}, ${item.country}`;
    onChange(locationString);
    onSelect(item);
    setResults([]);
    setShowResults(false);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="location-search-container relative mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="location"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 2 && setShowResults(true)}
          placeholder="Search for your city or country..."
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B878] focus:ring-opacity-20 focus:border-[#00B878] transition-all bg-gray-50 text-lg"
          autoComplete="off"
        />
        {selectedLocation && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="flex items-center gap-2 text-[#00B878]">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Selected</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00B878]"></div>
              <span className="ml-3 text-gray-600">Searching locations...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="overflow-y-auto max-h-80">
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                  Found {results.length} location{results.length !== 1 ? 's' : ''}
                </div>
                {results.map((item: LocationResult, index) => (
                  <button
                    key={item.id || index}
                    type="button"
                    onClick={() => handleSelectCity(item)}
                    className="w-full text-left px-4 py-3 hover:bg-[#f8fafb] transition-colors rounded-lg flex items-center gap-3 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-[#E5F8F1] rounded-full group-hover:bg-[#00B878] group-hover:text-white transition-colors">
                      <MapPin className="w-5 h-5 text-[#00B878] group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.city}</div>
                      <div className="text-sm text-gray-500">{item.country}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00B878] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : value.length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-gray-600 font-medium mb-1">No locations found</div>
              <div className="text-sm text-gray-500 text-center">
                Try searching with a different spelling or check for typos
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-[#00B878] rounded-full">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-green-800">Selected Location</div>
              <div className="text-green-700">{selectedLocation.city}, {selectedLocation.country}</div>
            </div>
            <div className="ml-auto">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationSearch;