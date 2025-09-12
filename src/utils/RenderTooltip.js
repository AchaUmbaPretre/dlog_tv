import { Tag, Tooltip, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { Text } = Typography;

export const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);


const formatDuration = (minutes) => {
  if (minutes == null) return "-";
  const totalMinutes = Math.floor(minutes); // on arrondit à l'entier
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;

  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  result += `${mins}m`;

  return result.trim();
};

export const getDurationColor = (elapsedMinutes, datePrevue) => {
  if (!datePrevue) return "default";
  const diff = moment().diff(moment(datePrevue), "minutes");
  if (diff <= 0) return "green";
  if (diff > 0 && diff <= 60) return "orange";
  return "red";
};

export const useElapsedTime = (startTime) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const diffMinutes = Math.floor(moment().diff(moment(startTime), "minutes", true)); // arrondi à l'entier
      setElapsed(diffMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
};

export const ChronoTag = ({ sortie_time, date_prevue }) => {
  const elapsedMinutes = useElapsedTime(sortie_time);
  const color = getDurationColor(elapsedMinutes, date_prevue);

  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {formatDuration(elapsedMinutes)}
    </Tag>
  );
};

export const MoyenneTag = ({ duree_moyenne_min }) => (
  <Tag color="purple">{formatDuration(duree_moyenne_min)}</Tag>
);

export const EcartTag = ({ heurePrevue }) => {
  const [diff, setDiff] = useState(0); // différence en minutes

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const ecart = moment(heurePrevue).diff(now, "minutes"); // différence positive = reste avant échéance
      setDiff(ecart);
    }, 1000);

    return () => clearInterval(interval);
  }, [heurePrevue]);

  let color = "green";
  let text = "";

  if (diff > 0) {
    // encore dans les délais
    color = "green";
    text = `${formatDuration(diff)} restante`;
  } else if (diff <= 0 && diff > -60) {
    // petit retard
    color = "orange";
    text = `${formatDuration(Math.abs(diff))} de retard`;
  } else {
    // retard significatif
    color = "red";
    text = `${formatDuration(Math.abs(diff))} de retard`;
  }

  return <Tag color={color}>{text}</Tag>;
};