import { fetchAddress } from "./fetchAddress";
import React, { useEffect, useState, memo } from "react";
import { TooltipBox } from "./RenderTooltip";

// -------- Composant VehicleAddress --------
export const VehicleAddress = memo(({ record }) => {
  const [displayAddress, setDisplayAddress] = useState(
    record.address && record.address !== '-' ? record.address : `${record.lat}, ${record.lng}`
  );

  useEffect(() => {
    let mounted = true;
    const fetchAddr = async () => {
      const addr = await fetchAddress(record.capteurInfo || record);
      if (mounted && addr) setDisplayAddress(addr);
    };
    fetchAddr();
    return () => { mounted = false; };
  }, [record]);

  return <TooltipBox text={displayAddress} bg="#333" minWidth={150} />;
});