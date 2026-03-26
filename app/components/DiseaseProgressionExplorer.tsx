'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Chip,
  OutlinedInput,
} from '@mui/material';
import BaselineSummaryTable from './BaselineSummaryTable';
import ProgressionChart from './ProgressionChart';
import {
  ENDPOINTS,
  SUBJECT_IDS,
  STRATA,
} from '../data/digitalTwinData';
import { charts, STRATA_COLORS } from '../theme/colors';

export default function DiseaseProgressionExplorer() {
  const [endpoint, setEndpoint] = useState<string>('cuhdrs');
  const [selectedStrata, setSelectedStrata] = useState<string[]>([...STRATA]);

  const handleStrataChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const next = typeof value === 'string' ? value.split(',') : value;
    // Require at least 1 selected
    if (next.length > 0) {
      setSelectedStrata(next);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1280,
        mx: 'auto',
        p: { xs: 2, md: 5 },
        bgcolor: charts.backgroundColor,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Typography
        sx={{
          letterSpacing: 2,
          fontSize: 11,
          fontWeight: 500,
          color: '#999',
          textTransform: 'uppercase',
          mb: 1,
          fontFamily: 'Roboto Mono, monospace',
        }}
      >
        Unlearn &mdash; Digital Twin Visualization
      </Typography>
      <Typography variant="h1" sx={{ mb: 1 }}>
        Digital Twin Explorer
      </Typography>
      <Typography variant="subtitle1" sx={{ maxWidth: 700, mb: 3 }}>
        Population average and individual digital twin trajectories for a
        simulated endpoint. Hover any twin line to isolate it and view its
        prediction band.
      </Typography>

      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel
            sx={{
              fontFamily: 'Roboto Mono, monospace',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Endpoint
          </InputLabel>
          <Select
            value={endpoint}
            label="Endpoint"
            onChange={(e: SelectChangeEvent) => setEndpoint(e.target.value)}
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              fontFamily: 'Roboto Flex, sans-serif',
              fontSize: 14,
            }}
          >
            {Object.entries(ENDPOINTS).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel
            sx={{
              fontFamily: 'Roboto Mono, monospace',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Strata
          </InputLabel>
          <Select
            multiple
            value={selectedStrata}
            label="Strata"
            onChange={handleStrataChange}
            input={<OutlinedInput label="Strata" />}
            renderValue={(selected) => (
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                {selected.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: 12,
                      bgcolor: STRATA_COLORS[s]?.band || '#eee',
                      borderLeft: `3px solid ${STRATA_COLORS[s]?.line || '#999'}`,
                      fontFamily: 'Roboto Flex, sans-serif',
                    }}
                  />
                ))}
              </Stack>
            )}
            sx={{
              bgcolor: '#fff',
              borderRadius: 2,
              fontFamily: 'Roboto Flex, sans-serif',
              fontSize: 14,
            }}
          >
            {STRATA.map((s) => (
              <MenuItem key={s} value={s}>
                <Checkbox
                  checked={selectedStrata.includes(s)}
                  size="small"
                  sx={{ color: STRATA_COLORS[s]?.line, '&.Mui-checked': { color: STRATA_COLORS[s]?.line } }}
                />
                <ListItemText
                  primary={s}
                  primaryTypographyProps={{ fontSize: 14, fontFamily: 'Roboto Flex, sans-serif' }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Baseline Summary Table */}
      <BaselineSummaryTable selectedStrata={selectedStrata} />

      {/* Single chart */}
      <ProgressionChart
        endpoint={endpoint}
        subjectIds={SUBJECT_IDS}
        selectedStrata={selectedStrata}
      />

      {/* Footer */}
      <Typography
        sx={{
          textAlign: 'right',
          fontSize: 13,
          color: '#bbb',
          mt: 3,
          fontFamily: 'Roboto Flex, sans-serif',
        }}
      >
        Change from baseline &middot; Simulated endpoint data
      </Typography>
    </Box>
  );
}
