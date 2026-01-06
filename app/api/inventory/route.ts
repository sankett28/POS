import { NextResponse } from 'next/server'

export async function GET() {
  const inventory = {
    stats: {
      inStock: 236,
      lowStock: 12,
      expiringSoon: 8,
      stockValue: 240000
    },
    products: [
      {
        id: 'MAG001',
        name: 'Maggi Noodles 2-Min',
        category: 'Instant Food',
        stock: 45,
        minLevel: 20,
        status: 'Good Stock',
        forecast: 'High demand',
        price: 12
      },
      {
        id: 'PAR002',
        name: 'Parle-G Biscuits',
        category: 'Biscuits',
        stock: 8,
        minLevel: 15,
        status: 'Low Stock',
        forecast: 'Reorder now',
        price: 10
      },
      {
        id: 'TEA003',
        name: 'Tata Tea Gold',
        category: 'Beverages',
        stock: 32,
        minLevel: 25,
        status: 'Good Stock',
        forecast: 'Stable',
        price: 250
      },
      {
        id: 'AMU004',
        name: 'Amul Butter 500g',
        category: 'Dairy',
        stock: 3,
        minLevel: 10,
        status: 'Critical',
        forecast: 'Urgent!',
        price: 55
      }
    ]
  }

  return NextResponse.json(inventory)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  // Handle adding/updating inventory
  // In a real app, this would save to a database
  return NextResponse.json({ success: true, message: 'Inventory updated' })
}

