'use client'

import { CheckCircle, Printer } from 'lucide-react'

interface BillItem {
  name: string
  price: number
  quantity: number
  total: number
}

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  billData?: {
    billItems: BillItem[]
    subtotal: number
    gst: number
    total: number
    paymentMethod: string
  }
  invoiceNumber?: string
}

export default function SuccessModal({ isOpen, onClose, billData, invoiceNumber = 'INV-2025-001' }: SuccessModalProps) {

  const handlePrint = () => {
    if (!billData) return
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 20px;
              background: white;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #000;
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .header-left h1 {
              font-size: 24px;
              font-weight: bold;
              color: #000;
              margin: 0;
            }
            .header-left p {
              font-size: 12px;
              color: #666;
              margin: 0;
            }
            .invoice-number {
              text-align: right;
            }
            .invoice-number p:first-child {
              font-size: 12px;
              color: #666;
              margin-bottom: 4px;
            }
            .invoice-number p:last-child {
              font-size: 18px;
              font-weight: bold;
              color: #000;
              margin: 0;
            }
            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              margin-bottom: 24px;
            }
            .detail-item p:first-child {
              font-size: 11px;
              color: #666;
              margin-bottom: 4px;
            }
            .detail-item p:last-child {
              font-size: 13px;
              font-weight: 600;
              color: #000;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }
            thead tr {
              border-bottom: 2px solid #000;
            }
            th {
              text-align: left;
              padding: 12px;
              font-size: 11px;
              font-weight: 600;
              color: #333;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            th:nth-child(2), th:nth-child(3), th:nth-child(4) {
              text-align: right;
            }
            tbody tr {
              border-bottom: 1px solid #e5e5e5;
            }
            td {
              padding: 12px;
              font-size: 13px;
              color: #000;
            }
            td:nth-child(2), td:nth-child(3), td:nth-child(4) {
              text-align: right;
            }
            .totals {
              border-top: 2px solid #000;
              padding-top: 16px;
              display: flex;
              justify-content: flex-end;
            }
            .totals-inner {
              width: 256px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 13px;
            }
            .total-row:last-child {
              font-size: 18px;
              font-weight: bold;
              padding-top: 8px;
              border-top: 1px solid #e5e5e5;
              margin-top: 8px;
            }
            .footer {
              margin-top: 32px;
              padding-top: 24px;
              border-top: 1px solid #e5e5e5;
              text-align: center;
            }
            .footer p {
              font-size: 11px;
              color: #666;
              margin-bottom: 4px;
            }
            @media print {
              @page {
                margin: 0.5cm;
                size: A4;
              }
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="header-left">
                <div>
                  <h1>Retail Boss</h1>
                  <p>AI-Powered POS System</p>
                </div>
              </div>
              <div class="invoice-number">
                <p>Invoice Number</p>
                <p>${invoiceNumber}</p>
              </div>
            </div>
            <div class="details">
              <div class="detail-item">
                <p>Date</p>
                <p>${getCurrentDate()}</p>
              </div>
              <div class="detail-item">
                <p>Payment Method</p>
                <p>${billData.paymentMethod}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${billData.billItems.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="totals">
              <div class="totals-inner">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>₹${billData.subtotal}</span>
                </div>
                <div class="total-row">
                  <span>GST (5%):</span>
                  <span>₹${billData.gst}</span>
                </div>
                <div class="total-row">
                  <span>Total:</span>
                  <span>₹${billData.total}</span>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for your business!</p>
              <p>This is a computer-generated invoice</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
  }

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 max-w-[400px] w-full text-center animate-modal-slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2">Bill Generated Successfully!</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Invoice #{invoiceNumber} created</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white text-primary border border-gray-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:border-primary hover:scale-[1.02]"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-primary text-secondary border-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg"
            >
              <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              Print Invoice
            </button>
          </div>
        </div>
      </div>

    </>
  )
}

