import { Tag, Tooltip, Typography } from "antd";
import moment from "moment";

const { Text } = Typography;



export const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

// Date formatée dans un tag
export const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

// Formate une durée en minutes en min / h / jour
export const formatDuration = (minutesTotal) => {
  if (minutesTotal == null) return '-';
  if (minutesTotal < 60) return `${minutesTotal} min`;
  
  const jours = Math.floor(minutesTotal / 1440);
  const heures = Math.floor((minutesTotal % 1440) / 60);
  const minutes = minutesTotal % 60;

  let result = '';
  if (jours > 0) result += `${jours} jour${jours > 1 ? 's' : ''} `;
  if (heures > 0) result += `${heures}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

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