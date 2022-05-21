import { useState, useEffect, useCallback } from 'react';

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            };
            return neededElements;
          }, 
          {}
        );
  
        return{
          locationName: locationData.locationName,
          temterature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          observationTime: locationData.time.obsTime,
          isLoading: false,
        };
      });
};
  
const fetchWeatherForcast = ({ authorizationKey, cityName }) => {
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            };
            return neededElements;
          }, 
          {}
        );
  
        return{
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        };
      });
};

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
    const [weatherElement, setWeatherElement] = useState({
        locationName: '',
        description: '',
        weatherCode: 0,
        temterature: 0,
        windSpeed: 0,
        rainPossibility: 0,
        comfortability: '',
        observationTime: new Date(),
        isLoading: true,
    });

    const fetchData = useCallback(async () => {
        setWeatherElement((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
    
        const [currentWeather, weatherForcast] = await Promise.all([
          fetchCurrentWeather({ authorizationKey, locationName }), 
          fetchWeatherForcast({ authorizationKey, cityName }),
        ]);
    
        setWeatherElement({
          ...currentWeather,
          ...weatherForcast,
          isLoading: false,
        })
    }, [authorizationKey, cityName, locationName]);

    useEffect(() => { fetchData() }, [fetchData]);

    return ([weatherElement, fetchData]);
};

export default useWeatherAPI;