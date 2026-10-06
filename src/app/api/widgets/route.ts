import { NextResponse } from 'next/server'

// Cache route for 30 minutes
export const revalidate = 1800

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Ochiq havo'
    case 1:
    case 2:
      return 'Qisman bulutli'
    case 3:
      return 'Bulutli'
    case 45:
    case 48:
      return 'Tumanli'
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return 'Yomg‘irli'
    case 71:
    case 73:
    case 75:
      return 'Qor yog‘moqda'
    case 95:
    case 96:
    case 99:
      return 'Momaqaldiroq'
    default:
      return 'Ochiq'
  }
}

// GET /api/widgets - Real-time Urgut Weather & CBU Currency
export async function GET() {
  try {
    const [ratesRes, weatherRes] = await Promise.allSettled([
      fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/', {
        next: { revalidate: 1800 },
        headers: { 'User-Agent': 'UrgutTodayPortal/1.0' },
      }).then((r) => r.json()),
      fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=39.4036&longitude=67.2431&current=temperature_2m,weather_code',
        {
          next: { revalidate: 1800 },
          headers: { 'User-Agent': 'UrgutTodayPortal/1.0' },
        }
      ).then((r) => r.json()),
    ])

    // 1. Parse USD rate
    let usdRate = '12 850'
    let usdDiff = ''
    if (ratesRes.status === 'fulfilled' && Array.isArray(ratesRes.value)) {
      const usd = ratesRes.value.find((item: any) => item.Ccy === 'USD')
      if (usd && usd.Rate) {
        const num = Math.round(parseFloat(usd.Rate))
        usdRate = num.toLocaleString('ru-RU')
        usdDiff = usd.Diff || ''
      }
    }

    // 2. Parse Urgut Weather
    let temp = '+18°C'
    let condition = 'Ochiq havo'
    let code = 0
    if (weatherRes.status === 'fulfilled' && weatherRes.value?.current) {
      const t = Math.round(weatherRes.value.current.temperature_2m)
      temp = (t > 0 ? `+${t}` : `${t}`) + '°C'
      code = weatherRes.value.current.weather_code || 0
      condition = getWeatherDescription(code)
    }

    return NextResponse.json({
      weather: {
        temp,
        condition,
        code,
        city: 'Urgut',
      },
      currency: {
        usd: usdRate,
        diff: usdDiff,
      },
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Widgets API error:', err)
    return NextResponse.json({
      weather: { temp: '+18°C', condition: 'Ochiq havo', city: 'Urgut' },
      currency: { usd: '12 850', diff: '' },
    })
  }
}
