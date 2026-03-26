'use client';

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import ScienceIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';

const SIDEBAR_WIDTH = 200;

const sectionLabel = {
  fontSize: 11,
  fontWeight: 600,
  color: '#999',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  px: 2,
  pt: 2,
  pb: 0.5,
  fontFamily: 'Roboto Mono, monospace',
};

const itemText = {
  '& .MuiListItemText-primary': {
    fontSize: 14,
    fontFamily: 'Roboto Flex, sans-serif',
    fontWeight: 400,
    color: '#262626',
  },
};

const activeItem = {
  bgcolor: '#F2F0EB',
  borderRadius: 1,
  '& .MuiListItemText-primary': {
    fontWeight: 600,
  },
};

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        bgcolor: '#FAF9F7',
        borderRight: '1px solid #E8E5E0',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScienceIcon sx={{ color: '#262626', fontSize: 22 }} />
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#262626', letterSpacing: 2, fontFamily: 'Roboto Mono, monospace' }}>
          UNLEARN
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#E8E5E0' }} />

      <List dense sx={{ px: 1, pt: 1 }}>
        <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><HomeIcon sx={{ fontSize: 20, color: '#666' }} /></ListItemIcon>
          <ListItemText primary="Home" sx={itemText} />
        </ListItemButton>
      </List>

      <Typography sx={sectionLabel}>Tools</Typography>
      <List dense sx={{ px: 1 }}>
        <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><SearchIcon sx={{ fontSize: 20, color: '#666' }} /></ListItemIcon>
          <ListItemText primary="Scout Literature Search" sx={itemText} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><TimelineIcon sx={{ fontSize: 20, color: '#666' }} /></ListItemIcon>
          <ListItemText primary="Hindsight Data Explorer" sx={itemText} />
        </ListItemButton>
      </List>

      <Typography sx={sectionLabel}>Workspace</Typography>
      <List dense sx={{ px: 1 }}>
        <ListItemButton sx={{ ...activeItem, borderRadius: 1, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><ScienceIcon sx={{ fontSize: 20, color: '#262626' }} /></ListItemIcon>
          <ListItemText primary="Studies" sx={itemText} />
        </ListItemButton>
      </List>

      <Box sx={{ flex: 1 }} />

      <Typography sx={sectionLabel}>User</Typography>
      <List dense sx={{ px: 1, pb: 2 }}>
        <ListItemButton sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><SettingsIcon sx={{ fontSize: 20, color: '#666' }} /></ListItemIcon>
          <ListItemText primary="Settings" sx={itemText} />
        </ListItemButton>
      </List>
    </Box>
  );
}

export { SIDEBAR_WIDTH };
