// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { AIHistory, Itinerary } from '../models/index.js';
// import { v4 as uuidv4 } from 'uuid';

// let genAI;
// let model;

// const initGemini = () => {
//   if (!genAI && process.env.GEMINI_API_KEY) {
//     genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
//   }
// };

// const SYSTEM_PROMPT = `You are an expert AI Travel Planner for a premium travel agency. Your role is to create personalized, detailed, and actionable travel itineraries.

// When creating itineraries:
// 1. Provide day-by-day detailed plans with specific times
// 2. Include local restaurant recommendations with cuisine types
// 3. Suggest accommodation options for different budgets
// 4. Add transport details between locations
// 5. Include estimated costs in INR (Indian Rupees)
// 6. Provide practical travel tips, cultural notes, and safety advice
// 7. Suggest the best local experiences and hidden gems
// 8. Consider seasonal factors and weather

// STRICT FORMATTING RULES — follow these without exception:
// - Never use ** or __ for bold text anywhere in your response
// - Never use * or _ for italic text
// - Never use markdown symbols like #, ##, ###, >, ---, or ~~~
// - Never use bullet points with *, -, or + symbols
// - Use plain numbered lists (1. 2. 3.) for sequences or steps
// - Use plain section labels followed by a colon, for example: "Day 1: Arrival and Exploration"
// - Use indentation and blank lines to visually separate sections
// - Write in a warm, conversational tone using plain readable sentences

// When asked for an itinerary, provide it in JSON format within <itinerary_json> tags for parsing, followed by a clean plain-text human-readable summary using the formatting rules above.

// Be conversational, enthusiastic, and helpful. Ask clarifying questions when needed.`;

// // @desc    Chat with AI planner
// export const chatWithAI = async (req, res, next) => {
//   try {
//     initGemini();

//     if (!model) {
//       // Mock response when API key not configured
//       return res.json({
//         success: true,
//         message: `I would love to help you plan your trip!

// Here is what I suggest for a ${req.body.days || 7}-day trip to ${req.body.destination || 'your dream destination'}:

// Day 1 to 2: Arrival and Orientation
//   Check into your hotel and explore the local neighborhood.
//   Visit iconic landmarks and get a feel for the city.
//   Try local street food for dinner.

// Day 3 to 4: Cultural Immersion
//   Visit museums and historical sites in the morning.
//   Join a guided walking tour in the afternoon.
//   Enjoy an evening cultural show or performance.

// Day 5 to 6: Nature and Adventure
//   Take day trips to nearby attractions.
//   Try adventure activities based on your preference.
//   End the day at the best sunset viewing spots.

// Day 7: Shopping and Departure
//   Explore local markets and pick up souvenirs.
//   Enjoy a final meal at a rooftop restaurant.
//   Head to the airport with wonderful memories.

// Note: Connect your Gemini API key for fully personalized, detailed itineraries tailored just for you!`,
//         sessionId: uuidv4(),
//         isMock: true
//       });
//     }

//     const { message, sessionId, context } = req.body;

//     let history = [];
//     let aiSession = null;

//     if (sessionId) {
//       aiSession = await AIHistory.findOne({ sessionId, user: req.user._id });
//       if (aiSession) {
//         history = aiSession.messages.map(m => ({
//           role: m.role,
//           parts: [{ text: m.content }]
//         }));
//       }
//     }

//     const currentSessionId = sessionId || uuidv4();

//     const chat = model.startChat({
//       history: [
//         { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
//         { role: 'model', parts: [{ text: 'I understand. I am your AI Travel Planner, ready to create amazing personalized travel experiences!' }] },
//         ...history
//       ]
//     });

//     const contextualMessage = context
//       ? `Context: Destination: ${context.destination || 'flexible'}, Budget: ₹${context.budget || 'flexible'}, Duration: ${context.days || '?'} days, Group: ${context.groupSize || 1} ${context.groupType || 'travelers'}, Season: ${context.season || 'any'}, Preferences: ${(context.preferences || []).join(', ')}\n\nUser message: ${message}`
//       : message;

//     const result = await chat.sendMessage(contextualMessage);
//     const response = result.response.text();

//     // Save to history
//     const newMessages = [
//       { role: 'user', content: message },
//       { role: 'model', content: response }
//     ];

//     if (aiSession) {
//       aiSession.messages.push(...newMessages);
//       await aiSession.save();
//     } else {
//       await AIHistory.create({
//         user: req.user._id,
//         sessionId: currentSessionId,
//         messages: newMessages,
//         context: context || {}
//       });
//     }

//     res.json({ success: true, message: response, sessionId: currentSessionId });
//   } catch (error) {
//     console.error('chatWithAI error:', error);
//     res.status(500).json({ message: error.message, stack: error.stack });
//     next(error);
//   }
// };







