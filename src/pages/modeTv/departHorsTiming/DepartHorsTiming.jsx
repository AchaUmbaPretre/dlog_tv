import { Timeline, Tooltip, Card } from "antd";
import { CarOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "./departHorsTiming.scss";

const DepartHorsTiming = ({ departHorsTimingRow }) => {
  return (
    <div className="departHorsTiming-container">
      <Card
        title={<span className="card-title">🚛 Départs hors timing</span>}
        bordered={false}
        className="event-card"
      >
        <div className="departHorsTiming-scroll">
          <Timeline mode="left" className="departHorsTiming-timeline">
            {departHorsTimingRow.map((item) => (
              <Timeline.Item
                key={item.id_bande_sortie}
                dot={
                  item.statut_sortie === "OK" ? (
                    <CheckCircleOutlined style={{ fontSize: "18px", color: "#52c41a" }} />
                  ) : (
                    <ClockCircleOutlined style={{ fontSize: "18px", color: "#ff4d4f" }} />
                  )
                }
              >
                <div className="departHorsTiming-content">
                  <div className="departHorsTiming-header">
                    📍 <span className="departHorsTiming-numBon">{item.nom_destination}</span>
                  </div>

                  <div className="departHorsTiming-sub">
                    <CarOutlined className="departHorsTiming-icon car" />
                    <span className="departHorsTiming-immatriculation">{item.immatriculation}</span>
                  </div>

                  <div className="departHorsTiming-footer">
                    <Tooltip title="Heure de départ prévue">
                      <span className="departHorsTiming-date">
                        {moment(item.date_prevue).format("DD/MM/YYYY HH:mm")}
                      </span>
                    </Tooltip>
                    {item.statut_sortie === "OK" ? (
                      <span className="status-ok">Valide</span>
                    ) : (
                      <span className="status-late">En retard</span>
                    )}
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Card>
    </div>
  );
};

export default DepartHorsTiming;
