
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Cloud,
  Landmark,
  ScanLine,
  ShoppingCart,
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Wind,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { getGreeting } from '@/lib/actions';
import { getTranslations, type Locale, type Translations } from '@/app/lib/translations';
import { CurrentWeather, dailyForecast, weatherIcons } from './weather-data';
import { getWeatherSuggestions } from '@/ai/flows/weather-suggestion-flow';


function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}


export default function DashboardPage() {
  const [greeting, setGreeting] = useState('');
  const [lang, setLang] = useState<Locale>('en');
  const [weatherSuggestions, setWeatherSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const userLang = getCookie('userLanguage') as Locale | undefined;
    if (userLang) {
      setLang(userLang);
    }
  }, []);

  useEffect(() => {
    const fetchWeatherSuggestions = async () => {
      try {
        const result = await getWeatherSuggestions({ current: CurrentWeather, forecast: dailyForecast });
        if(result.suggestions) {
            setWeatherSuggestions(result.suggestions);
        }
      } catch (error) {
        console.error("Failed to fetch weather suggestions:", error);
      }
    };
    fetchWeatherSuggestions();
  }, []);

  const t = getTranslations(lang);

  const features = [
    {
      title: t.feature_start_farming_title,
      description: t.feature_start_farming_desc,
      longDescription: t.feature_start_farming_long_desc,
      icon: Sprout,
      href: '/farming',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      buttonText: 'Get Started',
      buttonVariant: 'default' as const,
    },
    {
      title: t.feature_crop_analysis_title,
      description: t.feature_crop_analysis_desc,
      icon: ScanLine,
      href: '/crop-analysis',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      buttonText: 'Analyze Crop',
      buttonVariant: 'outline' as const,
    },
    {
      title: t.feature_marketplace_title,
      description: t.feature_marketplace_desc,
      longDescription: t.feature_marketplace_long_desc,
      icon: ShoppingCart,
      href: '/market',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      buttonText: 'Explore Marketplace',
      buttonVariant: 'outline' as const,
    },
    {
      title: 'Government<br/>Schemes',
      description: 'Explore state-wise agricultural schemes and benefits.',
      longDescription: 'Stay informed about the latest government support available for you.',
      icon: Landmark,
      href: '/schemes',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      buttonText: 'Explore Schemes',
      buttonVariant: 'outline' as const,
    },
  ];

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await getGreeting({ lang });
        setGreeting(response.greeting);
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
        setGreeting('Welcome');
      }
    };
    fetchGreeting();
  }, [lang]);

  const displayGreeting = greeting ? `${greeting}, Farmer!` : `${t.welcome}, ${t.farmer}!`;
  const WeatherIcon = weatherIcons[CurrentWeather.condition] || Cloud;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{displayGreeting}</h1>
        <p className="text-muted-foreground">{t.dashboard_subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weather Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <WeatherIcon className="h-16 w-16 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-4xl font-bold">{CurrentWeather.temp}°C</p>
                  <p className="text-muted-foreground text-lg">{CurrentWeather.condition} in {CurrentWeather.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center w-full sm:w-auto">
                  <div className="space-y-1">
                      <Droplets className="h-6 w-6 mx-auto text-blue-500"/>
                      <p className="font-bold text-sm">{CurrentWeather.humidity}%</p>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                  </div>
                   <div className="space-y-1">
                      <Sun className="h-6 w-6 mx-auto text-yellow-500"/>
                      <p className="font-bold text-sm">{CurrentWeather.feelsLike}°C</p>
                      <p className="text-xs text-muted-foreground">Feels Like</p>
                  </div>
                   <div className="space-y-1">
                      <Wind className="h-6 w-6 mx-auto text-gray-500"/>
                      <p className="font-bold text-sm">{CurrentWeather.wind} km/h</p>
                      <p className="text-xs text-muted-foreground">Wind</p>
                  </div>
              </div>
            </div>
            <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">7-Day Forecast</h3>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {dailyForecast.map(day => {
                        const Icon = weatherIcons[day.condition] || Cloud;
                        return (
                            <div key={day.day} className="p-2 rounded-lg bg-muted/50">
                                <p className="font-bold text-sm">{day.day}</p>
                                <Icon className="h-8 w-8 mx-auto my-1 text-muted-foreground"/>
                                <p className="text-sm font-semibold">{day.temp}°C</p>
                            </div>
                        )
                    })}
                </div>
            </div>
          </CardContent>
        </Card>

        {weatherSuggestions.length > 0 && (
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="h-5 w-5"/>
                        AI Farming Suggestions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {weatherSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                                <Sprout className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-bold text-foreground" dangerouslySetInnerHTML={{ __html: feature.title }} />
                  <CardDescription className="pt-2">{feature.description}</CardDescription>
                </div>
              </div>
               {feature.longDescription && (
                <p className="text-muted-foreground pt-2">{feature.longDescription}</p>
              )}
            </CardHeader>
            <CardContent>
              <Link href={feature.href} passHref>
                <Button variant={feature.buttonVariant} className="w-full font-bold">
                  {feature.buttonText === t.go_to ? `${t.go_to} ${feature.title.replace(/<br\/>/g, ' ')}` : feature.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
