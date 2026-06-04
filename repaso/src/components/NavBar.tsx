import { AppBar, Button, Toolbar } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Home } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { navItems } from "./navItems";

const defaultBreadcrum = { label: "Inicio", icon: <Home />, path: "/" };

function NavBar() {
  const location = useLocation();
  const breadcrum = navItems.find((item) => item.path === location.pathname) ?? defaultBreadcrum;

  return (
    <AppBar sx={{ ml: "240px", width: "calc(100% - 240px)",  backgroundColor: "#262f3a" }}>
      <Toolbar>
        <Button color="inherit" startIcon={breadcrum.icon} sx={{ mr: "auto", textTransform: "none", fontSize: 14 }}>
          {breadcrum.label}
        </Button>

        <Button color="inherit" startIcon={<FullscreenIcon />} />
        <Button color="inherit" startIcon={<NotificationsIcon />} />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
