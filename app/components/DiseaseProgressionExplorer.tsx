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

interface Props {
  lockedEndpoint?: string | null;
  lockedChartStrata?: string[] | null;
  lockedTableStrata?: string[] | null;
  lockedViewMode?: 'change' | 'absolute' | null;
  lockedSubject?: string | null;
}

export default function DiseaseProgressionExplorer({
  lockedEndpoint,
  lockedChartStrata,
  lockedTableStrata,
  lockedViewMode,
  lockedSubject,
}: Props) {
  const [chartStrata, setChartStrata] = useState<string[]>([...STRATA]);
  const [tableStrata, setTableStrata] = useState<string[]>([...STRATA]);

  const isLocked = lockedEndpoint != null;

  const effectiveChartStrata = isLocked && lockedChartStrata ? lockedChartStrata : chartStrata;
  const effectiveTableStrata = isLocked && lockedTableStrata ? lockedTableStrata : tableStrata;

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

      <ProgressionChart
        subjectIds={SUBJECT_IDS}
        selectedStrata={effectiveChartStrata}
        onStrataChange={isLocked ? () => {} : setChartStrata}
        lockedEndpoint={lockedEndpoint || undefined}
        lockedViewMode={lockedViewMode || undefined}
        lockedSubject={lockedSubject || undefined}
        disabled={isLocked}
      />

      <BaselineSummaryTable
        selectedStrata={effectiveTableStrata}
        onStrataChange={isLocked ? () => {} : setTableStrata}
        disabled={isLocked}
      />

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
