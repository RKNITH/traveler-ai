import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';

dotenv.config();

// ─── DESTINATIONS ──────────────────────────────────────────────────────────────
const destinations = [

  // ── DOMESTIC ──────────────────────────────────────────────────────────────────

  {
    name: 'Goa',
    country: 'India',
    continent: 'Asia',
    type: 'domestic',
    description: "India's premier beach destination, Goa enchants visitors with its golden sandy beaches, azure waters, and a unique blend of Indian and Portuguese cultures. From the vibrant nightlife of Calangute and Baga to the peaceful shores of Palolem, every stretch of coastline has its own character. Explore 16th-century churches, spice plantations, and the bustling Saturday Night Market.",
    shortDescription: "Sun, sand & Portuguese charm on India's west coast",
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', alt: 'Goa Beach', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&q=80', alt: 'Goa Church', isPrimary: false },
    ],
    location: { coordinates: { lat: 15.2993, lng: 74.1240 }, address: 'Goa, India', timezone: 'Asia/Kolkata' },
    climate: { bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'], temperature: { min: 20, max: 35, unit: 'C' }, rainfall: 'Heavy monsoon June–September, dry October–May' },
    highlights: ['Pristine beaches like Baga, Calangute & Palolem', 'UNESCO-listed Basilica of Bom Jesus', 'Water sports — parasailing, jet ski, scuba diving', 'Vibrant nightlife and beach shacks', 'Dudhsagar Waterfall trekking', 'Spice plantation tours'],
    thingsToDo: [
      { title: 'Beach Hopping', description: 'Explore North Goa beaches for parties and South Goa for serenity.', category: 'Adventure' },
      { title: 'Scuba Diving', description: 'Discover coral reefs at Grande Island with certified instructors.', category: 'Adventure' },
      { title: 'Old Goa Churches', description: 'Visit Basilica of Bom Jesus housing the remains of St. Francis Xavier.', category: 'Culture' },
      { title: 'Spice Plantation Tour', description: 'Walk through aromatic spice gardens with a traditional Goan lunch.', category: 'Nature' },
      { title: 'Night Market Shopping', description: 'Shop for handcrafts, jewellery and clothes at Anjuna Flea Market.', category: 'Shopping' },
    ],
    travelTips: [
      "Rent a scooter for ₹300–500/day — best way to explore.",
      "Avoid peak season (Dec 20–Jan 5) for crowds; October & March are ideal.",
      "Carry cash as many beach shacks don't accept cards.",
      "Book water sports directly on the beach to avoid touts.",
      "Try local Goan fish curry rice at any beach shack for authentic flavour.",
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'No visa required for Indian nationals.' },
    currency: { code: 'INR', name: 'Indian Rupee', exchangeRate: 1 },
    language: ['Konkani', 'English', 'Hindi', 'Marathi'],
    safetyRating: 4,
    popularityScore: 95,
    tags: ['beach', 'nightlife', 'heritage', 'water-sports', 'romantic'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Kerala',
    country: 'India',
    continent: 'Asia',
    type: 'domestic',
    description: "Dubbed 'God's Own Country', Kerala is a land of serene backwaters, mist-covered hill stations, and lush rainforests. Cruise along the famous backwaters of Alleppey on a traditional houseboat, stroll through Munnar's endless tea gardens, rejuvenate with authentic Ayurvedic therapies, and witness the vibrant Kathakali dance performances. Kerala's cuisine — known for its coconut and spice-rich flavours — is a culinary journey in itself.",
    shortDescription: "God's Own Country — backwaters, spices & Ayurveda",
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', alt: 'Kerala Backwaters', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80', alt: 'Munnar Tea Gardens', isPrimary: false },
    ],
    location: { coordinates: { lat: 10.8505, lng: 76.2711 }, address: 'Kerala, India', timezone: 'Asia/Kolkata' },
    climate: { bestMonths: ['September', 'October', 'November', 'December', 'January', 'February'], temperature: { min: 18, max: 32, unit: 'C' }, rainfall: 'Southwest monsoon June–August, northeast monsoon Oct–Nov' },
    highlights: ['Alleppey houseboat cruise on backwaters', 'Munnar tea estate walks at 1,600m altitude', 'Periyar Wildlife Sanctuary — elephants and tigers', 'Authentic Panchakarma Ayurveda retreats', 'Varkala and Kovalam cliff beaches', 'Kathakali and Mohiniyattam cultural shows'],
    thingsToDo: [
      { title: 'Houseboat Stay', description: "Overnight cruise through Alleppey backwaters on a traditional kettuvallam.", category: 'Relaxation' },
      { title: 'Tea Plantation Walk', description: "Morning walk through Munnar's rolling tea gardens with factory tour.", category: 'Nature' },
      { title: 'Ayurveda Therapy', description: 'Full-body Abhyanga massage and Shirodhara treatment at a certified centre.', category: 'Wellness' },
      { title: 'Periyar Boat Ride', description: 'Spot wild elephants and bison on the Periyar Lake boat safari.', category: 'Adventure' },
      { title: 'Kathakali Show', description: 'Attend an evening Kathakali performance in Kochi or Thekkady.', category: 'Culture' },
    ],
    travelTips: [
      'Book houseboats directly with operators in Alleppey for better rates.',
      "September to March is ideal; avoid peak summer (April–May) in Munnar.",
      "Carry light cotton clothes — it's humid near the coast.",
      'Try Kerala Sadhya (feast on banana leaf) during festivals.',
      'Pre-book Ayurveda retreats as good centres fill up quickly.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'No visa required for Indian nationals.' },
    currency: { code: 'INR', name: 'Indian Rupee', exchangeRate: 1 },
    language: ['Malayalam', 'English', 'Tamil'],
    safetyRating: 5,
    popularityScore: 92,
    tags: ['backwaters', 'nature', 'ayurveda', 'wildlife', 'honeymoon'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Rajasthan',
    country: 'India',
    continent: 'Asia',
    type: 'domestic',
    description: "The Land of Kings, Rajasthan is India's most majestic state — a royal tapestry of golden sandstone forts, opulent palace hotels, and endless Thar Desert dunes. Explore Jaipur's Pink City bazaars, sail on Udaipur's lake palaces, walk through Jodhpur's blue-painted old city, and end the day beneath a canopy of stars at a desert camp in Jaisalmer. Every corner of Rajasthan tells a story of warriors, maharajas, and timeless tradition.",
    shortDescription: 'Royal forts, desert dunes & palace hotels',
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', alt: 'Rajasthan Palace', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', alt: 'Jaisalmer Desert', isPrimary: false },
    ],
    location: { coordinates: { lat: 27.0238, lng: 74.2179 }, address: 'Rajasthan, India', timezone: 'Asia/Kolkata' },
    climate: { bestMonths: ['October', 'November', 'December', 'January', 'February'], temperature: { min: 5, max: 40, unit: 'C' }, rainfall: 'Very low rainfall; hot summers, pleasant winters' },
    highlights: ['Amber Fort and City Palace in Jaipur', 'Lake Palace and City of Lakes — Udaipur', 'Camel safari and desert camp in Jaisalmer', 'Mehrangarh Fort overlooking blue city Jodhpur', 'Pushkar Camel Fair (November)', 'Ranthambore Tiger Reserve safari'],
    thingsToDo: [
      { title: 'Camel Safari', description: 'Sunset camel ride over the Sam Sand Dunes near Jaisalmer.', category: 'Adventure' },
      { title: 'Heritage Walk', description: "Guided walk through Jaipur's old bazaars — jewellery, textiles, and spices.", category: 'Culture' },
      { title: 'Boat Ride on Lake Pichola', description: 'Evening boat ride to the floating Lake Palace hotel in Udaipur.', category: 'Relaxation' },
      { title: 'Tiger Safari', description: 'Jeep safari in Ranthambore to spot Bengal tigers in their natural habitat.', category: 'Adventure' },
      { title: 'Palace Hotel Stay', description: 'Stay in a converted royal palace hotel — a quintessential Rajasthan experience.', category: 'Luxury' },
    ],
    travelTips: [
      'October to February is the best time; summers above 45°C are brutal.',
      'Book palace hotels and desert camps 2–3 months in advance.',
      'Negotiate firmly at bazaars — start at 40% of the quoted price.',
      'Wear light cotton during day, carry a warm layer for cold desert nights.',
      'Hire a local guide in Jaipur to unlock the history behind every carving.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'No visa required for Indian nationals.' },
    currency: { code: 'INR', name: 'Indian Rupee', exchangeRate: 1 },
    language: ['Rajasthani', 'Hindi', 'English'],
    safetyRating: 4,
    popularityScore: 90,
    tags: ['heritage', 'royal', 'desert', 'culture', 'wildlife'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Manali & Spiti',
    country: 'India',
    continent: 'Asia',
    type: 'domestic',
    description: "Nestled in the Himalayas, Manali and the Spiti Valley offer some of India's most dramatic landscapes — snow-peaked mountains, ancient Buddhist monasteries perched on cliffsides, and crystal-clear rivers. From the Rohtang Pass adventure to the serene Spiti River valley with its mud-brick villages and stark lunar landscapes, this is the ultimate mountain escape for trekkers, bikers, and spiritual seekers alike.",
    shortDescription: 'Himalayan peaks, Buddhist monasteries & snow passes',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', alt: 'Manali Mountains', isPrimary: true },
    ],
    location: { coordinates: { lat: 32.2396, lng: 77.1887 }, address: 'Manali, Himachal Pradesh, India', timezone: 'Asia/Kolkata' },
    climate: { bestMonths: ['May', 'June', 'July', 'August', 'September', 'October'], temperature: { min: -10, max: 25, unit: 'C' }, rainfall: 'Snowfall December–March; pleasant May–October' },
    highlights: ['Rohtang Pass at 3,978m — snow year-round', 'Key Monastery in Spiti at 4,166m altitude', 'Solang Valley skiing and paragliding', 'Triund Trek with panoramic Dhauladhar views', 'Old Manali cafes and hippie culture', 'River rafting on Beas River'],
    thingsToDo: [
      { title: 'Rohtang Pass Drive', description: 'Day trip to Rohtang Pass for snow activities — skiing and sledging.', category: 'Adventure' },
      { title: 'Spiti Monastery Trail', description: 'Visit Key, Tabo, and Dhankar monasteries across 3 days.', category: 'Culture' },
      { title: 'Paragliding at Solang', description: 'Tandem paragliding over the Solang Valley snow bowl.', category: 'Adventure' },
      { title: 'Triund Trek', description: 'Two-day trek to Triund meadow with stunning Himalayan panorama.', category: 'Adventure' },
      { title: 'River Rafting', description: 'Grade II–III white-water rafting on the Beas River near Kullu.', category: 'Adventure' },
    ],
    travelTips: [
      'Carry AMS (altitude sickness) medication and acclimatise for a day in Manali.',
      'Rohtang Pass permit is mandatory — book online at manalifun.in.',
      'Roads to Spiti are open only June to October; snow blocks them otherwise.',
      'Carry warm layers even in July — nights in Spiti drop below 5°C.',
      'Fuel up in Manali — petrol stations are scarce in Spiti Valley.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'Inner Line Permit required for Spiti areas beyond Kaza.' },
    currency: { code: 'INR', name: 'Indian Rupee', exchangeRate: 1 },
    language: ['Hindi', 'Pahadi', 'English'],
    safetyRating: 3,
    popularityScore: 85,
    tags: ['mountains', 'adventure', 'trekking', 'buddhist', 'snow'],
    isActive: true,
    isFeatured: false,
  },

  {
    name: 'Andaman Islands',
    country: 'India',
    continent: 'Asia',
    type: 'domestic',
    description: "The Andaman Islands are India's hidden tropical paradise — an archipelago of 572 islands in the Bay of Bengal with some of Asia's most pristine beaches, crystal-clear waters and vibrant coral reefs. Radhanagar Beach is consistently rated among Asia's best beaches. The Cellular Jail in Port Blair stands as a powerful reminder of India's freedom struggle. Scuba diving and snorkelling here reveal an underwater world of extraordinary biodiversity.",
    shortDescription: 'Pristine islands, coral reefs & turquoise waters',
    coverImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80', alt: 'Andaman Beach', isPrimary: true },
    ],
    location: { coordinates: { lat: 11.7401, lng: 92.6586 }, address: 'Port Blair, Andaman & Nicobar Islands, India', timezone: 'Asia/Kolkata' },
    climate: { bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'], temperature: { min: 23, max: 32, unit: 'C' }, rainfall: 'Monsoon May–October; dry November–April' },
    highlights: ["Radhanagar Beach — Asia's top beach (Havelock Island)", 'Scuba diving at Elephant Beach coral reefs', 'Cellular Jail light & sound show in Port Blair', 'Glass-bottom boat rides over live coral', 'Sea-walking and snorkelling at Neil Island', 'Mangrove kayaking in Baratang'],
    thingsToDo: [
      { title: 'Scuba Diving', description: 'Dive at Elephant Beach or Havelock for spectacular coral and marine life.', category: 'Adventure' },
      { title: 'Cellular Jail Visit', description: 'Tour the historic Cellular Jail and attend the evening light-and-sound show.', category: 'Culture' },
      { title: 'Sea Walking', description: 'Walk on the ocean floor with a helmet suit at North Bay Island.', category: 'Adventure' },
      { title: 'Kayaking in Mangroves', description: 'Kayak through the dense mangrove creeks of Baratang Island.', category: 'Nature' },
      { title: 'Sunset at Radhanagar', description: "Watch one of Asia's most spectacular sunsets from Beach 7, Havelock.", category: 'Relaxation' },
    ],
    travelTips: [
      'Book ferry tickets between islands in advance during peak season.',
      'Carry cash — ATMs in remote islands are unreliable.',
      'A Restricted Area Permit (RAP) is needed for some tribal islands.',
      'Book scuba diving with PADI-certified operators only.',
      'Pack reef-safe sunscreen to protect the coral ecosystems.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'Indian nationals need RAP for specific restricted islands only.' },
    currency: { code: 'INR', name: 'Indian Rupee', exchangeRate: 1 },
    language: ['Hindi', 'Bengali', 'English', 'Tamil'],
    safetyRating: 5,
    popularityScore: 88,
    tags: ['beach', 'diving', 'island', 'honeymoon', 'snorkelling'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Varanasi',
    country: 'India',
    continent: 'Asia',
    type: 'domestic',
    description: "Varanasi — one of the world's oldest continuously inhabited cities — is the spiritual heart of India. The sacred ghats along the Ganges come alive at dawn with pilgrims, sadhus, and the aroma of incense. The evening Ganga Aarti is a hypnotic ritual of fire and devotion. Narrow lanes (gallis) wind through the old city past silk weavers, paan shops, and ancient temples. Varanasi is a place that moves every traveller to their core.",
    shortDescription: "India's spiritual capital on the banks of the Ganges",
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', alt: 'Varanasi Ghats', isPrimary: true },
    ],
    location: { coordinates: { lat: 25.3176, lng: 82.9739 }, address: 'Varanasi, Uttar Pradesh, India', timezone: 'Asia/Kolkata' },
    climate: { bestMonths: ['October', 'November', 'December', 'January', 'February', 'March'], temperature: { min: 8, max: 38, unit: 'C' }, rainfall: 'Hot summers; pleasant October–February' },
    highlights: ['Ganga Aarti at Dashashwamedh Ghat at sunset', 'Boat ride at sunrise along 84 sacred ghats', 'Kashi Vishwanath Temple — one of 12 Jyotirlingas', 'Sarnath — where Buddha gave his first sermon', 'Old city walk through silk-weaving lanes', 'Manikarnika Ghat — the eternal cremation site'],
    thingsToDo: [
      { title: 'Sunrise Boat Ride', description: 'Early morning row boat ride past the ghats as the city wakes up.', category: 'Culture' },
      { title: 'Ganga Aarti', description: 'Attend the spectacular Ganga Aarti ceremony at Dashashwamedh Ghat.', category: 'Spiritual' },
      { title: 'Old City Heritage Walk', description: 'Guided walk through the narrow lanes discovering silk weavers and temples.', category: 'Culture' },
      { title: 'Sarnath Day Trip', description: 'Visit Sarnath, 12 km away, where Buddha gave his first sermon.', category: 'Spiritual' },
      { title: 'Banarasi Silk Shopping', description: 'Buy authentic Banarasi silk sarees and fabrics directly from weavers.', category: 'Shopping' },
    ],
    travelTips: [
      'Stay near the ghats — Assi Ghat area has excellent heritage guesthouses.',
      'Dawn is the most magical time; set your alarm for 5:30 AM.',
      'Dress modestly — cover shoulders and knees when entering temples.',
      'Avoid plastic bags — respect the sacred river.',
      'Try Banarasi paan, chaat, and malaiyo (winter dessert) — all unmissable.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'No visa required for Indian nationals.' },
    currency: { code: 'INR', name: 'Indian Rupee', exchangeRate: 1 },
    language: ['Hindi', 'Bhojpuri', 'English'],
    safetyRating: 3,
    popularityScore: 82,
    tags: ['spiritual', 'culture', 'heritage', 'religious', 'pilgrimage'],
    isActive: true,
    isFeatured: false,
  },

  // ── INTERNATIONAL ──────────────────────────────────────────────────────────────

  {
    name: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    type: 'international',
    description: "The Maldives is the ultimate luxury escape — 1,200 coral islands scattered across the Indian Ocean, each ringed by turquoise lagoons and powdery white sand. Iconic overwater bungalows allow you to fall asleep to the sound of the ocean directly beneath you. World-class diving and snorkelling reveal manta rays, whale sharks, and kaleidoscopic reef fish. This is the most romantic destination on earth, perfectly crafted for honeymooners and luxury travellers.",
    shortDescription: 'Overwater bungalows, lagoons & world-class diving',
    coverImage: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80', alt: 'Maldives Overwater Villa', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80', alt: 'Maldives Snorkelling', isPrimary: false },
    ],
    location: { coordinates: { lat: 3.2028, lng: 73.2207 }, address: 'Malé, Maldives', timezone: 'Indian/Maldives' },
    climate: { bestMonths: ['November', 'December', 'January', 'February', 'March', 'April'], temperature: { min: 24, max: 32, unit: 'C' }, rainfall: 'Dry season Nov–April; wet season May–Oct' },
    highlights: ['Overwater bungalows with direct ocean access', 'Snorkelling with manta rays and whale sharks', 'Bioluminescent beach at night on Vaadhoo Island', "World's best dive sites — Maaya Thila, Fish Head", 'Sunset dolphin cruises', 'Underwater restaurant dining at Ithaa'],
    thingsToDo: [
      { title: 'Snorkelling Safari', description: 'Boat snorkelling trip to spot reef sharks, turtles, and manta rays.', category: 'Adventure' },
      { title: 'Sunset Dolphin Cruise', description: 'Evening cruise to watch hundreds of spinner dolphins in the open ocean.', category: 'Nature' },
      { title: 'Scuba Diving', description: 'Dive at world-renowned sites like Maaya Thila for pelagic fish and sharks.', category: 'Adventure' },
      { title: 'Underwater Dining', description: "Dine at the world's first all-glass undersea restaurant, Ithaa.", category: 'Luxury' },
      { title: 'Island Hopping', description: 'Seaplane tour over the atolls, stopping at uninhabited sandbanks.', category: 'Relaxation' },
    ],
    travelTips: [
      "Book resort + seaplane transfers together — it's cheaper as a package.",
      'Public island guesthouses (Maafushi, Thulusdhoo) offer 70% cheaper alternatives to resorts.',
      'Alcohol is only available at resort islands — not permitted on local islands.',
      'Best visibility for diving is January–April.',
      'Book 6–12 months in advance for Christmas/New Year visits.',
    ],
    visaInfo: { required: false, onArrival: true, eVisa: false, processingDays: 0, fee: 0, notes: '30-day free visa on arrival for all nationalities including Indian passport holders.' },
    currency: { code: 'MVR', name: 'Maldivian Rufiyaa', exchangeRate: 2.7 },
    language: ['Dhivehi', 'English'],
    safetyRating: 5,
    popularityScore: 97,
    tags: ['luxury', 'honeymoon', 'diving', 'beach', 'romantic', 'overwater'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    type: 'international',
    description: "Bali — the Island of the Gods — is a mesmerising blend of Hindu spirituality, lush tropical landscape, and world-class surf. From the iconic rice terraces of Tegalalang to the sacred Tanah Lot temple rising from the sea, Bali engages all the senses. Ubud's yoga retreats and art galleries offer creative sanctuary, while Seminyak's beach clubs and Canggu's surf breaks draw a cosmopolitan crowd. Bali is endlessly versatile — spiritual, adventurous, romantic, and utterly beautiful.",
    shortDescription: 'Hindu temples, rice terraces & surf culture',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', alt: 'Bali Rice Terraces', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', alt: 'Tanah Lot Temple', isPrimary: false },
    ],
    location: { coordinates: { lat: -8.3405, lng: 115.0920 }, address: 'Bali, Indonesia', timezone: 'Asia/Makassar' },
    climate: { bestMonths: ['May', 'June', 'July', 'August', 'September'], temperature: { min: 22, max: 33, unit: 'C' }, rainfall: 'Dry season May–September; wet season October–April' },
    highlights: ['Tegalalang Rice Terraces — iconic UNESCO landscape', 'Tanah Lot Temple at sunset over the sea', 'Ubud Monkey Forest and Royal Palace', 'Kuta and Seminyak beach clubs and surf', 'Sekumpul Waterfall — tallest in Bali', 'Traditional Kecak fire dance performance'],
    thingsToDo: [
      { title: 'Sunrise Trek on Mt Batur', description: 'Pre-dawn hike to the volcano summit for a spectacular sunrise above the clouds.', category: 'Adventure' },
      { title: 'Ubud Cooking Class', description: 'Learn to cook nasi goreng, satay and tempeh with a local Balinese family.', category: 'Culture' },
      { title: 'Temple Hopping', description: 'Visit Tanah Lot, Uluwatu, and Pura Besakih — the Mother Temple.', category: 'Spiritual' },
      { title: 'Kecak Dance Show', description: 'Attend the mesmerising Kecak fire dance at Uluwatu cliff temple at dusk.', category: 'Culture' },
      { title: 'Seminyak Beach Club', description: 'Spend an afternoon at Potato Head or Ku De Ta beach clubs in style.', category: 'Relaxation' },
    ],
    travelTips: [
      'Hire a private driver (₹2,500–3,500/day) — much easier than taxis.',
      'Respect temple etiquette — wear a sarong and sash at all Hindu temples.',
      'Dry season (June–August) is peak; shoulder season (May & September) is ideal.',
      'Negotiate at art markets in Ubud — prices are inflated for tourists.',
      'Try babi guling (suckling pig) and bebek betutu (smoked duck) — local delicacies.',
    ],
    visaInfo: { required: true, onArrival: true, eVisa: true, processingDays: 1, fee: 35, notes: 'Visa on Arrival available at Bali airport for Indian nationals. USD 35 for 30 days, extendable once.' },
    currency: { code: 'IDR', name: 'Indonesian Rupiah', exchangeRate: 550 },
    language: ['Balinese', 'Indonesian', 'English'],
    safetyRating: 4,
    popularityScore: 94,
    tags: ['spiritual', 'culture', 'beach', 'surfing', 'honeymoon', 'yoga'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    type: 'international',
    description: "Paris — La Ville Lumière — is the world's most visited city and the undisputed capital of romance, fashion, and culture. The Eiffel Tower glitters at night, the Louvre houses over 380,000 works of art, and Montmartre's winding streets feel unchanged from Picasso's era. Parisian café culture, world-class patisseries, and Michelin-starred cuisine make every meal an event. Whether it's a Seine River cruise at dusk or a stroll through the Luxembourg Gardens, Paris is pure magic.",
    shortDescription: 'The City of Light — romance, art & haute cuisine',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', alt: 'Eiffel Tower Paris', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80', alt: 'Paris Seine', isPrimary: false },
    ],
    location: { coordinates: { lat: 48.8566, lng: 2.3522 }, address: 'Paris, France', timezone: 'Europe/Paris' },
    climate: { bestMonths: ['April', 'May', 'June', 'September', 'October'], temperature: { min: 3, max: 25, unit: 'C' }, rainfall: 'Light rain year-round; sunny April–June and September' },
    highlights: ['Eiffel Tower — glittering light show at night', 'Louvre Museum — home of Mona Lisa', 'Montmartre and Sacré-Cœur Basilica', 'Seine River cruise at sunset', 'Versailles Palace day trip', 'Champs-Élysées and Arc de Triomphe'],
    thingsToDo: [
      { title: 'Eiffel Tower Visit', description: 'Go to the top floor for panoramic Paris views, especially at dusk.', category: 'Sightseeing' },
      { title: 'Louvre Museum', description: 'Half-day visit to see the Mona Lisa, Venus de Milo and Egyptian antiquities.', category: 'Culture' },
      { title: 'Seine River Cruise', description: 'Bateaux Mouches evening cruise past illuminated Parisian monuments.', category: 'Relaxation' },
      { title: 'Versailles Day Trip', description: 'Full-day trip to the Palace of Versailles and its 800-hectare gardens.', category: 'Culture' },
      { title: 'Montmartre Walk', description: "Wander Montmartre's cobbled streets, artist squares and vineyard.", category: 'Culture' },
    ],
    travelTips: [
      'Buy a Paris Museum Pass for skip-the-line entry to 50+ attractions.',
      "Use the Métro — it's cheap, fast and covers everywhere.",
      'Book Eiffel Tower tickets online 2–3 months ahead during summer.',
      'Carry small euro coins for public toilets and market purchases.',
      'The best macaron in Paris is at Ladurée or Pierre Hermé — a must-try.',
    ],
    visaInfo: { required: true, onArrival: false, eVisa: false, processingDays: 15, fee: 80, notes: 'Schengen visa required for Indian nationals. Apply at French Consulate 3–4 weeks in advance.' },
    currency: { code: 'EUR', name: 'Euro', exchangeRate: 90 },
    language: ['French', 'English'],
    safetyRating: 4,
    popularityScore: 98,
    tags: ['romance', 'culture', 'art', 'luxury', 'honeymoon', 'food'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    continent: 'Asia',
    type: 'international',
    description: "Dubai is the city of superlatives — the world's tallest building, the largest mall, the longest urban zipline, and the most luxurious hotels. Yet beneath the gleaming skyline lies the historic Al Fahidi quarter with its wind towers and spice souks, the abra boats crossing Dubai Creek, and the gold souk glittering with treasures. Dubai offers world-class shopping, desert adventures, and dining experiences that span every cuisine on earth.",
    shortDescription: 'Skyscrapers, desert safaris & tax-free shopping',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', alt: 'Dubai Skyline', isPrimary: true },
    ],
    location: { coordinates: { lat: 25.2048, lng: 55.2708 }, address: 'Dubai, United Arab Emirates', timezone: 'Asia/Dubai' },
    climate: { bestMonths: ['November', 'December', 'January', 'February', 'March'], temperature: { min: 14, max: 42, unit: 'C' }, rainfall: 'Very little rain; hot April–September; ideal November–March' },
    highlights: ["Burj Khalifa — world's tallest building at 828m", 'Dubai Mall and Dubai Fountain show', 'Desert safari with dune bashing and BBQ dinner', 'Palm Jumeirah and Atlantis Aquaventure', 'Gold Souk and Spice Souk in Deira', 'Dubai Frame with views of old and new Dubai'],
    thingsToDo: [
      { title: 'Burj Khalifa Sunset', description: 'Book Level 124 or 148 for a 360° sunset view over the Gulf.', category: 'Sightseeing' },
      { title: 'Desert Safari', description: 'Afternoon dune bashing followed by camel ride, henna, and BBQ under stars.', category: 'Adventure' },
      { title: 'Dubai Creek Abra Ride', description: 'Take a traditional wooden abra boat across Dubai Creek for 1 AED.', category: 'Culture' },
      { title: 'Ski Dubai', description: 'Hit the indoor ski slope inside Mall of the Emirates — snow in the desert!', category: 'Adventure' },
      { title: 'Dubai Frame', description: 'Walk the glass sky bridge linking old and new Dubai at the Dubai Frame.', category: 'Sightseeing' },
    ],
    travelTips: [
      'Dress modestly in public spaces — fines apply for inappropriate clothing.',
      'Book desert safari operators like Platinum Heritage for premium experiences.',
      'Dubai Metro is cheap and efficient — use it to avoid traffic.',
      'Ramadan brings limited restaurant hours but incredible Iftar experiences.',
      'Tax-free shopping makes electronics, perfumes and gold genuinely cheaper.',
    ],
    visaInfo: { required: true, onArrival: false, eVisa: true, processingDays: 3, fee: 3500, notes: 'e-Visa for Indian nationals available online in 3–5 days. ₹3,500 for 30-day single entry.' },
    currency: { code: 'AED', name: 'UAE Dirham', exchangeRate: 22.5 },
    language: ['Arabic', 'English', 'Hindi', 'Urdu'],
    safetyRating: 5,
    popularityScore: 96,
    tags: ['luxury', 'shopping', 'adventure', 'family', 'desert', 'modern'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Thailand',
    country: 'Thailand',
    continent: 'Asia',
    type: 'international',
    description: "Thailand — the Land of Smiles — is Southeast Asia's most beloved destination. Bangkok buzzes with golden temples, sky-high rooftop bars, and some of the world's best street food. Chiang Mai offers elephant sanctuaries and hill tribe treks. The islands of Koh Samui, Koh Tao, and the Phi Phi archipelago are tropical paradise — neon beach parties, limestone karsts rising from turquoise water, and spectacular sunsets. Thailand offers extraordinary value without compromising on beauty.",
    shortDescription: 'Golden temples, island hopping & legendary street food',
    coverImage: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80', alt: 'Thailand Temple', isPrimary: true },
    ],
    location: { coordinates: { lat: 15.8700, lng: 100.9925 }, address: 'Bangkok, Thailand', timezone: 'Asia/Bangkok' },
    climate: { bestMonths: ['November', 'December', 'January', 'February', 'March'], temperature: { min: 20, max: 35, unit: 'C' }, rainfall: 'Dry and cool Nov–Feb; hot March–May; wet June–October' },
    highlights: ['Grand Palace and Wat Phra Kaew in Bangkok', 'Phi Phi Islands and Maya Bay by speedboat', 'Elephant Nature Park — ethical elephant sanctuary', 'Chiang Mai Night Bazaar', 'Full Moon Party on Koh Phangan', 'Thai cooking class in Chiang Mai'],
    thingsToDo: [
      { title: 'Grand Palace Tour', description: "Guided morning tour of Bangkok's stunning Grand Palace and Emerald Buddha.", category: 'Culture' },
      { title: 'Island Hopping', description: 'Speed boat day trip to Phi Phi Don, Phi Phi Leh, and Maya Bay.', category: 'Adventure' },
      { title: 'Elephant Sanctuary', description: 'Ethical half-day with rescued elephants at Elephant Nature Park, Chiang Mai.', category: 'Nature' },
      { title: 'Thai Cooking Class', description: 'Morning market visit followed by cooking 5 traditional Thai dishes.', category: 'Culture' },
      { title: 'Muay Thai Show', description: "Watch a live Muay Thai boxing match at Bangkok's Rajadamnern Stadium.", category: 'Culture' },
    ],
    travelTips: [
      'Carry a small bag and be prepared for heat — always have water.',
      'Remove shoes before entering temples and dress modestly.',
      'Use Grab app instead of tuk-tuks to avoid fare gouging.',
      'Always negotiate at night markets — half the asking price is a fair start.',
      'Best street food: Pad Thai from a wok cart beats most restaurants.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'Visa exemption for Indian nationals for 30 days as of November 2023. No fee required.' },
    currency: { code: 'THB', name: 'Thai Baht', exchangeRate: 2.4 },
    language: ['Thai', 'English'],
    safetyRating: 4,
    popularityScore: 93,
    tags: ['beach', 'culture', 'food', 'budget', 'temples', 'island'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    type: 'international',
    description: "Singapore is Asia's most efficient and dazzling city-state — a tiny island that punches far above its weight in every area: world-class food courts (hawker centres), iconic supertree gardens at Gardens by the Bay, the futuristic Marina Bay Sands skyline, and the best airport on earth. Its multicultural fabric — Chinese, Malay, Indian, and Western — creates extraordinary cuisine and cultural diversity. The perfect hub for families, couples, and first-time international travellers.",
    shortDescription: 'Futuristic gardens, hawker food & multicultural magic',
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', alt: 'Singapore Marina Bay', isPrimary: true },
    ],
    location: { coordinates: { lat: 1.3521, lng: 103.8198 }, address: 'Singapore', timezone: 'Asia/Singapore' },
    climate: { bestMonths: ['February', 'March', 'April', 'May', 'June', 'July'], temperature: { min: 24, max: 32, unit: 'C' }, rainfall: 'Tropical, year-round warmth; drier Feb–August' },
    highlights: ['Gardens by the Bay — Supertree Grove light show', 'Marina Bay Sands SkyPark infinity pool', 'Universal Studios Singapore', 'Hawker Centre food trail — Lau Pa Sat, Newton', 'Sentosa Island beaches and cable car', 'Little India and Chinatown heritage walks'],
    thingsToDo: [
      { title: 'Gardens by the Bay', description: 'Explore Cloud Forest and Flower Dome, then catch the free Spectra light show.', category: 'Nature' },
      { title: 'Universal Studios', description: 'Full day at Universal Studios Singapore on Sentosa Island.', category: 'Adventure' },
      { title: 'Hawker Centre Food Tour', description: 'Evening food trail through Maxwell Food Centre for chicken rice and chilli crab.', category: 'Food' },
      { title: 'Night Safari', description: "World's first nocturnal zoo — encounter animals in their natural night habitat.", category: 'Nature' },
      { title: 'Sentosa Beach Club', description: 'Relax at Tanjong Beach Club or Siloso Beach on Sentosa Island.', category: 'Relaxation' },
    ],
    travelTips: [
      'Get an EZ-Link card for seamless MRT and bus travel.',
      "Chewing gum is technically restricted — don't bring it.",
      'Hawker centres offer incredible food for SGD 3–6 per dish.',
      'The Spectra light show at Marina Bay is free every night at 8pm and 9pm.',
      'Book Universal Studios skip-the-line express passes to maximise your day.',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'Visa-free entry for Indian nationals holding a valid US, UK, or Schengen visa. Otherwise, apply for a Singapore visa online.' },
    currency: { code: 'SGD', name: 'Singapore Dollar', exchangeRate: 62 },
    language: ['English', 'Mandarin', 'Malay', 'Tamil'],
    safetyRating: 5,
    popularityScore: 91,
    tags: ['family', 'modern', 'food', 'shopping', 'luxury', 'clean'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Switzerland',
    country: 'Switzerland',
    continent: 'Europe',
    type: 'international',
    description: "Switzerland is a land ripped straight from a fairy tale — the Swiss Alps rise in dramatic peaks above glacial lakes, pristine valleys, and chocolate-box villages. Jungfraujoch — the Top of Europe — takes you 3,454m above sea level via a cogwheel railway. Interlaken sits between two stunning lakes as the adventure capital. Geneva and Zurich combine cosmopolitan sophistication with lakeside serenity. Every train journey is a highlight in itself.",
    shortDescription: 'Alpine peaks, glacier trains & chocolate-box villages',
    coverImage: 'https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1502126324834-38f8e02d7160?w=800&q=80', alt: 'Swiss Alps', isPrimary: true },
    ],
    location: { coordinates: { lat: 46.8182, lng: 8.2275 }, address: 'Bern, Switzerland', timezone: 'Europe/Zurich' },
    climate: { bestMonths: ['June', 'July', 'August', 'December', 'January', 'February'], temperature: { min: -5, max: 25, unit: 'C' }, rainfall: 'Snow December–March; warm and sunny June–August' },
    highlights: ['Jungfraujoch — Top of Europe by cogwheel railway', 'Interlaken paragliding and skydiving', 'Grindelwald glacier hike and cable car', 'Lucerne Chapel Bridge and Lion Monument', 'Zurich lakefront and old town', 'Chocolate and cheese factory tours'],
    thingsToDo: [
      { title: 'Jungfraujoch Railway', description: 'Take the cogwheel train to 3,454m — UNESCO World Heritage site.', category: 'Adventure' },
      { title: 'Paragliding in Interlaken', description: 'Tandem paraglide over the Alps and Lake Thun from 2,000m.', category: 'Adventure' },
      { title: 'Glacier Hike', description: "Guided glacier walk on the Aletsch Glacier — Europe's longest ice stream.", category: 'Adventure' },
      { title: 'Swiss Cheese Fondue', description: 'Authentic fondue dinner in a mountain chalet in Gruyères village.', category: 'Food' },
      { title: 'Lucerne Day Trip', description: "Explore Lucerne's medieval old town, Chapel Bridge and Mount Pilatus.", category: 'Culture' },
    ],
    travelTips: [
      'Swiss Travel Pass offers unlimited rail, bus, and boat travel — excellent value.',
      'Book Jungfraujoch tickets online 2+ months in advance.',
      'Switzerland is expensive — budget CHF 150–250/day minimum.',
      'Trains run to the minute — Swiss punctuality is real.',
      'Carry a reusable water bottle — tap water everywhere is clean and delicious.',
    ],
    visaInfo: { required: true, onArrival: false, eVisa: false, processingDays: 15, fee: 80, notes: 'Schengen visa required for Indian nationals. Apply at the Swiss Embassy 3–4 weeks before travel.' },
    currency: { code: 'CHF', name: 'Swiss Franc', exchangeRate: 95 },
    language: ['German', 'French', 'Italian', 'English'],
    safetyRating: 5,
    popularityScore: 89,
    tags: ['mountains', 'snow', 'luxury', 'honeymoon', 'adventure', 'scenic'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Sri Lanka',
    country: 'Sri Lanka',
    continent: 'Asia',
    type: 'international',
    description: "Sri Lanka — the Pearl of the Indian Ocean — packs extraordinary diversity into a small island. Ancient rock fortresses at Sigiriya, UNESCO-listed temple cities of Anuradhapura, leopard-spotting safaris at Yala, world-class whale watching at Mirissa, colonial Galle Fort, and the lush central highlands with their cascading waterfalls and tea estates. Sri Lanka offers India-quality cultural richness at budget-friendly prices.",
    shortDescription: 'Ancient ruins, leopard safaris & tea-covered highlands',
    coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&q=80', alt: 'Sigiriya Rock', isPrimary: true },
    ],
    location: { coordinates: { lat: 7.8731, lng: 80.7718 }, address: 'Colombo, Sri Lanka', timezone: 'Asia/Colombo' },
    climate: { bestMonths: ['December', 'January', 'February', 'March', 'April'], temperature: { min: 22, max: 34, unit: 'C' }, rainfall: 'West and South best Dec–March; East coast best May–September' },
    highlights: ['Sigiriya Rock Fortress — UNESCO World Heritage', 'Yala National Park leopard safari', 'Blue whale watching from Mirissa beach', 'Galle Dutch Fort walking tour', 'Nuwara Eliya tea plantation stay', 'Temple of the Tooth in Kandy'],
    thingsToDo: [
      { title: 'Sigiriya Sunrise Climb', description: 'Hike Sigiriya rock at sunrise before the crowds — worth the effort.', category: 'Adventure' },
      { title: 'Yala Safari', description: "Morning and evening jeep safari for the world's highest density of wild leopards.", category: 'Adventure' },
      { title: 'Whale Watching', description: 'Boat trip from Mirissa to see blue whales and spinner dolphins offshore.', category: 'Nature' },
      { title: 'Tea Plantation Walk', description: 'Guided walk through Nuwara Eliya tea estates with factory tour and tasting.', category: 'Nature' },
      { title: 'Galle Fort Heritage Walk', description: 'Explore the 17th-century Dutch fort with its boutiques, cafes and ramparts.', category: 'Culture' },
    ],
    travelTips: [
      'Train from Kandy to Ella is one of the world\'s most scenic railway journeys — book early.',
      'Best time is Dec–March for the south and west; May–Aug for the east.',
      'Sri Lanka is very budget-friendly — excellent food for 500–800 LKR.',
      'Tuk-tuks are the most fun (and cheapest) way to get around small towns.',
      'Respect temple etiquette — no shorts, no bare shoulders.',
    ],
    visaInfo: { required: true, onArrival: false, eVisa: true, processingDays: 1, fee: 1200, notes: 'ETA (Electronic Travel Authorisation) for Indian nationals — apply online at eta.gov.lk. ₹1,200 approx for 30 days.' },
    currency: { code: 'LKR', name: 'Sri Lankan Rupee', exchangeRate: 0.28 },
    language: ['Sinhala', 'Tamil', 'English'],
    safetyRating: 4,
    popularityScore: 84,
    tags: ['wildlife', 'culture', 'heritage', 'beach', 'budget', 'nature'],
    isActive: true,
    isFeatured: false,
  },

  {
    name: 'Nepal',
    country: 'Nepal',
    continent: 'Asia',
    type: 'international',
    description: "Nepal is the rooftop of the world — home to eight of the ten highest peaks on earth, including Mount Everest. But Nepal offers far more than just altitude: Kathmandu's UNESCO-listed temple squares buzz with pilgrims and incense, Pokhara sits below the Annapurna massif with its serene Phewa Lake, and the Royal Chitwan National Park offers wild elephant rides and one-horned rhino safaris. Trekking in Nepal is a transformative experience unlike anything else.",
    shortDescription: 'Everest base camp, ancient temples & Himalayan trekking',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    images: [
      { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', alt: 'Nepal Himalayas', isPrimary: true },
    ],
    location: { coordinates: { lat: 28.3949, lng: 84.1240 }, address: 'Kathmandu, Nepal', timezone: 'Asia/Kathmandu' },
    climate: { bestMonths: ['October', 'November', 'March', 'April', 'May'], temperature: { min: 0, max: 28, unit: 'C' }, rainfall: 'Monsoon June–September; best trekking Oct–May' },
    highlights: ['Everest Base Camp trek — 12 days at 5,364m', 'Annapurna Circuit — world\'s most iconic trek', 'Pashupatinath Temple and Boudhanath Stupa', 'Paragliding over Pokhara and Phewa Lake', 'Chitwan National Park rhino and tiger safari', 'Sunrise over Himalaya from Nagarkot'],
    thingsToDo: [
      { title: 'EBC Trek', description: '14-day guided trek to Everest Base Camp through Sherpa villages and glaciers.', category: 'Adventure' },
      { title: 'Kathmandu Temple Walk', description: 'Guided walk through Pashupatinath, Boudhanath and Patan Durbar Square.', category: 'Culture' },
      { title: 'Paragliding in Pokhara', description: 'Tandem paraglide over the Annapurna range and Phewa Lake.', category: 'Adventure' },
      { title: 'Jungle Safari', description: 'Elephant-back safari and jeep tour in Chitwan for rhino and tiger sightings.', category: 'Adventure' },
      { title: 'Sunrise from Nagarkot', description: 'Pre-dawn drive to Nagarkot hill for golden Himalayan sunrise views.', category: 'Nature' },
    ],
    travelTips: [
      'India-issued passports do NOT need a visa for Nepal — just carry your passport.',
      'Trekking permits (TIMS and ACAP) are required — buy at Nepal Tourism Board office.',
      'AMS is serious — ascend slowly and carry Diamox if prone to altitude sickness.',
      'Book a TAAN-registered licensed guide for all high-altitude treks.',
      'Nepali Dal Bhat (rice, lentils, vegetables) is the trekker\'s staple — unlimited refills!',
    ],
    visaInfo: { required: false, onArrival: false, eVisa: false, processingDays: 0, fee: 0, notes: 'No visa required for Indian nationals. Indian passport holders can enter Nepal freely with a valid Indian passport or voter ID.' },
    currency: { code: 'NPR', name: 'Nepalese Rupee', exchangeRate: 0.65 },
    language: ['Nepali', 'English', 'Hindi'],
    safetyRating: 4,
    popularityScore: 87,
    tags: ['trekking', 'mountains', 'adventure', 'spiritual', 'budget', 'wildlife'],
    isActive: true,
    isFeatured: true,
  },
];

