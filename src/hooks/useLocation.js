import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

export const useLocation = (profileData) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Load countries on mount
  useEffect(() => {
    const loadedCountries = Country.getAllCountries();
    setCountries(loadedCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (profileData.country) {
      const loadedStates = State.getStatesOfCountry(profileData.country);
      setStates(loadedStates);
    } else {
      setStates([]);
    }
  }, [profileData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (profileData.country && profileData.state) {
      const loadedCities = City.getCitiesOfState(profileData.country, profileData.state);
      setCities(loadedCities);
    } else {
      setCities([]);
    }
  }, [profileData.country, profileData.state]);

  // Get display names for current selection
  const getDisplayNames = () => ({
    country: countries.find(c => c.isoCode === profileData.country)?.name || '',
    state: states.find(s => s.isoCode === profileData.state)?.name || ''
  });

  return {
    countries,
    states,
    cities,
    getDisplayNames,
  };
};