// // @desc    Generate itinerary
// export const generateItinerary = async (req, res, next) => {
//   try {
//     initGemini();

//     const { destination, days, budget, groupSize, groupType, preferences, season } = req.body;

//     const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}.
//     Budget: ₹${budget} total (${budget / days} per day)
//     Group: ${groupSize} ${groupType || 'travelers'}
//     Season: ${season || 'current'}
//     Preferences: ${(preferences || []).join(', ')}

//     Provide the itinerary in this exact JSON format within <itinerary_json> tags:
//     {
//       "title": "Trip title",
//       "totalEstimatedCost": number,
//       "currency": "INR",
//       "dayPlans": [
//         {
//           "day": 1,
//           "title": "Day title",
//           "description": "Overview",
//           "activities": [
//             {
//               "time": "9:00 AM",
//               "activity": "Activity name",
//               "location": "Place name",
//               "duration": "2 hours",
//               "cost": 500,
//               "notes": "Tips",
//               "category": "sightseeing"
//             }
//           ],
//           "accommodation": {"name": "Hotel name", "type": "hotel", "cost": 2000},
//           "meals": [{"type": "breakfast", "place": "Restaurant", "cuisine": "Local", "cost": 200}],
//           "transport": [{"from": "A", "to": "B", "mode": "taxi", "duration": "30 min", "cost": 300}],
//           "tips": ["Tip 1"],
//           "totalDayCost": 5000
//         }
//       ]
//     }

//     After the JSON, write a friendly plain-text summary with highlights and travel tips.
//     Do not use any markdown formatting in the summary. No **, no *, no #, no bullet dashes.
//     Use plain section labels like "Day 1:" and numbered lists only. Write in warm, readable sentences.`;

//     let itineraryData = null;
//     let responseText = '';

//     if (model) {
//       const result = await model.generateContent(prompt);
//       responseText = result.response.text();

//       const jsonMatch = responseText.match(/<itinerary_json>([\s\S]*?)<\/itinerary_json>/);
//       if (jsonMatch) {
//         try {
//           itineraryData = JSON.parse(jsonMatch[1].trim());
//         } catch (e) {
//           console.error('JSON parse error:', e);
//         }
//       }
//     } else {
//       // Mock itinerary
//       itineraryData = {
//         title: `${days} Days in ${destination}`,
//         totalEstimatedCost: budget,
//         currency: 'INR',
//         dayPlans: Array.from({ length: days }, (_, i) => ({
//           day: i + 1,
//           title: `Day ${i + 1} - Explore ${destination}`,
//           description: `Discover the best of ${destination} on day ${i + 1}`,
//           activities: [
//             { time: '9:00 AM', activity: 'Breakfast at local cafe', location: destination, duration: '1 hour', cost: 300, category: 'food' },
//             { time: '10:00 AM', activity: 'Sightseeing tour', location: destination, duration: '3 hours', cost: 800, category: 'sightseeing' },
//             { time: '2:00 PM', activity: 'Lunch at recommended restaurant', location: destination, duration: '1 hour', cost: 600, category: 'food' },
//             { time: '4:00 PM', activity: 'Local market visit', location: destination, duration: '2 hours', cost: 500, category: 'shopping' },
//             { time: '7:00 PM', activity: 'Dinner at rooftop restaurant', location: destination, duration: '2 hours', cost: 1000, category: 'food' }
//           ],
//           accommodation: { name: 'Recommended Hotel', type: 'hotel', cost: Math.floor(budget / days / 3) },
//           meals: [],
//           transport: [{ from: 'Hotel', to: 'Attractions', mode: 'taxi', duration: '15 min', cost: 200 }],
//           tips: ['Carry water', 'Book in advance', 'Try local street food'],
//           totalDayCost: Math.floor(budget / days)
//         }))
//       };
//       responseText = `Here is your ${days}-day itinerary for ${destination}!

// This is a sample itinerary to give you a preview of the experience. Connect your Gemini API key to get a fully personalized plan with specific restaurant recommendations, local insider tips, and optimized day-by-day routes.`;
//     }

//     // Save itinerary to DB
//     const savedItinerary = await Itinerary.create({
//       user: req.user._id,
//       title: itineraryData?.title || `${days} Days in ${destination}`,
//       destination,
//       days,
//       budget,
//       groupSize,
//       groupType,
//       preferences,
//       season,
//       dayPlans: itineraryData?.dayPlans || [],
//       totalEstimatedCost: itineraryData?.totalEstimatedCost || budget,
//       isAIGenerated: true,
//       isSaved: true
//     });

