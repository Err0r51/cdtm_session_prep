"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherResponse } from '@/types/weather';
import { Clock, Cloud, Compass, Droplets, MapPin, ThermometerSun, Wind } from "lucide-react";
import React, { useState } from 'react';

export default function WeatherDashboard() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => { 
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`); 
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      
      const data: WeatherResponse = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { // Bug: Incorrect event type
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-white">
              Weather Dashboard
            </CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Enter a city name to get current weather conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-8">
              <Input
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)} // Bug: Incorrect event handling
                className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                onKeyPress={handleKeyPress}
              />
              <Button 
                onClick={fetchWeather}
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
            </div>

            {error && (
              <div className="text-red-400 text-center mb-6 p-4 bg-red-950 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-zinc-800" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-zinc-800" />
                ))}
                </div>
              </div>
            ) : weather && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-6 h-6 text-white" />
                    <h2 className="text-3xl font-bold text-white">
                      {weather.location.name ? weather.location.name : ''} 
                    </h2>
                  </div>
                  <p className="text-lg text-zinc-400">
                    {weather.location.region}, {weather.location.country}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 text-zinc-400" />
                    <p className="text-zinc-400">
                      Local time: {weather.location.localtime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <ThermometerSun className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                        <p className="text-2xl font-bold text-white">
                          {weather.current.temp_c}°C
                        </p>
                        <p className="text-sm text-zinc-400">Temperature</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <img 
                          src={`https:${weather.current.condition.icon}`}
                          alt={weather.current.condition.text}
                          className="w-8 h-8 mx-auto mb-2"
                        />
                        <p className="text-lg font-medium text-white">
                          {weather.current.condition.text}
                        </p>
                        <p className="text-sm text-zinc-400">Condition</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <ThermometerSun className="w-8 h-8 mx-auto mb-2 text-red-500" />
                        <p className="text-2xl font-bold text-white">
                          {weather.current.feelslike_c}°C
                        </p>
                        <p className="text-sm text-zinc-400">Feels Like</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Wind className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-2xl font-bold text-white">
                            {weather.current.wind_kph} km/h
                          </p>
                          <Compass className="w-4 h-4 text-zinc-400" />
                          <span className="text-sm font-medium text-zinc-400">
                            {weather.current.wind_dir}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400">Wind</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-white">
                          {weather.current.humidity}%
                        </p>
                        <p className="text-sm text-zinc-400">Humidity</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Cloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-2xl font-bold text-white">
                          {weather.current.cloud}%
                        </p>
                        <p className="text-sm text-zinc-400">Cloud Cover</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}