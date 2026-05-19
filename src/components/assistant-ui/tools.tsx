import type {
  ToolCallMessagePartProps,
  Toolkit,
} from '@assistant-ui/react-native';
import { StyleSheet, Text, View } from 'react-native';

import { z } from '@/lib/zod';

// Open-Meteo API adapters (free, no API key needed)

const geocodeLocationWithOpenMeteo = async (query: string) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (!data.results || data.results.length === 0)
      throw new Error('No results found');
    return { success: true as const, result: data.results[0] };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : 'Failed to geocode location',
    };
  }
};

const mapWeatherCode = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow Showers';
  if (code === 95) return 'Thunderstorm';
  return 'Stormy';
};

const mapWeatherEmoji = (code: number): string => {
  if (code === 0) return '\u2600\uFE0F';
  if (code <= 3) return '\u26C5';
  if (code <= 48) return '\uD83C\uDF2B\uFE0F';
  if (code <= 57) return '\uD83C\uDF26\uFE0F';
  if (code <= 67) return '\uD83C\uDF27\uFE0F';
  if (code <= 77) return '\u2744\uFE0F';
  if (code <= 82) return '\uD83C\uDF26\uFE0F';
  if (code <= 86) return '\uD83C\uDF28\uFE0F';
  if (code === 95) return '\u26C8\uFE0F';
  return '\uD83C\uDF29\uFE0F';
};

const fetchWeatherFromOpenMeteo = async ({
  query,
  longitude,
  latitude,
}: {
  query: string;
  longitude: number;
  latitude: number;
}) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&temperature_unit=fahrenheit&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5`,
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    if (!current || !daily?.time) throw new Error('Invalid API response');

    const forecast = daily.time.slice(0, 5).map((date: string, i: number) => {
      const d = new Date(`${date}T12:00:00Z`);
      const label =
        i === 0
          ? 'Today'
          : new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              timeZone: 'UTC',
            }).format(d);
      return {
        label,
        code: daily.weather_code[i],
        min: Math.round(daily.temperature_2m_min[i]),
        max: Math.round(daily.temperature_2m_max[i]),
      };
    });

    return {
      success: true as const,
      location: query,
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      windSpeed: Math.round(current.wind_speed_10m),
      forecast,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch weather',
    };
  }
};

// Tool UI Components

function GeocodeToolUI(
  props: ToolCallMessagePartProps<
    { query: string },
    {
      success: boolean;
      result?: { name: string; latitude: number; longitude: number };
      error?: string;
    }
  >,
) {
  if (props.status?.type === 'running') {
    return (
      <View className='p-3 my-1 rounded-xl bg-[#f2f2f7] dark:bg-[#1c1c1e]'>
        <Text className='text-xs text-[#6e6e73] dark:text-[#8e8e93]'>
          Finding location...
        </Text>
      </View>
    );
  }

  if (props.result?.error) {
    return (
      <View className='p-3 my-1 rounded-xl bg-[#fff0f0] dark:bg-[#3a1c1c]'>
        <Text className='text-xs text-[#ff453a]'>
          Geocoding failed: {props.result.error}
        </Text>
      </View>
    );
  }

  const result = props.result?.result;
  if (!result) return null;

  return (
    <View className='p-3 my-1 rounded-xl bg-[#f2f2f7] dark:bg-[#1c1c1e]'>
      <View className='flex-row items-center gap-2.5'>
        <Text className='text-xl'>{'\uD83D\uDCCD'}</Text>
        <View>
          <Text className='text-base font-semibold text-foreground'>
            {result.name}
          </Text>
          <Text className='text-sm mt-0.5 text-[#6e6e73] dark:text-[#8e8e93]'>
            {Math.abs(result.latitude).toFixed(2)}
            {'\u00B0'}
            {result.latitude >= 0 ? 'N' : 'S'},{' '}
            {Math.abs(result.longitude).toFixed(2)}
            {'\u00B0'}
            {result.longitude >= 0 ? 'E' : 'W'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function WeatherToolUI(
  props: ToolCallMessagePartProps<
    { query: string; longitude: number; latitude: number },
    {
      success: boolean;
      location?: string;
      temperature?: number;
      weatherCode?: number;
      windSpeed?: number;
      forecast?: Array<{
        label: string;
        code: number;
        min: number;
        max: number;
      }>;
      error?: string;
    }
  >,
) {
  if (props.status?.type === 'running') {
    return (
      <View className='p-3 my-1 rounded-xl bg-[#f2f2f7] dark:bg-[#1c1c1e]'>
        <Text className='text-xs text-[#6e6e73] dark:text-[#8e8e93]'>
          Fetching weather for {props.args.query}...
        </Text>
      </View>
    );
  }

  if (!props.result?.success) {
    return (
      <View className='p-3 my-1 rounded-xl bg-[#fff0f0] dark:bg-[#3a1c1c]'>
        <Text className='text-xs' style={{ color: '#ff453a' }}>
          Weather unavailable: {props.result?.error ?? 'Unknown error'}
        </Text>
      </View>
    );
  }

  const { location, temperature, weatherCode, windSpeed, forecast } =
    props.result;

  return (
    <View className='gap-1 p-4 my-1 rounded-xl bg-[#f2f2f7] dark:bg-[#1c1c1e]'>
      <View className='flex-row items-center gap-2.5 mb-1'>
        <Text className='text-3xl'>{mapWeatherEmoji(weatherCode ?? 0)}</Text>
        <View>
          <Text className='text-base font-semibold text-foreground'>
            {location}
          </Text>
          <Text className='text-sm mt-0.5 text-[#6e6e73] dark:text-[#8e8e93]'>
            {mapWeatherCode(weatherCode ?? 0)}
          </Text>
        </View>
      </View>

      <Text className='text-4xl font-bold text-primary'>
        {temperature ?? '--'}
        {'\u00B0'}F
      </Text>

      {windSpeed != null && (
        <Text className='text-sm mt-0.5 text-[#6e6e73] dark:text-[#8e8e93]'>
          Wind: {windSpeed} mph
        </Text>
      )}

      {forecast && forecast.length > 0 && (
        <View
          className='flex-row justify-between pt-3 mt-3 border-border'
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        >
          {forecast.map((day, i) => (
            <View key={i} className='flex-1 items-center gap-1'>
              <Text className='text-xl font-medium text-[#6e6e73] dark:text-[#8e8e93]'>
                {day.label}
              </Text>
              <Text className='text-lg'>{mapWeatherEmoji(day.code)}</Text>
              <Text className='text-sm font-semibold text-foreground'>
                {day.max}
                {'\u00B0'}
              </Text>
              <Text className='text-xs text-[#6e6e73] dark:text-[#8e8e93]'>
                {day.min}
                {'\u00B0'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// Toolkit definition

export const expoToolkit: Toolkit = {
  geocode_location: {
    description: "Geocode a location using Open-Meteo's geocoding API",
    parameters: z.object({
      query: z.string(),
    }),
    execute: async (args: { query: string }) =>
      geocodeLocationWithOpenMeteo(args.query),
    render: GeocodeToolUI,
  },
  weather_search: {
    description:
      'Find the weather in a location given a longitude and latitude',
    parameters: z.object({
      query: z.string(),
      longitude: z.number(),
      latitude: z.number(),
    }),
    execute: async (args: {
      query: string;
      longitude: number;
      latitude: number;
    }) => fetchWeatherFromOpenMeteo(args),
    render: WeatherToolUI,
  },
};
