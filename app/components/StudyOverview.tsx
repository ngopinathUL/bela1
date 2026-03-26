'use client';

import { Box, Typography } from '@mui/material';

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  py: 1,
  borderBottom: '1px solid #EEEBE4',
} as const;

const labelSx = {
  fontSize: 13,
  color: '#666',
  fontFamily: 'Roboto Flex, sans-serif',
} as const;

const valueSx = {
  fontSize: 13,
  fontWeight: 600,
  color: '#262626',
  fontFamily: 'Roboto Flex, sans-serif',
  textAlign: 'right' as const,
} as const;

export default function StudyOverview() {
  return (
    <Box
      sx={{
        width: 280,
        minWidth: 280,
        pl: 3,
        pt: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontFamily: 'Roboto Mono, monospace',
          mb: 2,
        }}
      >
        Study Overview
      </Typography>

      <Box sx={row}>
        <Typography sx={labelSx}>Phase</Typography>
        <Typography sx={valueSx}>Phase 1</Typography>
      </Box>
      <Box sx={row}>
        <Typography sx={labelSx}>Disease</Typography>
        <Typography sx={{ ...valueSx, color: '#9A56FB' }}>Huntington&apos;s</Typography>
      </Box>
      <Box sx={row}>
        <Typography sx={labelSx}>Treatment</Typography>
        <Typography sx={valueSx}>&mdash;</Typography>
      </Box>
      <Box sx={row}>
        <Typography sx={labelSx}>Type</Typography>
        <Typography sx={valueSx}>&mdash;</Typography>
      </Box>
      <Box sx={row}>
        <Typography sx={labelSx}>Allocation</Typography>
        <Typography sx={valueSx}>&mdash;</Typography>
      </Box>
      <Box sx={row}>
        <Typography sx={labelSx}>Participants</Typography>
        <Typography sx={valueSx}>6 participants</Typography>
      </Box>
      <Box sx={row}>
        <Typography sx={labelSx}>Treatment Duration</Typography>
        <Typography sx={valueSx}>&mdash;</Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: '#262626',
          fontFamily: 'Roboto Flex, sans-serif',
          mt: 2,
          mb: 1,
        }}
      >
        Primary Outcome
      </Typography>
      <Typography sx={{ fontSize: 13, color: '#666', fontFamily: 'Roboto Flex, sans-serif' }}>
        cUHDRS
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: '#262626',
          fontFamily: 'Roboto Flex, sans-serif',
          mt: 2,
          mb: 1,
        }}
      >
        Secondary Outcome
      </Typography>
      <Typography sx={{ fontSize: 13, color: '#666', fontFamily: 'Roboto Flex, sans-serif' }}>
        UHDRS TMS, UHDRS TFC, UHDRS Independence, SDMT
      </Typography>
    </Box>
  );
}
