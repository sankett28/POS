import { NextResponse } from 'next/server'

export async function GET() {
  // Simulated dashboard data
  const dashboardData = {
    sales: {
      today: 45280,
      yesterday: 40250,
      trend: 12.5
    },
    products: {
      total: 248,
      lowStock: 12
    },
    customers: {
      active: 1247,
      newThisWeek: 89,
      trend: 8.2
    },
    revenue: {
      monthly: 820000,
      target: 1000000,
      trend: 15.3
    },
    salesTrend: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [32000, 35000, 38000, 36000, 40000, 45000, 42000]
    },
    categories: {
      labels: ['Groceries', 'Beverages', 'Snacks', 'Dairy', 'Others'],
      data: [35, 25, 20, 15, 5]
    },
    insights: [
      {
        type: 'high-demand',
        title: 'High Demand Alert',
        message: 'Maggi noodles sales up 45% this week. Consider increasing stock by 30 units.',
        action: 'Act Now'
      },
      {
        type: 'low-stock',
        title: 'Low Stock Warning',
        message: '12 products below minimum level. Estimated stockout in 2-3 days.',
        action: 'View Items'
      },
      {
        type: 'festival',
        title: 'Festival Forecast',
        message: 'Diwali in 15 days. AI predicts 60% increase in sweets & snacks demand.',
        action: 'Prepare'
      }
    ]
  }

  return NextResponse.json(dashboardData)
}

