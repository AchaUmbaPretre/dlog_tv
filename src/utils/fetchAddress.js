// -------- CACHE PERSISTANT --------
let addressCache = {};
try {
  const stored = localStorage.getItem('vehicleAddressCache');
  if (stored) addressCache = JSON.parse(stored);
} catch (err) {
  console.warn('Impossible de lire le cache localStorage', err);
}

// Fonction pour récupérer l'adresse avec cache
export const fetchAddress = async (vehicle) => {
  if (!vehicle) return '';
  if (vehicle.address && vehicle.address !== '-') return vehicle.address;

  const lat = parseFloat(vehicle.lat);
  const lng = parseFloat(vehicle.lng);
  if (isNaN(lat) || isNaN(lng)) return '';

  const key = `${lat}_${lng}`;
  if (addressCache[key]) return addressCache[key];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'User-Agent': 'MyApp/1.0' } }
    );
    const data = await res.json();

    // On récupère le display_name normal
    let addr = data.display_name || '';

    // Vérifie si le pays est "République démocratique du Congo"
    if (data.address?.country === 'République démocratique du Congo') {
      // ✅ On remplace uniquement le pays
      addr = addr.replace(/République démocratique du Congo/gi, 'RD Congo');
    }

    addressCache[key] = addr;
    localStorage.setItem('vehicleAddressCache', JSON.stringify(addressCache));

    return addr;
  } catch (err) {
    console.error('Erreur reverse geocoding:', err);
    return '';
  }
};