// ─── PACKAGES (one per destination) ──────────────────────────────────────────
const buildPackages = (dests) => dests.map((dest) => {
  const configs = {
    'Goa': {
      title: 'Goa Beach Paradise — 5 Days 4 Nights',
      duration: { days: 5, nights: 4 },
      pricing: { basePrice: 14999, adultPrice: 14999, childPrice: 9999, discountPercentage: 10, currency: 'INR' },
      category: ['beach', 'adventure'],
      difficulty: 'easy',
      inclusions: ['3-star beach resort accommodation', 'Daily breakfast and 2 dinners', 'Airport/railway transfers', 'North Goa sightseeing tour', 'Water sports package (parasailing, jet ski, banana boat)', 'Spice plantation tour with lunch', 'Professional trip coordinator'],
      exclusions: ['Flights/train to Goa', 'Lunch (except plantation day)', 'Personal expenses', 'Travel insurance', 'Scuba diving (available at extra cost)'],
    },
    'Kerala': {
      title: 'Kerala Backwaters & Hills — 7 Days 6 Nights',
      duration: { days: 7, nights: 6 },
      pricing: { basePrice: 27999, adultPrice: 27999, childPrice: 17999, discountPercentage: 15, currency: 'INR' },
      category: ['honeymoon', 'cultural'],
      difficulty: 'easy',
      inclusions: ['Heritage and resort accommodation', 'Daily breakfast and dinner', 'Alleppey houseboat overnight stay (all meals)', 'Munnar tea estate guided walk', 'Periyar boat ride', 'Ayurveda massage session (60 min)', 'Kathakali show tickets', 'All transfers and sightseeing'],
      exclusions: ['Flights to Kochi/Trivandrum', 'Lunch on non-houseboat days', 'Additional Ayurveda sessions', 'Travel insurance'],
    },
    'Rajasthan': {
      title: 'Royal Rajasthan Heritage — 10 Days 9 Nights',
      duration: { days: 10, nights: 9 },
      pricing: { basePrice: 44999, adultPrice: 44999, childPrice: 28999, discountPercentage: 5, currency: 'INR' },
      category: ['cultural', 'luxury'],
      difficulty: 'easy',
      inclusions: ['Heritage hotel / palace hotel accommodation', 'Daily breakfast and dinner', 'Jaipur – Jodhpur – Jaisalmer – Udaipur circuit', 'Camel safari and desert camp with cultural evening', 'All fort and palace entry tickets', 'AC private vehicle throughout', 'English-speaking guide for all cities'],
      exclusions: ['Flights to Jaipur / from Udaipur', 'Lunch', 'Personal shopping', 'Travel insurance', 'Tips'],
    },
    'Manali & Spiti': {
      title: 'Manali & Spiti Valley Adventure — 8 Days 7 Nights',
      duration: { days: 8, nights: 7 },
      pricing: { basePrice: 32999, adultPrice: 32999, childPrice: 21999, discountPercentage: 0, currency: 'INR' },
      category: ['adventure', 'cultural'],
      difficulty: 'challenging',
      inclusions: ['Mountain resort and guesthouse accommodation', 'Daily breakfast and dinner', 'Rohtang Pass excursion with snow activities', 'Spiti Valley monastery circuit (Key, Tabo, Dhankar)', 'River rafting on Beas', 'Solang Valley activities', 'All transfers in Tempo Traveller'],
      exclusions: ['Flights/train to Manali', 'Rohtang Pass permit fee (₹700)', 'Lunch', 'Personal expenses', 'Travel insurance'],
    },
    'Andaman Islands': {
      title: 'Andaman Island Escape — 6 Days 5 Nights',
      duration: { days: 6, nights: 5 },
      pricing: { basePrice: 39999, adultPrice: 39999, childPrice: 25999, discountPercentage: 10, currency: 'INR' },
      category: ['beach', 'adventure'],
      difficulty: 'easy',
      inclusions: ['Beach resort accommodation', 'Daily breakfast and dinner', 'Port Blair – Havelock – Neil Island circuit', 'All inter-island ferry tickets (govt/private)', 'Scuba diving session (1 dive, Elephant Beach)', 'Sea walking at North Bay Island', 'Cellular Jail light-and-sound show tickets', 'All transfers'],
      exclusions: ['Flights to Port Blair', 'Lunch', 'Additional dive packages', 'Personal expenses', 'Travel insurance'],
    },
    'Varanasi': {
      title: 'Varanasi Spiritual Immersion — 4 Days 3 Nights',
      duration: { days: 4, nights: 3 },
      pricing: { basePrice: 11999, adultPrice: 11999, childPrice: 7999, discountPercentage: 0, currency: 'INR' },
      category: ['cultural', 'pilgrimage'],
      difficulty: 'easy',
      inclusions: ['Heritage guesthouse near the ghats', 'Daily breakfast', 'Sunrise boat ride on the Ganges (2 mornings)', 'Ganga Aarti at Dashashwamedh Ghat', 'Old city heritage walk with guide', 'Sarnath day trip with entry tickets', 'Evening cultural show', 'All local transfers'],
      exclusions: ['Train/flights to Varanasi', 'Lunch and dinner', 'Personal expenses', 'Temple donation and prasad', 'Travel insurance'],
    },
    'Maldives': {
      title: 'Maldives Luxury Honeymoon — 5 Days 4 Nights',
      duration: { days: 5, nights: 4 },
      pricing: { basePrice: 119999, adultPrice: 119999, childPrice: 79999, discountPercentage: 5, currency: 'INR' },
      category: ['luxury', 'honeymoon'],
      difficulty: 'easy',
      inclusions: ['Water villa accommodation (overwater bungalow)', 'All meals (breakfast, lunch, dinner)', 'Speedboat airport transfer', 'Snorkelling safari with equipment', 'Sunset dolphin cruise', 'Complimentary honeymoon decoration and cake', 'Non-motorised water sports'],
      exclusions: ['International flights to Malé', 'Seaplane upgrade (if applicable)', 'Scuba diving courses', 'Spa treatments', 'Alcoholic beverages', 'Travel insurance'],
    },
    'Bali': {
      title: 'Bali Spiritual & Beach Journey — 8 Days 7 Nights',
      duration: { days: 8, nights: 7 },
      pricing: { basePrice: 54999, adultPrice: 54999, childPrice: 34999, discountPercentage: 10, currency: 'INR' },
      category: ['honeymoon', 'cultural'],
      difficulty: 'easy',
      inclusions: ['Villa and beach resort accommodation', 'Daily breakfast and 3 dinners', 'Ubud temple and rice terrace tour', 'Kecak dance show at Uluwatu', 'Tegalalang rice terrace visit', 'Cooking class in Ubud', 'Seminyak beach club visit', 'All transfers with private driver'],
      exclusions: ['International flights to Bali', 'Visa on Arrival fee (USD 35)', 'Lunch', 'Mt Batur trek (optional add-on)', 'Travel insurance'],
    },
    'Paris': {
      title: 'Paris Romance & Culture — 6 Days 5 Nights',
      duration: { days: 6, nights: 5 },
      pricing: { basePrice: 94999, adultPrice: 94999, childPrice: 62999, discountPercentage: 0, currency: 'INR' },
      category: ['honeymoon', 'cultural'],
      difficulty: 'easy',
      inclusions: ['4-star Paris hotel accommodation', 'Daily breakfast', 'Paris Museum Pass (4-day)', 'Seine River evening cruise (Bateaux Mouches)', 'Versailles day trip with guide', 'Eiffel Tower summit skip-the-line tickets', 'Airport CDG transfers', 'Experienced local guide'],
      exclusions: ['International flights to Paris', 'Schengen visa fee (₹7,500 approx)', 'Lunch and dinner', 'Personal shopping', 'Travel insurance'],
    },
    'Dubai': {
      title: 'Dubai City & Desert — 5 Days 4 Nights',
      duration: { days: 5, nights: 4 },
      pricing: { basePrice: 64999, adultPrice: 64999, childPrice: 42999, discountPercentage: 5, currency: 'INR' },
      category: ['luxury', 'adventure'],
      difficulty: 'easy',
      inclusions: ['4-star hotel accommodation in Dubai', 'Daily breakfast', 'Desert safari with dune bashing and BBQ dinner', 'Burj Khalifa Level 124 skip-the-line entry', 'Dubai city tour (creek, old souk, Gold Souk)', 'Dubai Mall and Fountain visit', 'Airport Dubai transfers'],
      exclusions: ['International flights to Dubai', 'e-Visa fee (₹3,500)', 'Lunch and dinner (except safari BBQ)', 'Ski Dubai', 'Personal shopping', 'Travel insurance'],
    },
    'Thailand': {
      title: 'Thailand Island & Temple Tour — 8 Days 7 Nights',
      duration: { days: 8, nights: 7 },
      pricing: { basePrice: 52999, adultPrice: 52999, childPrice: 33999, discountPercentage: 15, currency: 'INR' },
      category: ['beach', 'cultural'],
      difficulty: 'easy',
      inclusions: ['Hotel and beach resort accommodation', 'Daily breakfast and 2 dinners', 'Bangkok Grand Palace guided tour', 'Chiang Mai elephant sanctuary half-day', 'Phi Phi Island speedboat day trip', 'Thai cooking class in Chiang Mai', 'All domestic transfers and inter-city flight'],
      exclusions: ['International flights to Bangkok', 'Lunch (except cooking class)', 'Koh Phangan Full Moon Party', 'Personal expenses', 'Travel insurance'],
    },
    'Singapore': {
      title: 'Singapore Family Spectacular — 5 Days 4 Nights',
      duration: { days: 5, nights: 4 },
      pricing: { basePrice: 74999, adultPrice: 74999, childPrice: 49999, discountPercentage: 0, currency: 'INR' },
      category: ['family', 'adventure'],
      difficulty: 'easy',
      inclusions: ['4-star hotel in Orchard/Marina Bay', 'Daily breakfast', 'Universal Studios Express tickets', 'Gardens by the Bay (Cloud Forest + Flower Dome)', 'Singapore Night Safari tickets', 'Sentosa Cable Car and beach visit', 'Airport Changi transfers'],
      exclusions: ['International flights to Singapore', 'Lunch and dinner', 'Marina Bay Sands Skypark (optional add-on)', 'Personal shopping', 'Travel insurance'],
    },
    'Switzerland': {
      title: 'Swiss Alps & Cities — 7 Days 6 Nights',
      duration: { days: 7, nights: 6 },
      pricing: { basePrice: 134999, adultPrice: 134999, childPrice: 89999, discountPercentage: 0, currency: 'INR' },
      category: ['honeymoon', 'adventure'],
      difficulty: 'moderate',
      inclusions: ['4-star Swiss hotel accommodation', 'Daily breakfast', 'Swiss Travel Pass (7-day)', 'Jungfraujoch cogwheel railway trip', 'Interlaken paragliding tandem', 'Lucerne city tour with Mt Pilatus', 'Zurich lakefront guided walk', 'Airport Zurich transfers'],
      exclusions: ['International flights to Zurich', 'Schengen visa fee (₹7,500 approx)', 'Lunch and dinner', 'Personal shopping', 'Travel insurance'],
    },
    'Sri Lanka': {
      title: 'Sri Lanka Heritage & Safari — 7 Days 6 Nights',
      duration: { days: 7, nights: 6 },
      pricing: { basePrice: 42999, adultPrice: 42999, childPrice: 27999, discountPercentage: 10, currency: 'INR' },
      category: ['wildlife', 'cultural'],
      difficulty: 'moderate',
      inclusions: ['Boutique hotel accommodation throughout', 'Daily breakfast and 4 dinners', 'Sigiriya Rock Fortress guided climb', 'Yala National Park jeep safari (morning + evening)', 'Whale watching from Mirissa (seasonal)', 'Galle Fort heritage walk', 'Kandy Temple of the Tooth visit', 'All transfers in private AC vehicle'],
      exclusions: ['International flights to Colombo', 'ETA visa fee (₹1,200)', 'Lunch', 'Mirissa whale watching (if not in season)', 'Travel insurance'],
    },
    'Nepal': {
      title: 'Nepal — Pokhara & EBC Fly-in Trek — 10 Days 9 Nights',
      duration: { days: 10, nights: 9 },
      pricing: { basePrice: 58999, adultPrice: 58999, childPrice: 37999, discountPercentage: 5, currency: 'INR' },
      category: ['adventure', 'cultural'],
      difficulty: 'challenging',
      inclusions: ['Mountain lodge and guesthouse accommodation', 'All meals on trekking days', 'Kathmandu temple heritage walk with guide', 'Everest Base Camp fly-in (scenic mountain flight)', 'Pokhara paragliding tandem', 'Chitwan safari (1 night)', 'All domestic Nepal transfers', 'Licensed trekking guide and porter'],
      exclusions: ['International flights to Kathmandu', 'TIMS permit (USD 20) and ACAP permit (USD 30)', 'Travel insurance (mandatory for EBC)', 'Personal trekking gear', 'Tips for guide and porter'],
    },
  };

  const cfg = configs[dest.name] || {
    title: dest.name + ' Tour Package',
    duration: { days: 5, nights: 4 },
    pricing: { basePrice: 25000, adultPrice: 25000, childPrice: 15000, discountPercentage: 0, currency: 'INR' },
    category: ['cultural'],
    difficulty: 'easy',
    inclusions: ['Hotel accommodation', 'Daily breakfast', 'Sightseeing tours', 'Airport transfers'],
    exclusions: ['Flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
  };

  return {
    title: cfg.title,
    destination: dest._id,
    category: cfg.category,
    description: dest.description,
    shortDescription: dest.shortDescription,
    duration: cfg.duration,
    pricing: cfg.pricing,
    coverImage: dest.coverImage,
    images: dest.images || [{ url: dest.coverImage, alt: dest.name, isPrimary: true }],
    inclusions: cfg.inclusions,
    exclusions: cfg.exclusions,
    highlights: dest.highlights,
    availability: { isAvailable: true, slots: 20, bookedSlots: Math.floor(Math.random() * 6) },
    maxGroupSize: 20,
    difficulty: cfg.difficulty,
    isFeatured: dest.isFeatured,
    isPopular: dest.popularityScore >= 90,
    isActive: true,
    tags: dest.tags,
  };
});

// ─── SEED ─────────────────────────────────────────────────────────────────────
// const seedDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-agency');
//     console.log('✅ Connected to MongoDB');

//     await Destination.deleteMany({});
//     await Package.deleteMany({});
//     console.log('🗑️  Cleared existing data');

//     const dests = await Destination.insertMany(destinations);
//     console.log(`🌍 ${dests.length} destinations inserted`);

//     const packages = buildPackages(dests);
//     const pkgs = await Package.insertMany(packages);
//     console.log(`📦 ${pkgs.length} packages inserted`);

//     console.log('\n✅ Database seeded successfully!');
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Seed error:', error.message);
//     process.exit(1);
//   }
// };



// Helper to match your schema's slug logic
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-agency');
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);

    // Clear existing data
    await Destination.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // 1. Prepare & Insert Destinations
    const destinationsWithSlugs = destinations.map(dest => ({
      ...dest,
      slug: generateSlug(dest.name)
    }));

    const insertedDests = await Destination.insertMany(destinationsWithSlugs);
    console.log(`🌍 ${insertedDests.length} destinations inserted`);

    // 2. Prepare & Insert Packages
    // Passing the inserted documents so buildPackages can use their real MongoDB ObjectIDs
    const rawPackages = buildPackages(insertedDests);

    const packagesWithSlugs = rawPackages.map(pkg => ({
      ...pkg,
      slug: `${generateSlug(pkg.title)}-${Date.now()}`
    }));

    const insertedPkgs = await Package.insertMany(packagesWithSlugs);
    console.log(`📦 ${insertedPkgs.length} packages inserted`);

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    // If you see a "Duplicate Key" error here, manually drop the collection in Compass
    process.exit(1);
  }
};

seedDB();

