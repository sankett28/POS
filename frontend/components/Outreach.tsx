'use client'

import { useState } from 'react'
import { Lightbulb, Calendar, MessageSquare, Mail, Trash2, ChevronDown, Rocket, Smartphone, FileText } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa';

export default function Outreach() {
  const [campaignDetails, setCampaignDetails] = useState({
    campaign: 'End of Season Sale',
    targetAudience: 'All Customers',
    offer: 'Up to 50% Off Storewide',
    expirationDate: '31/12/2024',
    selectedProduct: '',
  })
  const [generatedFlyer, setGeneratedFlyer] = useState<string | null>(null) // Changed to null initially
  const [isGenerating, setIsGenerating] = useState(false) // Added loading state
  const [isAudienceDropdownOpen, setIsAudienceDropdownOpen] = useState(false)

  const targetAudiences = ['All Customers', 'New Customers', 'Loyal Customers', 'Segment A', 'Segment B']

  const handleGenerateFlyer = () => {
    setIsGenerating(true)
    setGeneratedFlyer(null) // Clear previous flyer

    // Simulate AI generation delay
    setTimeout(() => {
      console.log('Simulating flyer generation with details:', campaignDetails)

      // In a real app, you would send campaignDetails to your AI backend
      // and receive a unique image URL.
      // For this simulation, we'll use a generic default promo image.
      let imageUrl = '/flyer-default-promo.png'; // Default image

    if (campaignDetails.selectedProduct === 'Summer Collection') {
      imageUrl = '/flyer-summer-collection.png'; // Example: a different image for a specific product
    } else if (campaignDetails.selectedProduct === 'Winter Sale') {
      imageUrl = '/flyer-winter-sale.png'; // Another example
    }

    setGeneratedFlyer(imageUrl) // Set the generated flyer based on the logic

      setIsGenerating(false)
    }, 2000) // Simulate a 2-second generation time
  }

  const handleShareSMS = () => {
    console.log('Sharing flyer via SMS')
    alert('Flyer shared via SMS!')
  }

  const handleShareEmail = () => {
    console.log('Sharing flyer via Email')
    alert('Flyer shared via Email!')
  }

  const handleShareWhatsapp = () => {
    console.log('Sharing flyer via WhatsApp')
    alert('Flyer shared via WhatsApp!')
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-[32px] font-bold text-primary mb-1">Automated Promotions</h1>
        <p className="text-gray-500 text-sm sm:text-base">Create engaging promotional flyers for your d-of-season sales to boost customer engagement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 sm:gap-8">
        {/* Campaign Details and Flyer Generator */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">Campaign Details</h2>

          <div className="space-y-5 mb-8">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign</label>
              <input
                type="text"
                value={campaignDetails.campaign}
                onChange={(e) => setCampaignDetails({ ...campaignDetails, campaign: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAudienceDropdownOpen(!isAudienceDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all flex justify-between items-center"
                >
                  {campaignDetails.targetAudience}
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isAudienceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAudienceDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {targetAudiences.map((audience) => (
                      <button
                        key={audience}
                        onClick={() => {
                          setCampaignDetails({ ...campaignDetails, targetAudience: audience })
                          setIsAudienceDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 text-sm sm:text-base text-primary hover:bg-gray-50"
                      >
                        {audience}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Offer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Offer</label>
              <input
                type="text"
                value={campaignDetails.offer}
                onChange={(e) => setCampaignDetails({ ...campaignDetails, offer: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={campaignDetails.expirationDate}
                  onChange={(e) => setCampaignDetails({ ...campaignDetails, expirationDate: e.target.value })}
                  placeholder="DD/MM/YYYY"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Product for Sale */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product for Sale</label>
              <input
                type="text"
                value={campaignDetails.selectedProduct}
                onChange={(e) => setCampaignDetails({ ...campaignDetails, selectedProduct: e.target.value })}
                placeholder="e.g., Summer Collection"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-primary">AI-Powered Flyer Generator</h3>
                <p className="text-sm text-gray-600">Instantly create eye-catching promotional flyers with AI, ready to share.</p>
              </div>
            </div>
            <button
              onClick={handleGenerateFlyer}
              className="w-full bg-primary text-secondary border-none px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg"
            >
              <Rocket className="w-5 h-5" />
              Generate Flyer
            </button>
          </div>
        </div>

        {/* Flyer Preview */}
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg relative">
          <div className="w-64 h-[450px] bg-white rounded-2xl shadow-xl overflow-hidden relative border-8 border-gray-800 flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center">
                <Lightbulb className="w-12 h-12 text-primary animate-pulse mb-4" />
                <p className="text-primary font-semibold text-center">Generating flyer...</p>
              </div>
            ) : generatedFlyer ? (
              // Display the generated flyer image
              <img src={generatedFlyer} alt="Generated Flyer" className="w-full h-full object-cover" />
            ) : (
              // Initial state or if generation failed/no flyer yet
              <div className="flex flex-col items-center text-gray-400">
                <FileText className="w-12 h-12 mb-4" />
                <p className="text-center">Click "Generate Flyer" to see preview</p>
              </div>
            )}
            {/* Optional: Overlay dynamic text here if not part of generated image */}
            {generatedFlyer && !isGenerating && (
               <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center p-4" style={{ pointerEvents: 'none' }}>
                  {/* Example of dynamic text overlay (if the image itself is static and you want to add text on top) */}
                  {/* <p className="text-red-600 text-lg font-bold">{campaignDetails.offer}</p> */}
               </div>
            )}
          </div>
          
          <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={handleShareSMS}
              disabled={!generatedFlyer || isGenerating} // Disable if no flyer or generating
              className="w-full bg-green-500 text-white border-none px-6 py-3 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-green-600 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-5 h-5" />
              Share via SMS
            </button>
            <button
              onClick={handleShareEmail}
              disabled={!generatedFlyer || isGenerating} // Disable if no flyer or generating
              className="w-full bg-blue-500 text-white border-none px-6 py-3 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-blue-600 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-5 h-5" />
              Share via Email
            </button>
            <button
              onClick={handleShareWhatsapp}
              disabled={!generatedFlyer || isGenerating} // Disable if no flyer or generating
              className="w-full bg-green-600 text-white border-none px-6 py-3 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-green-700 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaWhatsapp className="w-5 h-5" />
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

