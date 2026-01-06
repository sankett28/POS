import { NextResponse } from 'next/server'

export async function GET() {
  const notifications = [
    {
      id: 1,
      type: 'low-stock',
      title: 'Low Stock Alert',
      message: 'Parle-G Biscuits: Only 8 units left',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      unread: true
    },
    {
      id: 2,
      type: 'high-demand',
      title: 'High Demand Detected',
      message: 'Maggi sales up 45% - consider restocking',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      unread: true
    },
    {
      id: 3,
      type: 'festival',
      title: 'Festival Reminder',
      message: 'Diwali in 15 days - prepare inventory',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      unread: false
    }
  ]

  return NextResponse.json(notifications)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id } = body

  // Mark notification as read
  // In a real app, this would update the database

  return NextResponse.json({ success: true, message: 'Notification marked as read' })
}

