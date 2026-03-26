'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Avatar,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import StudyOverview from './StudyOverview';
import DiseaseProgressionExplorer from './DiseaseProgressionExplorer';
import DocumentsTab from './DocumentsTab';

export default function StudyPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAF9F7' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <Box
          sx={{
            px: 4,
            py: 1.5,
            bgcolor: '#fff',
            borderBottom: '1px solid #E8E5E0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: '#bbb' }} />}>
            <Link
              underline="hover"
              sx={{ fontSize: 13, color: '#666', fontFamily: 'Roboto Flex, sans-serif', cursor: 'pointer' }}
            >
              Home
            </Link>
            <Link
              underline="hover"
              sx={{ fontSize: 13, color: '#666', fontFamily: 'Roboto Flex, sans-serif', cursor: 'pointer' }}
            >
              Studies
            </Link>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#262626', fontFamily: 'Roboto Flex, sans-serif' }}>
              UnlearnAI 2026-1
            </Typography>
          </Breadcrumbs>

          <Avatar sx={{ width: 32, height: 32, bgcolor: '#9A56FB', fontSize: 13, fontWeight: 600 }}>NG</Avatar>
        </Box>

        {/* Study header + content wrapper */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          {/* Left: study header + tabs + content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Study header */}
            <Box sx={{ px: 4, pt: 3, pb: 0, bgcolor: '#fff' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <div>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#262626', fontFamily: 'Roboto Flex, sans-serif' }}>
                      UnlearnAI 2026-1
                    </Typography>
                    <Chip label="Active" size="small" sx={{ bgcolor: '#F2F0EB', color: '#666', fontSize: 12, fontWeight: 500, height: 24 }} />
                    <Chip label="Phase 1" size="small" sx={{ bgcolor: '#F2F0EB', color: '#666', fontSize: 12, fontWeight: 500, height: 24 }} />
                    <Chip label="HD" size="small" sx={{ bgcolor: '#E8D5FF', color: '#7B41DA', fontSize: 12, fontWeight: 600, height: 24 }} />
                  </Stack>
                  <Typography sx={{ fontSize: 14, color: '#888', fontFamily: 'Roboto Flex, sans-serif' }}>
                    Digital Twin Explorer Demo Study
                  </Typography>
                </div>

                <Stack direction="row" spacing={2}>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ cursor: 'pointer', color: '#9A56FB' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500, fontFamily: 'Roboto Flex, sans-serif' }}>
                      Mark Study as Complete
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ cursor: 'pointer', color: '#666' }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500, fontFamily: 'Roboto Flex, sans-serif' }}>
                      Edit Study
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  mt: 2,
                  minHeight: 40,
                  '& .MuiTabs-indicator': { bgcolor: '#262626', height: 2 },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: 14,
                    fontFamily: 'Roboto Flex, sans-serif',
                    fontWeight: 400,
                    color: '#888',
                    minHeight: 40,
                    px: 2,
                    '&.Mui-selected': { color: '#262626', fontWeight: 600 },
                  },
                }}
              >
                <Tab label="Digital Twin Explorer" />
                <Tab label="Documents & Deliverables" />
              </Tabs>
            </Box>

            {/* Tab content */}
            <Box sx={{ px: 4, py: 3 }}>
              {activeTab === 0 && <DiseaseProgressionExplorer />}
              {activeTab === 1 && <DocumentsTab />}
            </Box>
          </Box>

          {/* Right: study overview */}
          <Box sx={{ bgcolor: '#fff', borderLeft: '1px solid #E8E5E0', pt: 3, pr: 3 }}>
            <StudyOverview />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
