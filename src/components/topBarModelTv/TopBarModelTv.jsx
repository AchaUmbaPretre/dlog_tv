import { useNavigate } from "react-router-dom";
import "./topBarModelTv.scss";
import { Tooltip, Badge, Divider, Button, message, Popover, Switch, Space } from "antd";
import { FullscreenOutlined, LogoutOutlined, DesktopOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { logout } from "../../services/authService";

const TopBarModelTv = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const [tvMode, setTvMode] = useState(false);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("fr-FR", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gestion fullscreen
  const handleTvSwitch = (checked) => {
    setTvMode(checked);
    if (checked) {
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      navigate("/");
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      navigate("/");
    }
  };

  // Sortie fullscreen avec Escape
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        setTvMode(false);
        if (document.exitFullscreen) document.exitFullscreen();
        navigate("/");
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [navigate]);

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
        <div className="topbar_model_right" style={{ gap: 16, display: "flex", alignItems: "center" }}>
          {/* Switch TV */}
          <Space direction="vertical" size={2} style={{ display: "flex", alignItems: "center" }}>
            <Switch
              checked={tvMode}
              onChange={handleTvSwitch}
              checkedChildren={<DesktopOutlined />}
              unCheckedChildren={<DesktopOutlined />}
              className="tv-switch-ant"
            />
            <Badge
              count={tvMode ? `TV actif • MAJ ${currentTime}` : `TV désactivé • MAJ ${currentTime}`}
              style={{ backgroundColor: tvMode ? "#52c41a" : "#ff4d4f" }}
              className="maj-badge"
            />
          </Space>

          {/* Icône plein écran */}
          {tvMode && (
            <Tooltip title="Affichage plein écran avec rotation automatique des vues">
              <FullscreenOutlined className="fullscreen-icon" />
            </Tooltip>
          )}

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
