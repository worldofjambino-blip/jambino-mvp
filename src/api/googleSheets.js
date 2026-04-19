const MOCK_PLAYGROUNDS = [
  {
    id: 1,
    name: 'Seeplatz Konstanz',
    latitude: 47.6560,
    longitude: 8.9545,
    city: 'Konstanz',
    country: 'DE',
    description: 'Wunderbar gelegener Spielplatz direkt am Bodensee mit Wasserspielbereich.',
    rating: 4.7,
    reviews: 23,
    ageGroups: ['3-6', '6-12'],
    coverImage: 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600',
  },
  {
    id: 2,
    name: 'Kinderpark Schaffhausen',
    latitude: 47.6965,
    longitude: 8.6372,
    city: 'Schaffhausen',
    country: 'CH',
    description: 'Großzügiger Spielplatz mit Wiese und Klettergerüsten.',
    rating: 4.5,
    reviews: 18,
    ageGroups: ['6-12', '12+'],
    coverImage: 'https://images.unsplash.com/photo-1566216898276-a8ef6a961b27?w=600',
  },
  {
    id: 3,
    name: 'Hohentwiel Spielplatz',
    latitude: 47.7438,
    longitude: 8.8494,
    city: 'Singen',
    country: 'DE',
    description: 'Abenteuerspielplatz mit Naturelementen, ideal für Entdecker.',
    rating: 4.9,
    reviews: 31,
    ageGroups: ['3-6', '6-12', '12+'],
    coverImage: 'https://images.unsplash.com/photo-1552810309-ed75afc4a9ad?w=600',
  },
  {
    id: 4,
    name: 'Seeufer-Park Stockach',
    latitude: 47.8125,
    longitude: 9.0267,
    city: 'Stockach',
    country: 'DE',
    description: 'Idyllischer Spielplatz an der Aach mit Picknickbereich.',
    rating: 4.3,
    reviews: 14,
    ageGroups: ['0-3', '3-6'],
    coverImage: 'https://images.unsplash.com/photo-1566216898276-a8ef6a961b27?w=600',
  },
];

export async function fetchPlaygroundsFromSheets() {
  console.log('📊 Lade Spielplätze...');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`✅ ${MOCK_PLAYGROUNDS.length} Spielplätze geladen`);
  return MOCK_PLAYGROUNDS;
}

export function startSheetSync(callback, intervalMinutes = 5) {
  callback(MOCK_PLAYGROUNDS);
  const intervalId = setInterval(() => {
    callback(MOCK_PLAYGROUNDS);
  }, intervalMinutes * 60 * 1000);
  return () => clearInterval(intervalId);
}