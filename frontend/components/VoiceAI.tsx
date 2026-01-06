'use client'

import { useState } from 'react'
import { Mic, MicOff, Package, IndianRupee, User, Receipt } from 'lucide-react'

export default function VoiceAI() {
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('हिंदी')
  const [voiceStatus, setVoiceStatus] = useState({
    title: 'Tap to speak',
    description: 'Try: "Maggi ka stock kitna hai?" or "Today\'s sales batao"'
  })

  const languages = ['हिंदी', 'தமிழ்', 'తెలుగు', 'English']

  const toggleVoice = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setVoiceStatus({
        title: 'Listening...',
        description: 'Speak now in your preferred language'
      })
      setTimeout(() => {
        simulateVoiceCommand('demo')
      }, 2000)
    } else {
      setVoiceStatus({
        title: 'Tap to speak',
        description: 'Try: "Maggi ka stock kitna hai?" or "Today\'s sales batao"'
      })
    }
  }

  const simulateVoiceCommand = (type: string) => {
    const responses: Record<string, { command: string; response: string }> = {
      stock: {
        command: '"Maggi ka stock kitna hai?"',
        response: 'Maggi Noodles: 45 units in stock. Good stock level.'
      },
      sales: {
        command: '"Today\'s total sales batao"',
        response: 'Today\'s total sales: ₹45,280. Up 12.5% from yesterday.'
      },
      customer: {
        command: '"Ravi ko ₹200 udhar de do"',
        response: 'Credit of ₹200 added to Ravi Kumar\'s account. Total due: ₹1,200.'
      },
      bill: {
        command: '"₹500 ka bill banao"',
        response: 'Bill created for ₹500. Ready to print.'
      },
      demo: {
        command: 'Voice command detected',
        response: 'Processing your request...'
      }
    }

    const response = responses[type] || responses.demo
    setVoiceStatus({
      title: `You said: ${response.command}`,
      description: `✓ ${response.response}`
    })

    setTimeout(() => {
      if (isListening) {
        setVoiceStatus({
          title: 'Listening...',
          description: 'Speak now in your preferred language'
        })
      }
    }, 3000)
  }

  const examples = [
    { icon: Package, text: '"Maggi ka stock kitna hai?"', lang: 'Hindi', type: 'stock' },
    { icon: IndianRupee, text: '"Today\'s total sales batao"', lang: 'Hinglish', type: 'sales' },
    { icon: User, text: '"Ravi ko ₹200 udhar de do"', lang: 'Hindi', type: 'customer' },
    { icon: Receipt, text: '"₹500 ka bill banao"', lang: 'Hindi', type: 'bill' },
  ]

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-primary mb-1">Voice AI Assistant</h1>
        <p className="text-gray-500 text-base">Speak in Hindi, Tamil, or Telugu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="relative mb-8">
            <div
              className={`w-[200px] h-[200px] rounded-full bg-primary flex items-center justify-center mx-auto relative z-10 transition-all ${
                isListening ? 'animate-pulse-icon' : ''
              }`}
            >
              {isListening ? (
                <MicOff className="w-20 h-20 text-secondary" />
              ) : (
                <Mic className="w-20 h-20 text-secondary" />
              )}
            </div>
            {isListening && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-2 border-primary rounded-full opacity-0 animate-wave"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-primary mb-2">{voiceStatus.title}</h3>
            <p className={`text-gray-600 text-[15px] ${voiceStatus.description.startsWith('✓') ? 'text-green-600 font-semibold mt-4' : ''}`}>
              {voiceStatus.description}
            </p>
          </div>

          <button
            onClick={toggleVoice}
            className="bg-primary text-secondary border-none px-8 py-4 rounded-xl text-base font-semibold cursor-pointer inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg mb-8"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Listening
              </>
            )}
          </button>

          <div className="flex gap-2 justify-center">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-5 py-2.5 border rounded-md font-medium cursor-pointer transition-all ${
                  selectedLanguage === lang
                    ? 'bg-primary text-secondary border-primary'
                    : 'bg-white border-gray-300 hover:border-primary'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-primary mb-6">Try These Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => {
              const Icon = example.icon
              return (
                <div
                  key={index}
                  onClick={() => simulateVoiceCommand(example.type)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-6 cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:-translate-y-0.5 hover:shadow-md group"
                >
                  <Icon className="w-6 h-6 mb-2 text-primary group-hover:text-secondary" />
                  <p className="font-semibold mb-2 text-primary group-hover:text-secondary">{example.text}</p>
                  <span className="text-xs text-gray-500 group-hover:text-gray-300">{example.lang}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

