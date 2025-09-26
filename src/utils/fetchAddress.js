// -------- CACHE PERSISTANT --------
let addressCache = {};
try {
  const stored = localStorage.getItem('vehicleAddressCache');
  if (stored) addressCache = JSON.parse(stored);
} catch (err) {
  console.warn('Impossible de lire le cache localStorage', err);
}

const API_KEY = 'f7c5292b587d4fff9fb1d00f3b6f3f73';

export const fetchAddress = async (vehicle) => {
  if (!vehicle) return "";
  if (vehicle.address && vehicle.address !== "-") return vehicle.address;

  const lat = parseFloat(vehicle.lat);
  const lng = parseFloat(vehicle.lng);

  if (isNaN(lat) || isNaN(lng)) {
    console.warn("Coordonnées invalides pour ce véhicule:", vehicle);
    return "";
  }

  const key = `${lat}_${lng}`;
  if (addressCache[key]) return addressCache[key];

  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=fr`
    );
    const data = await res.json();

    let addr = data.results?.[0]?.formatted || "";

    // 🛠 Supprimer toutes les occurrences de "Unnamed road"
    addr = addr.replace(/\bUnnamed road,?\s*/gi, "");

    // 🛠 Remplacer le pays par "RD Congo" si besoin
    if (/République démocratique du Congo/i.test(addr)) {
      addr = addr.replace(/République démocratique du Congo/gi, "RD Congo");
    }

    // Supprimer les virgules multiples ou espaces en trop
    addr = addr.replace(/,\s*,/g, ",").replace(/^\s*,\s*|\s*,\s*$/g, "");

    // Sauvegarder en cache
    addressCache[key] = addr;
    localStorage.setItem("vehicleAddressCache", JSON.stringify(addressCache));

    return addr;
  } catch (err) {
    console.error("Erreur reverse geocoding OpenCage:", err);
    return "";
  }
};
