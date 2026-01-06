import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { items, paymentMethod, subtotal, gst, total } = body

  // Validate bill
  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: 'Bill cannot be empty' },
      { status: 400 }
    )
  }

  // Generate invoice number
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`

  // In a real app, this would:
  // 1. Save the bill to database
  // 2. Update inventory stock
  // 3. Record the transaction
  // 4. Generate PDF invoice
  // 5. Send to printer if needed

  const invoice = {
    invoiceNumber,
    items,
    subtotal,
    gst,
    total,
    paymentMethod,
    timestamp: new Date().toISOString(),
    status: 'completed'
  }

  return NextResponse.json({ success: true, invoice })
}

export async function GET() {
  // Get recent bills
  const recentBills = [
    {
      invoiceNumber: 'INV-2025-001',
      total: 327,
      items: 3,
      timestamp: new Date().toISOString()
    }
  ]

  return NextResponse.json(recentBills)
}

