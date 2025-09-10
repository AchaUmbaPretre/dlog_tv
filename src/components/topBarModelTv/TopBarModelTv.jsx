import { useNavigate } from "react-router-dom";
import "./topBarModelTv.scss";
import { Tooltip, Badge, Divider, Button, message, Popover } from "antd";
import { FullscreenOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { logout } from "../../services/authService";

const TopBarModelTv = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const [tvMode, setTvMode] = useState(false); // démarre en mode TV

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("persist:root");
      message.success("Déconnexion réussie !");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la déconnexion.");
    }
  };

  const logoutContent = (
    <div className="logout-popover">
      <p>Voulez-vous vraiment vous déconnecter ?</p>
      <Divider style={{ margin: "8px 0" }} />
      <Button type="primary" danger onClick={handleLogout} block icon={<LogoutOutlined />}>
        Se déconnecter
      </Button>
    </div>
  );

  // Mise à jour de l'heure toutes les secondes
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

  // Toggle TV avec fullscreen natif
  const handleTvSwitch = () => {
    if (tvMode) {
      // Désactiver le mode TV
      if (document.exitFullscreen) document.exitFullscreen();
      setTvMode(false);
      navigate("/"); // retourne à Home
    } else {
      // Activer le mode TV
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      setTvMode(true);
      navigate("/"); // Home en mode TV
    }
  };

  // Sortie fullscreen avec Escape
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setTvMode(false);
        if (document.exitFullscreen) document.exitFullscreen();
        navigate("/"); // retour à Home
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [navigate]);

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
          {/* Switch TV */}
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

          {/* Badge état TV */}
          <Badge
            count={tvMode ? `TV actif • MAJ ${currentTime}` : `TV désactivé • MAJ ${currentTime}`}
            style={{ backgroundColor: tvMode ? "#52c41a" : "#ff4d4f" }}
            className="maj-badge"
          />

          {/* Bouton Logout */}
          <Popover content={logoutContent} placement="bottomRight" trigger="click">
            <Button className="logout-button" icon={<LogoutOutlined />}>
              Logout
            </Button>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default TopBarModelTv;
