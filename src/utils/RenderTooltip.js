import { Progress, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const TooltipBox = ({
  text,
  bg = "#333",
  color = "#fff",
  fontSize = 50,
  padding = "6px 12px",
  radius = 12,
}) => (
  <Tooltip title={text || '-'}>
    <div
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        background: bg,
        color,
        fontWeight: 800,
        fontSize,
        padding,
        borderRadius: radius,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      {text || '-'}
    </div>
  </Tooltip>
)

// Formatage durée en j h m
export const formatDuration = (minutes) => {
  if (minutes == null) return "-";
  const totalMinutes = Math.floor(minutes);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;
  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  result += `${mins}m`;
  return result.trim();
};

// Couleur en fonction du retard
export const getDurationColor = (elapsedMinutes) => {
  if (elapsedMinutes <= 0) return "#52c41a";       // vert
  if (elapsedMinutes > 25 && elapsedMinutes <= 60) return "#faad14"; // orange
  if (elapsedMinutes > 60) return "#ff4d4f";       // rouge
  return "#52c41a";
};

// Hook pour compteur dynamique
export const useElapsedTime = (startTime) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const diffMinutes = Math.floor(moment().diff(moment(startTime), "minutes", true));
      setElapsed(diffMinutes);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  return elapsed;
};

// Chrono dynamique
export const ChronoBox = ({ sortie_time }) => {
  const elapsedMinutes = useElapsedTime(sortie_time);
  const bgColor = getDurationColor(elapsedMinutes);
  return <TooltipBox text={formatDuration(elapsedMinutes)} bg={bgColor} />;
};

// Durée moyenne statique
export const MoyenneBox = ({ duree_moyenne_min }) => (
  <TooltipBox text={formatDuration(duree_moyenne_min)} bg="#722ed1" />
);

// Statut horaire
export const StatutBox = (nom_statut_bs, date_prevue) => {
  if (!nom_statut_bs || !date_prevue) return <TooltipBox text="-" bg="#595959" />;
  const now = moment();
  const prevue = moment(date_prevue);
  const diffMinutes = now.diff(prevue, "minutes");

  let bgColor = "#52c41a";
  let label = "À l'heure";

  if (diffMinutes > 25 && diffMinutes <= 60) {
    bgColor = "#faad14";
    label = `⚠️ ${diffMinutes} min de retard`;
  } else if (diffMinutes > 60) {
    bgColor = "#ff4d4f";
    label = `⏰ ${formatDuration(diffMinutes)} de retard`;
  }

  return <TooltipBox text={label} bg={bgColor} />;
};

// Ecart dynamique
export const EcartBox = ({ duree_reelle_min, duree_moyenne_min }) => {
  if (duree_moyenne_min == null) return <TooltipBox text="Aucune moyenne" bg="#595959" />;

  const diff = duree_moyenne_min - duree_reelle_min;
  let bgColor = "#52c41a";
  let text = `${formatDuration(Math.abs(diff))}`;

  if (diff < 0 && diff >= -60) {
    bgColor = "#faad14";
    text = `${formatDuration(Math.abs(diff))}`;
  } else if (diff < -60) {
    bgColor = "#ff4d4f";
    text = `${formatDuration(Math.abs(diff))}`;
  }

  return <TooltipBox text={text} bg={bgColor} />;
};

export const ScoreBox = (value) => {
  if (value == null) return TooltipBox('Aucun', '#d9d9d9', '#000'); // texte visible

  let color = '#1890ff';
  if (value < 40) color = '#ff4d4f';
  else if (value < 70) color = '#faad14';
  else if (value < 90) color = '#52c41a';

  return (
    <Tooltip title={`Score: ${value}%`}>
      <div style={{ display: 'flex', justifyContent: 'center', background: '#222', borderRadius: 50, padding: 4 }}>
        <Progress
          type="circle"
          percent={value}
          width={100}
          strokeColor={color}
          trailColor="#555" // arrière-plan visible
          format={(p) => <span style={{ color: '#fff', fontWeight: 900 }}>{p}%</span>} // texte blanc
        />
      </div>
    </Tooltip>
  );
};