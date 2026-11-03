import {NextResponse} from 'next/server';

const cities = [
  ['杭州', 30.2741, 120.1551], ['宁波', 29.8683, 121.5440],
  ['温州', 27.9943, 120.6994], ['嘉兴', 30.7522, 120.7555],
  ['湖州', 30.8943, 120.0868], ['绍兴', 30.0024, 120.5786],
  ['金华', 29.0781, 119.6474], ['衢州', 28.9701, 118.8595],
  ['舟山', 29.9853, 122.2072], ['台州', 28.6564, 121.4208],
  ['丽水', 28.4672, 119.9229],
] as const;

type WeatherPayload = {
  current: {time: string; temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; weather_code: number; wind_speed_10m: number};
  daily: {time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]};
};

export async function GET() {
  const results = await Promise.allSettled(cities.map(async ([name, latitude, longitude]) => {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m');
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
    url.searchParams.set('timezone', 'Asia/Shanghai');
    url.searchParams.set('forecast_days', '7');
    const response = await fetch(url, {next: {revalidate: 300}, signal: AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    const value = await response.json() as WeatherPayload;
    if (!value.current || value.daily?.time?.length !== 7) throw new Error(`${name}: invalid response`);
    return {
      name, temperature: value.current.temperature_2m, humidity: value.current.relative_humidity_2m,
      apparent: value.current.apparent_temperature, wind: value.current.wind_speed_10m,
      code: value.current.weather_code, observedAt: value.current.time,
      forecast: value.daily.time.map((date, index) => ({date, code: value.daily.weather_code[index], high: value.daily.temperature_2m_max[index], low: value.daily.temperature_2m_min[index]})),
    };
  }));
  const weather = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : []);
  const unavailable = results.flatMap((result, index) => result.status === 'rejected' ? [cities[index][0]] : []);
  return NextResponse.json({weather, unavailable, updatedAt: new Date().toISOString()}, {status: weather.length ? 200 : 503});
}
