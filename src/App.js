import React, { useState, useEffect, useMemo } from 'react';
import { getMoment, findLocation } from './utils/helpers';

import { ThemeProvider } from '@emotion/react';
import WeatherCard from './Views/WeatherCard';
import WeatherSetting from './Views/WeatherSetting';
import styled from '@emotion/styled';
import useWeatherAPI from './hooks/useWeatherAPI';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTORIZATION_KEY = 'CWB-DDC75BC4-06BC-4B29-A5F2-4053742BE443';

const App = () => {
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentCity, setCurrentCity] = useState(storageCity);
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const [currentTheme, setCurrentTheme] = useState('light');

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  }
  
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  }

  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTORIZATION_KEY,
  });

  useEffect(() => {
    setCurrentTheme(moment==='day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard 
            cityName = {cityName}
            weatherElement = {weatherElement}
            moment = {moment}
            fetchData = {fetchData}
            handleCurrentPageChange = {handleCurrentPageChange}
          />
        )}
        
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting 
            cityName = {cityName}
            handleCurrentPageChange={handleCurrentPageChange} 
            handleCurrentCityChange={handleCurrentCityChange} />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
