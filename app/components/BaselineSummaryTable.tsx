'use client';

import { useMemo } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  RAW_DATA,
  TIME_POINTS,
  ENDPOINTS,
  SUBJECT_IDS,
  TwinRecord,
} from '../data/digitalTwinData';
import { charts } from '../theme/colors';

interface BaselineSummaryTableProps {
  selectedStrata: string[];
}

interface EndpointStats {
  n: number;
  mean: number;
  sd: number;
  median: number;
  min: number;
  max: number;
}

function computeBaselineStats(
  data: TwinRecord[],
  endpointKey: string,
  subjectIds: string[],
): EndpointStats {
  const baselineDay = TIME_POINTS[0];
  const values = subjectIds
    .map((id) => {
      const rec = data.find(
        (d) => d.subject_id === id && d.nominal_study_day === baselineDay,
      );
      return rec ? (rec[endpointKey as keyof TwinRecord] as number) : null;
    })
    .filter((v): v is number => v !== null);

  const n = values.length;
  if (n === 0) return { n: 0, mean: 0, sd: 0, median: 0, min: 0, max: 0 };

  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd =
    n > 1
      ? Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1))
      : 0;
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  return { n, mean, sd, median, min: sorted[0], max: sorted[n - 1] };
}

const cellSx = {
  fontFamily: 'Roboto Mono, monospace',
  fontSize: '13px',
  color: '#262626',
  py: 1.2,
  borderColor: '#EEEBE4',
} as const;

const headerCellSx = {
  ...cellSx,
  fontWeight: 600,
  fontSize: '12px',
  color: '#666',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.36px',
  bgcolor: '#FAF9F7',
} as const;

export default function BaselineSummaryTable({
  selectedStrata,
}: BaselineSummaryTableProps) {
  const filteredIds = useMemo(() => {
    return SUBJECT_IDS.filter((id) => {
      const row = RAW_DATA.find((d) => d.subject_id === id);
      return row && selectedStrata.includes(row.strata);
    });
  }, [selectedStrata]);

  const stats = useMemo(() => {
    const result: Record<string, EndpointStats> = {};
    for (const key of Object.keys(ENDPOINTS)) {
      result[key] = computeBaselineStats(RAW_DATA, key, filteredIds);
    }
    return result;
  }, [filteredIds]);

  const fmt = (v: number) => v.toFixed(2);

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        bgcolor: charts.backgroundColorInCard,
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          color: '#262626',
          p: 3,
          pb: 0,
        }}
      >
        Baseline summary statistics
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: '#888',
          px: 3,
          pt: 0.5,
          pb: 2,
          fontFamily: 'Roboto Flex, sans-serif',
        }}
      >
        First observed timepoint (Day {TIME_POINTS[0]}) &mdash; {filteredIds.length} subjects
        {' '}({selectedStrata.join(', ')})
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Endpoint</TableCell>
              <TableCell sx={headerCellSx} align="right">N</TableCell>
              <TableCell sx={headerCellSx} align="right">Mean ± SD</TableCell>
              <TableCell sx={headerCellSx} align="right">Median</TableCell>
              <TableCell sx={headerCellSx} align="right">Min</TableCell>
              <TableCell sx={headerCellSx} align="right">Max</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(ENDPOINTS).map(([key, label]) => {
              const s = stats[key];
              return (
                <TableRow key={key} hover>
                  <TableCell sx={{ ...cellSx, fontWeight: 500 }}>
                    {label}
                  </TableCell>
                  <TableCell sx={cellSx} align="right">
                    {s.n}
                  </TableCell>
                  <TableCell sx={cellSx} align="right">
                    {fmt(s.mean)} ± {fmt(s.sd)}
                  </TableCell>
                  <TableCell sx={cellSx} align="right">
                    {fmt(s.median)}
                  </TableCell>
                  <TableCell sx={cellSx} align="right">
                    {fmt(s.min)}
                  </TableCell>
                  <TableCell sx={cellSx} align="right">
                    {fmt(s.max)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