//     res.json({
//       success: true,
//       itinerary: savedItinerary,
//       summary: responseText,
//       itineraryId: savedItinerary._id
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get AI chat history
// export const getAIHistory = async (req, res, next) => {
//   try {
//     const sessions = await AIHistory.find({ user: req.user._id })
//       .select('sessionId context createdAt messages')
//       .sort({ createdAt: -1 })
//       .limit(10);
//     res.json({ success: true, sessions });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get user itineraries
// export const getUserItineraries = async (req, res, next) => {
//   try {
//     const itineraries = await Itinerary.find({ user: req.user._id })
//       .sort({ createdAt: -1 });
//     res.json({ success: true, itineraries });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get single itinerary
// export const getItinerary = async (req, res, next) => {
//   try {
//     const itinerary = await Itinerary.findOne({ _id: req.params.id, user: req.user._id });
//     if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });
//     res.json({ success: true, itinerary });
//   } catch (error) {
//     next(error);
//   }
// };



import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIHistory, Itinerary } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

let genAI;
let model;

// Initialize Gemini
const initGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY missing');
    return;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    console.log('✅ Gemini initialized');
  }
};

// Extract response safely
const extractText = (result) => {
  try {
    if (result?.response?.candidates?.length > 0) {
      return result.response.candidates[0].content.parts
        .map(p => p.text || '')
        .join('');
    }
    return 'No response generated by AI.';
  } catch (err) {
    console.error('❌ Extract error:', err);
    return 'Error extracting AI response';
  }
};

// SYSTEM PROMPT
const SYSTEM_PROMPT = `You are an expert AI Travel Planner.

Create detailed itineraries with:
- Day-wise plans
- Costs in INR
- Hotels, food, transport
- Travel tips

Do not use markdown symbols. Keep plain readable format.`;

// CHAT CONTROLLER
export const chatWithAI = async (req, res) => {
  try {
    initGemini();

    const { message, sessionId, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message required' });
    }

    if (!model) {
      return res.json({
        success: true,
        message: '⚠️ AI not configured. Add GEMINI_API_KEY.',
        sessionId: uuidv4(),
        isMock: true
      });
    }

    let history = [];
    let aiSession = null;

    if (sessionId) {
      aiSession = await AIHistory.findOne({ sessionId, user: req.user._id });
      if (aiSession) {
        history = aiSession.messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));
      }
    }

    const chat = model.startChat({ history });

    const contextualMessage = `
${SYSTEM_PROMPT}

Context:
Destination: ${context?.destination || 'flexible'}
Budget: ₹${context?.budget || 'flexible'}
Days: ${context?.days || '?'}

User: ${message}
`;

    let result;

    try {
      result = await chat.sendMessage(contextualMessage);
    } catch (err) {
      console.error('❌ Gemini API error:', err);
      return res.status(500).json({ success: false, message: 'AI failed to respond' });
    }

    const response = extractText(result);

    const newMessages = [
      { role: 'user', content: message },
      { role: 'model', content: response }
    ];

    const currentSessionId = sessionId || uuidv4();

    if (aiSession) {
      aiSession.messages.push(...newMessages);
      await aiSession.save();
    } else {
      await AIHistory.create({
        user: req.user._id,
        sessionId: currentSessionId,
        messages: newMessages,
        context: context || {}
      });
    }

    res.json({ success: true, message: response, sessionId: currentSessionId });

  } catch (error) {
    console.error('🔥 chatWithAI error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GENERATE ITINERARY
export const generateItinerary = async (req, res) => {
  try {
    initGemini();

    const { destination, days, budget } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!model) {
      return res.status(500).json({ success: false, message: 'Gemini not configured' });
    }

    const prompt = `
${SYSTEM_PROMPT}

Create ${days}-day itinerary for ${destination} within ₹${budget}.
Return JSON inside <itinerary_json> tags.
`;

    let result;

    try {
      result = await model.generateContent(prompt);
    } catch (err) {
      console.error('❌ Gemini error:', err);
      return res.status(500).json({ success: false, message: 'AI generation failed' });
    }

    const responseText = extractText(result);

    let itineraryData = null;

    const match = responseText.match(/<itinerary_json>([\s\S]*?)<\/itinerary_json>/);

    if (match) {
      try {
        itineraryData = JSON.parse(match[1]);
      } catch (err) {
        console.error('❌ JSON parse error:', err);
      }
    }

    if (!itineraryData) {
      return res.status(500).json({ success: false, message: 'Invalid AI response format' });
    }

    const saved = await Itinerary.create({
      user: req.user._id,
      title: itineraryData.title,
      destination,
      days,
      budget,
      dayPlans: itineraryData.dayPlans,
      totalEstimatedCost: itineraryData.totalEstimatedCost,
      isAIGenerated: true,
      isSaved: true
    });

    res.json({
      success: true,
      itinerary: saved,
      summary: responseText
    });

  } catch (error) {
    console.error('🔥 generateItinerary error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET HISTORY
export const getAIHistory = async (req, res) => {
  try {
    const sessions = await AIHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ITINERARIES
export const getUserItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, itineraries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE
export const getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ _id: req.params.id, user: req.user._id });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    res.json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
