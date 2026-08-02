import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Sun } from "lucide-react";

export const weatherIcons: { [key: string]: React.ElementType } = {
    "Sunny": Sun,
    "Partly Cloudy": CloudSun,
    "Cloudy": Cloud,
    "Rain": CloudRain,
    "Drizzle": CloudDrizzle,
    "Thunderstorm": CloudLightning,
    "Fog": CloudFog
  };
  
  export interface CurrentWeather {
    location: string;
    temp: number;
    condition: string;
    feelsLike: number;
    humidity: number;
    wind: number;
  }
  
  export const CurrentWeather: CurrentWeather = {
    location: "Bhopal, Madhya Pradesh",
    temp: 32,
    condition: "Partly Cloudy",
    feelsLike: 35,
    humidity: 65,
    wind: 12,
  };
  
  export interface Forecast {
      day: string;
      temp: number;
      condition: string;
  }
  
  export const dailyForecast: Forecast[] = [
    { day: "Tue", temp: 33, condition: "Thunderstorm" },
    { day: "Wed", temp: 31, condition: "Rain" },
    { day: "Thu", temp: 34, condition: "Partly Cloudy" },
    { day: "Fri", temp: 35, condition: "Sunny" },
    { day: "Sat", temp: 33, condition: "Partly Cloudy" },
    { day: "Sun", temp: 30, condition: "Rain" },
    { day: "Mon", temp: 32, condition: "Partly Cloudy" },
  ];
