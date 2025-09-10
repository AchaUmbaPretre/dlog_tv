import { useNavigate } from "react-router-dom";
import "./topBarModelTv.scss";
import { Tooltip, Badge } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const TopBarModelTv = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const [tvMode, setTvMode] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTvSwitch = () => {
    setTvMode(!tvMode);
    if (tvMode) {
      navigate("/"); // redirige vers la racine quand on désactive
    }
  };

  return (
    <div className="topBar_model">
      <div className="topbar_model_wrapper">
        {/* Logo */}
        <div
          className="topbar_model_left"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
        >
          <span className="logo">
            <div className="logo-d">D</div>LOG
          </span>
        </div>

        {/* Titre */}
        <div className="topbar_model_center">
          <h2 className="topbar_model_h2">Tableau de bord</h2>
        </div>

        {/* Actions */}
        <div className="topbar_model_right">
          {/* Switch TV Custom */}
          <div
            className={`tv-switch-custom ${tvMode ? "on" : "off"}`}
            onClick={handleTvSwitch}
            title={tvMode ? "Mode TV activé" : "Mode TV désactivé"}
          >
            <div className="tv-switch-handle" />
            <span className="tv-switch-label">{tvMode ? "ON" : "OFF"}</span>
          </div>

          {/* Icône plein écran */}
          {tvMode && (
            <Tooltip title="Affichage plein écran avec rotation automatique des vues">
              <FullscreenOutlined className="fullscreen-icon" />
            </Tooltip>
          )}

          {/* Badge */}
          <Badge
            count={
              tvMode
                ? `TV actif • MAJ ${currentTime}`
                : `TV désactivé • MAJ ${currentTime}`
            }
            style={{ backgroundColor: tvMode ? "#52c41a" : "#ff4d4f" }}
            className="maj-badge"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBarModelTv;
