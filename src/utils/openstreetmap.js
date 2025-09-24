// -------- CACHE PERSISTANT --------
let addressCache = {};
try {
  const stored = localStorage.getItem('vehicleAddressCache');
  if (stored) addressCache = JSON.parse(stored);
} catch (err) {
  console.warn('Impossible de lire le cache localStorage', err);
}

const fetchAddress = async (vehicle) => {
  if (!vehicle) return '';
  // Trigger reverse geocoding si address vide ou "-"
  if (vehicle.address && vehicle.address !== '-') return vehicle.address;

  const lat = parseFloat(vehicle.lat);
  const lng = parseFloat(vehicle.lng);
  if (isNaN(lat) || isNaN(lng)) return '';

  const key = `${lat}_${lng}`;
  if (addressCache[key]) return addressCache[key];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'MyApp/1.0' } } // obligatoire pour Nominatim
    );
    const data = await res.json();
    const addr = data.display_name || '';

    addressCache[key] = addr;
    localStorage.setItem('vehicleAddressCache', JSON.stringify(addressCache));

    return addr;
  } catch (err) {
    console.error('Erreur reverse geocoding:', err);
    return '';
  }
};