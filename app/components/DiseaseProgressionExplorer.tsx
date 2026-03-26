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

export default function DiseaseProgressionExplorer() {
  const [chartStrata, setChartStrata] = useState<string[]>([...STRATA]);
  const [tableStrata, setTableStrata] = useState<string[]>([...STRATA]);

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 14,
          color: '#888',
          mb: 3,
          fontFamily: 'Roboto Flex, sans-serif',
          lineHeight: 1.6,
          maxWidth: 700,
        }}
      >
        Population average and individual digital twin trajectories for a
        simulated endpoint. Hover any twin line to isolate it and view its
        prediction band.
      </Typography>

      {/* Chart (top) */}
      <ProgressionChart
        subjectIds={SUBJECT_IDS}
        selectedStrata={chartStrata}
        onStrataChange={setChartStrata}
      />

      {/* Table (bottom) */}
      <BaselineSummaryTable
        selectedStrata={tableStrata}
        onStrataChange={setTableStrata}
      />

      {/* Footer */}
      <Typography
        sx={{
          textAlign: 'right',
          fontSize: 12,
          color: '#bbb',
          mt: 2,
          fontFamily: 'Roboto Flex, sans-serif',
        }}
      >
        Change from baseline &middot; Simulated endpoint data
      </Typography>
    </Box>
  );
}
