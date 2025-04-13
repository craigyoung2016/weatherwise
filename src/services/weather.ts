/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents weather information, including temperature, humidity, wind speed, and conditions.
 */
export interface Weather {
  /**
   * The temperature in Celsius.
   */
  temperatureCelsius: number;
  /**
   * The humidity percentage.
   */
  humidity: number;
  /**
   * The wind speed in km/h.
   */
  windSpeed: number;
  /**
   * The weather conditions (e.g., Sunny, Cloudy, Rainy, Snowy).
   */
  conditions: string;
}

/**
 * Represents a 7-day weather forecast, including daily high and low temperatures, and weather condition icons.
 */
export interface Forecast {
  /**
   * The day of the week.
   */
  day: string;
  /**
   * The high temperature in Celsius.
   */
  highTemperatureCelsius: number;
  /**
   * The low temperature in Celsius.
   */
  lowTemperatureCelsius: number;
  /**
   * The weather condition icon (e.g., sun, cloud, rain, snow).
   */
  conditionIcon: string;
}

/**
 * Asynchronously retrieves current weather information for a given location.
 *
 * @param location The location for which to retrieve weather data.
 * @returns A promise that resolves to a Weather object containing temperature, humidity, wind speed, and conditions.
 */
export async function getCurrentWeather(location: Location): Promise<Weather> {
  // TODO: Implement this by calling an API.

  return {
    temperatureCelsius: 25,
    humidity: 60,
    windSpeed: 10,
    conditions: 'Sunny',
  };
}

/**
 * Asynchronously retrieves a 7-day weather forecast for a given location.
 *
 * @param location The location for which to retrieve forecast data.
 * @returns A promise that resolves to an array of Forecast objects.
 */
export async function get7DayForecast(location: Location): Promise<Forecast[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      day: 'Monday',
      highTemperatureCelsius: 28,
      lowTemperatureCelsius: 20,
      conditionIcon: 'Sunny',
    },
    {
      day: 'Tuesday',
      highTemperatureCelsius: 30,
      lowTemperatureCelsius: 22,
      conditionIcon: 'Sunny',
    },
    {
      day: 'Wednesday',
      highTemperatureCelsius: 27,
      lowTemperatureCelsius: 19,
      conditionIcon: 'Cloudy',
    },
    {
      day: 'Thursday',
      highTemperatureCelsius: 25,
      lowTemperatureCelsius: 18,
      conditionIcon: 'Rainy',
    },
    {
      day: 'Friday',
      highTemperatureCelsius: 26,
      lowTemperatureCelsius: 19,
      conditionIcon: 'Cloudy',
    },
    {
      day: 'Saturday',
      highTemperatureCelsius: 29,
      lowTemperatureCelsius: 21,
      conditionIcon: 'Sunny',
    },
    {
      day: 'Sunday',
      highTemperatureCelsius: 31,
      lowTemperatureCelsius: 23,
      conditionIcon: 'Sunny',
    },
  ];
}

/**
 * Asynchronously retrieves a location based on city name.
 *
 * @param city The city for which to retrieve location data.
 * @returns A promise that resolves to a Location object.
 */
export async function getLocation(_city: string): Promise<Location> {
  return {
    // Return a random location for demonstration purposes.
    // In a real application, this would call an API to get the location for the given city.
    lat: Math.random() * 180 - 90, // Latitude between -90 and 90
    lng: Math.random() * 360 - 180, // Longitude between -180 and 180
  };
}
