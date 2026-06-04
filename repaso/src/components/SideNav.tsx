import { List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import difLogo from "../assets/dif.svg";
import { navItems } from "./navItems";

function SideNav() {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#262f3a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
          px: 5,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Link to="/">
          <img src={difLogo} alt="Logo Difasel" height={35} />
        </Link>
      </Box>

      <List sx={{ flex: 1, pt: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
                borderRight: isActive ? "3px solid #7ac943" : "3px solid transparent",
                mb: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#7ac943" : "rgba(255,255,255,0.6)",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default SideNav;
