import { fetchAddress } from "./fetchAddress";
import React, { useEffect, useState, memo } from "react";
import { TooltipBox } from "./RenderTooltip";

// -------- Composant VehicleAddress --------
export const VehicleAddress = memo(({ record }) => {
  const getInitialAddress = () => {
    if (record?.address && record.address !== "-") {
      return record.address;
    }

    if (record?.lat !== undefined && record?.lng !== undefined) {
      return `${record.lat}, ${record.lng}`;
    }

    return "-";
  };

  const [displayAddress, setDisplayAddress] = useState(getInitialAddress);

  useEffect(() => {
    let mounted = true;
    const fetchAddr = async () => {
      try {
        const addr = await fetchAddress(record.capteurInfo || record);
        if (mounted && addr && addr !== "undefined, undefined") {
          setDisplayAddress(addr);
        }
      } catch (e) {
        console.warn("Erreur fetchAddress:", e);
      }
    };
    fetchAddr();
    return () => {
      mounted = false;
    };
  }, [record]);

  // Sécuriser l'affichage final
  const cleanAddress =
    displayAddress && displayAddress !== "undefined, undefined"
      ? displayAddress
      : "-";

  return <TooltipBox text={cleanAddress} bg="#333" minWidth={150} />;
});
