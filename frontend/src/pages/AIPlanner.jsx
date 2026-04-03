import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiLoader, FiMap, FiSave, FiRefreshCw, FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'
import { sendAIMessage, generateAIItinerary, addUserMessage, clearMessages, setContext } from '../store/slices/aiSlice'
import PageWrapper from '../components/common/PageWrapper'

const QUICK_PROMPTS = [
  '🏖️ Plan a 5-day Goa beach trip for 2',
  '🏔️ 7-day Ladakh adventure under ₹50,000',
  '👨‍👩‍👧 Family trip to Kerala, 4 people, 8 days',
  '💑 Romantic Maldives honeymoon, 5 days',
  '🎒 Solo backpacking Europe, 2 weeks',
]

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary' : 'bg-gradient-to-br from-primary to-accent'}`}>
        {isUser ? <span className="text-white text-sm font-bold">U</span> : <RiRobot2Line className="text-white text-lg" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
        ? 'bg-primary text-white rounded-tr-sm'
        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-sm border border-gray-100 dark:border-gray-700'
      }`}>
        {msg.content.split('\n').map((line, i) => (
          <span key={i}>{line}{i < msg.content.split('\n').length - 1 && <br />}</span>
        ))}
      </div>
    </motion.div>
  )
}

export default function AIPlanner() {
  const dispatch = useDispatch()
  const { messages, loading, generating, context, sessionId, itineraries } = useSelector(s => s.ai)
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const [showContextForm, setShowContextForm] = useState(false)
  const [localContext, setLocalContext] = useState(context)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (messages.length === 0) {
      dispatch(addUserMessage(''))
      // Initial welcome - show intro message
    }
  }, [])

  const handleSend = (text) => {
    const msg = text || input.trim()
    if (!msg) return
    dispatch(addUserMessage(msg))
    dispatch(sendAIMessage({ message: msg, sessionId, context: localContext }))
    setInput('')
  }

  const handleGenerate = () => {
    if (!localContext.destination) return
    dispatch(generateAIItinerary(localContext))
    setActiveTab('itineraries')
  }

  const allMessages = messages.filter(m => m.content)

  return (
    <PageWrapper>
      <div className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-900 to-primary py-10 px-4">
          <div className="page-container text-center">
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <RiRobot2Line className="text-3xl text-white" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">AI Travel Planner</h1>
            <p className="text-white/70">Powered by Google Gemini. Chat to create your perfect itinerary.</p>
          </div>
        </div>

        <div className="page-container py-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm w-fit">
            {['chat', 'generate', 'itineraries'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                {tab === 'generate' ? '⚡ Quick Generate' : tab === 'itineraries' ? '📋 My Itineraries' : '💬 Chat'}
              </button>
            ))}
          </div>

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="card flex flex-col" style={{ height: '65vh' }}>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {allMessages.length === 0 && (
                      <div className="text-center py-12">
                        <RiRobot2Line className="text-6xl text-primary/30 mx-auto mb-4" />
                        <h3 className="font-heading text-xl font-bold text-gray-700 dark:text-white mb-2">Hello, Traveler! 👋</h3>
                        <p className="text-gray-400 text-sm mb-6">I'm your AI travel planner. Tell me where you want to go and I'll craft a perfect itinerary!</p>
                        <div className="flex flex-col gap-2 max-w-sm mx-auto">
                          {QUICK_PROMPTS.slice(0, 3).map(p => (
                            <button key={p} onClick={() => handleSend(p)} className="text-left text-sm px-4 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl text-primary transition-all">
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {allMessages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                    {loading && (
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                          <RiRobot2Line className="text-white text-lg" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                          <div className="flex gap-1">
                            {[0,1,2].map(i => (
                              <div key={i} className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask me anything about your trip..."
                        className="input-field flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        disabled={loading}
                      />
                      <button
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        className="btn-primary px-4 disabled:opacity-50"
                      >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Prompts Sidebar */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">Quick Start</h3>
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => handleSend(p)} className="w-full text-left text-xs px-3 py-2.5 bg-white dark:bg-gray-800 hover:bg-primary/5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-all">
                    {p}
                  </button>
                ))}
                <button onClick={() => dispatch(clearMessages())} className="w-full flex items-center gap-2 text-xs px-3 py-2.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                  <FiRefreshCw /> New Conversation
                </button>
              </div>
            </div>
          )}

          {/* QUICK GENERATE TAB */}
          {activeTab === 'generate' && (
            <div className="max-w-2xl mx-auto">
              <div className="card p-6 space-y-5">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Quick Itinerary Generator</h2>
                <p className="text-gray-500 text-sm">Fill in your trip details and get a full itinerary instantly!</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label dark:text-gray-300">Destination *</label>
                    <div className="relative">
                      <FiMap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="e.g., Bali, Paris, Rajasthan" className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={localContext.destination}
                        onChange={e => setLocalContext(c => ({ ...c, destination: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label dark:text-gray-300">Number of Days</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" min="1" max="30" className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={localContext.days}
                        onChange={e => setLocalContext(c => ({ ...c, days: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label dark:text-gray-300">Total Budget (₹)</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" min="5000" step="5000" className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={localContext.budget}
                        onChange={e => setLocalContext(c => ({ ...c, budget: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label dark:text-gray-300">Group Size</label>
                    <div className="relative">
                      <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="number" min="1" max="20" className="input-field pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        value={localContext.groupSize}
                        onChange={e => setLocalContext(c => ({ ...c, groupSize: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label dark:text-gray-300">Group Type</label>
                    <select className="input-field dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      value={localContext.groupType}
                      onChange={e => setLocalContext(c => ({ ...c, groupType: e.target.value }))}
                    >
                      {['solo', 'couple', 'family', 'friends'].map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label dark:text-gray-300">Travel Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {['adventure', 'culture', 'food', 'nature', 'shopping', 'relaxation', 'photography', 'history'].map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            const prefs = localContext.preferences || []
                            setLocalContext(c => ({
                              ...c,
                              preferences: prefs.includes(p) ? prefs.filter(x => x !== p) : [...prefs, p]
                            }))
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${(localContext.preferences || []).includes(p) ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating || !localContext.destination}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50"
                >
                  {generating
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating Itinerary...</span>
                    : '⚡ Generate My Itinerary'
                  }
                </button>
              </div>
            </div>
          )}

          {/* ITINERARIES TAB */}
          {activeTab === 'itineraries' && (
            <div>
              {itineraries.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-6xl mb-4">📋</p>
                  <h3 className="font-heading text-2xl font-bold text-gray-700 dark:text-white mb-2">No itineraries yet</h3>
                  <p className="text-gray-400 mb-6">Generate your first AI-powered itinerary!</p>
                  <button onClick={() => setActiveTab('generate')} className="btn-primary">Generate Itinerary</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {itineraries.map((itin, i) => (
                    <motion.div key={itin._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-heading font-bold text-gray-900 dark:text-white text-sm">{itin.title}</h3>
                        <span className="badge-primary text-xs">{itin.days}D</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500 mb-4">
                        <p>📍 {itin.destination}</p>
                        <p>👥 {itin.groupSize} {itin.groupType || 'travelers'}</p>
                        <p>💰 ₹{itin.totalEstimatedCost?.toLocaleString('en-IN')} estimated</p>
                        <p>📅 {new Date(itin.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {itin.dayPlans?.slice(0, 3).map(day => (
                          <div key={day.day} className="text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                            <span className="font-medium text-primary">Day {day.day}:</span> {day.title}
                          </div>
                        ))}
                        {(itin.dayPlans?.length || 0) > 3 && <p className="text-xs text-gray-400 text-center">+{itin.dayPlans.length - 3} more days</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
