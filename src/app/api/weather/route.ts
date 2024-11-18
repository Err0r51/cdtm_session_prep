// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import type { WeatherResponse } from '@/types/weather';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function GET(request: Request) {

  // Note: it would be better to use smth like https://env.t3.gg/ to validate our env vars
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Weather API key is missing' },
      { status: 500 }
    );
  }
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city')?.trim();
  
  if (!city) {
    return NextResponse.json(
      { message: 'City parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`
    );
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: response.status }
      );
    }
    const data: WeatherResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}