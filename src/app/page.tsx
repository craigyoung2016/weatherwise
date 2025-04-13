'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {getCurrentWeather, get7DayForecast, getLocation, Weather} from '@/services/weather';
import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {generateWeatherTip} from '@/ai/flows/generate-weather-tip';
import {Forecast} from '../services/weather';
import {Thermometer, Droplet, Wind, Sun, Cloud, CloudRain, CloudSnow} from 'lucide-react';

const WeatherIcon = ({condition}: { condition: string }) => {
  switch (condition) {
    case 'Sunny':
      return <Sun className="w-6 h-6 text-orange-500"/>;
    case 'Cloudy':
      return <Cloud className="w-6 h-6 text-gray-500"/>;
    case 'Rainy':
      return <CloudRain className="w-6 h-6 text-blue-500"/>;
    case 'Snowy':
      return <CloudSnow className="w-6 h-6 text-white"/>;
    default:
      return <Sun className="w-6 h-6 text-orange-500"/>;
  }
};

export default function Home() {
  const [city, setCity] = useState('Los Angeles');
  const [location, setLocation] = useState({lat: 34.052235, lng: -118.243683});
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast[] | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const newLocation = await getLocation(city);
      setLocation(newLocation);

      const newWeather = await getCurrentWeather(newLocation);
      setWeather(newWeather);

      const newForecast = await get7DayForecast(newLocation);
      setForecast(newForecast);

      if (newWeather) {
        const aiTip = await generateWeatherTip({
          weather: {
            temperatureCelsius: newWeather.temperatureCelsius,
            humidity: newWeather.humidity,
            windSpeed: newWeather.windSpeed,
            conditions: newWeather.conditions,
          },
        });
        setTip(aiTip.tip);
      }
    };

    fetchData();
  }, [city]);

  const handleSearch = async () => {
    const newLocation = await getLocation(city);
    setLocation(newLocation);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">WeatherWise</CardTitle>
            <CardDescription>Your personalized weather forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {weather && (
          <Card className="w-full max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle>Current Weather in {city}</CardTitle>
              <CardDescription>{weather.conditions}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-6 h-6 text-primary"/>
                  <span>{weather.temperatureCelsius}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplet className="w-6 h-6 text-primary"/>
                  <span>{weather.humidity}% Humidity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-6 h-6 text-primary"/>
                  <span>{weather.windSpeed} km/h Wind</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {forecast && (
          <Card className="w-full max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle>7-Day Forecast for {city}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {forecast.map((dayForecast, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <span>{dayForecast.day}</span>
                    <div className="flex items-center space-x-4">
                      <WeatherIcon condition={dayForecast.conditionIcon}/>
                      <span>{dayForecast.highTemperatureCelsius}°C</span>
                      <span className="text-muted-foreground">{dayForecast.lowTemperatureCelsius}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {tip && (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Weather Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{tip}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
