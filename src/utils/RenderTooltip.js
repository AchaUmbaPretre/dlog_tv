import { Tag, Tooltip, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { Text } = Typography;

// Tooltip pour texte tronqué
export const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

// Formatage des minutes en j h m
const formatDuration = (minutes) => {
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

// Détermination de la couleur en fonction du retard
export const getDurationColor = (elapsedMinutes) => {
  if (elapsedMinutes <= 0) return "green";       // gain de temps ou à l'heure
  if (elapsedMinutes > 25 && elapsedMinutes <= 60) return "orange"; // retard léger >25min
  if (elapsedMinutes > 60) return "red";         // retard important >1h
  return "green";                                // 0-25min reste vert
};

// Hook pour le compteur dynamique
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

// Chrono dynamique pour la course en cours
export const ChronoTag = ({ sortie_time }) => {
  const elapsedMinutes = useElapsedTime(sortie_time);
  const color = getDurationColor(elapsedMinutes);

  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {formatDuration(elapsedMinutes)}
    </Tag>
  );
};

// Affichage de la durée moyenne (statique)
export const MoyenneTag = ({ duree_moyenne_min }) => (
  <Tag color="purple">{formatDuration(duree_moyenne_min)}</Tag>
);

export const renderStatutHoraire = (nom_statut_bs, date_prevue) => {
  if (!nom_statut_bs || !date_prevue) return <Tag>-</Tag>;

  const now = moment();
  const prevue = moment(date_prevue);
  const diffMinutes = now.diff(prevue, 'minutes');

  let color = 'green';
  let label = `🟢 ${nom_statut_bs === 'BS validé' ? 'En attente' : ''}`;

  if (diffMinutes <= 60) {
    color = 'orange';
    label = `🟠 ${nom_statut_bs === 'BS validé' ? 'En attente' : ''} (${diffMinutes} min de retard)`;
  } else if (diffMinutes > 60) {
    color = 'red';
    label = `🔴 ${nom_statut_bs === 'BS validé' ? 'En attente' : ''} (${formatDuration(diffMinutes)} de retard)`;
  }

  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {label}
    </Tag>
  );
};

// Ecart dynamique entre durée réelle et moyenne
export const EcartTag = ({ duree_reelle_min, duree_moyenne_min }) => {
  const [diff, setDiff] = useState(duree_moyenne_min != null ? duree_moyenne_min - duree_reelle_min : 0);

  useEffect(() => {
    if (duree_moyenne_min == null) return;
    const interval = setInterval(() => {
      setDiff(duree_moyenne_min - duree_reelle_min);
    }, 1000);

    return () => clearInterval(interval);
  }, [duree_reelle_min, duree_moyenne_min]);

  if (duree_moyenne_min == null) {
    return (
      <Tag color="default" style={{ fontWeight: 600 }}>
        Aucune moyenne
      </Tag>
    );
  }

  let color = "green";
  if (diff > 0) color = "green";
  else if (diff <= 0 && diff > -60) color = "orange";
  else color = "red";

  const text =
    diff > 0
      ? `${formatDuration(diff)} de gain`
      : `${formatDuration(Math.abs(diff))} de retard`;

  return <Tag color={color}>{text}</Tag>;
};

