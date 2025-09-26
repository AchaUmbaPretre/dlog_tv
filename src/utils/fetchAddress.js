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

  const cleanAddress = (addr) => {
    if (!addr) return "";
    // Supprimer "Unnamed road"
    addr = addr.replace(/\bUnnamed road,?\s*/gi, "");
    // Remplacer le pays par "RD Congo"
    if (/République démocratique du Congo/i.test(addr)) {
      addr = addr.replace(/République démocratique du Congo/gi, "RD Congo");
    }
    // Nettoyer virgules multiples ou espaces
    addr = addr.replace(/,\s*,/g, ",").replace(/^\s*,\s*|\s*,\s*$/g, "");
    return addr;
  };

  try {
    // 🔹 Essayer OpenCage
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=fr`
    );
    const data = await res.json();
    let addr = cleanAddress(data.results?.[0]?.formatted || "");
    if (addr) {
      addressCache[key] = addr;
      localStorage.setItem("vehicleAddressCache", JSON.stringify(addressCache));
      return addr;
    }
  } catch (err) {
    console.warn("OpenCage échoué, tentative avec Nominatim:", err);
  }

  try {
    // 🔹 Fallback Nominatim
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=fr`
    );
    const nomData = await nominatimRes.json();
    const nomAddr = cleanAddress(nomData.display_name);
    if (nomAddr) {
      addressCache[key] = nomAddr;
      localStorage.setItem("vehicleAddressCache", JSON.stringify(addressCache));
      return nomAddr;
    }
  } catch (err) {
    console.error("Erreur reverse geocoding Nominatim:", err);
  }

  return "";
};

