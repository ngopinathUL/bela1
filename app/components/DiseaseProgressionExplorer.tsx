'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import BaselineSummaryTable from './BaselineSummaryTable';
import ProgressionChart from './ProgressionChart';
import {
  SUBJECT_IDS,
  STRATA,
} from '../data/digitalTwinData';
import { charts } from '../theme/colors';

export default function DiseaseProgressionExplorer() {
  const [chartStrata, setChartStrata] = useState<string[]>([...STRATA]);
  const [tableStrata, setTableStrata] = useState<string[]>([...STRATA]);

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
      <Typography variant="subtitle1" sx={{ maxWidth: 700, mb: 4 }}>
        Population average and individual digital twin trajectories for a
        simulated endpoint. Hover any twin line to isolate it and view its
        prediction band.
      </Typography>

      {/* Chart (top) — has its own endpoint select + strata toggle */}
      <ProgressionChart
        subjectIds={SUBJECT_IDS}
        selectedStrata={chartStrata}
        onStrataChange={setChartStrata}
      />

      {/* Table (bottom) — has its own endpoint multi-select + strata toggle */}
      <BaselineSummaryTable
        selectedStrata={tableStrata}
        onStrataChange={setTableStrata}
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
