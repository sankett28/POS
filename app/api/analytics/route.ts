import { NextResponse } from 'next/server'

export async function GET() {
  const analytics = {
    forecast: {
      accuracy: 92,
      data: {
        labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        actual: [45000, null, null, null, null, null, null],
        predicted: [45000, 47000, 49000, 48000, 52000, 58000, 55000]
      },
      insights: [
        'Expected 18% increase on Saturday (weekend rush)',
        'Stock up 30% more for upcoming festival week'
      ]
    },
    customers: [
      {
        name: 'Ravi Kumar',
        purchases: 42,
        total: 12450,
        badge: 'VIP'
      },
      {
        name: 'Priya Sharma',
        purchases: 38,
        total: 10200,
        badge: 'Regular'
      },
      {
        name: 'Amit Patel',
        purchases: 35,
        total: 9800,
        badge: 'Regular'
      }
    ],
    peakHours: {
      labels: ['6-8 AM', '8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM', '6-8 PM', '8-10 PM'],
      data: [3500, 8500, 6000, 7500, 5000, 9000, 15200, 8000],
      insights: [
        { period: 'Morning: 8-10 AM', average: 8500 },
        { period: 'Evening: 6-8 PM', average: 15200 }
      ]
    }
  }

  return NextResponse.json(analytics)
}

