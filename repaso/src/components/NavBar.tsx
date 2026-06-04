import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import NotificationsIcon from "@mui/icons-material/Notifications";

function NavBar() {
  return (
    <AppBar sx={{ ml: "240px", width: "calc(100% - 240px)",  backgroundColor: "#262f3a" }}>
      <Toolbar>
        <Typography sx={{ mr: "auto", fontSize: 14 }}>
          Breadcrum
        </Typography>

        <Button color="inherit" startIcon={<FullscreenIcon />} />
        <Button color="inherit" startIcon={<NotificationsIcon />} />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
