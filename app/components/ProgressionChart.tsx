'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Typography, Box, Stack, CircularProgress } from '@mui/material';

const HighchartsChart = dynamic(() => import('./HighchartsChart'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 370 }}>
      <CircularProgress size={32} />
    </div>
  ),
});
import {
  RAW_DATA,
  TIME_POINTS,
  TwinRecord,
  dayToMonthLabel,
} from '../data/digitalTwinData';
import {
  charts,
  POPULATION_COLOR,
  POPULATION_BAND_COLOR,
  SELECTED_COLOR,
  SELECTED_BAND_COLOR,
  TWIN_LINE_COLOR,
  TWIN_LINE_FADED,
} from '../theme/colors';

interface ProgressionChartProps {
  subtitle: string;
  endpoint: string;
  subjectIds: string[];
  strataFilter: string;
}

function computeStats(
  data: TwinRecord[],
  endpoint: string,
  subjectIds: string[],
) {
  const baselines: Record<string, number> = {};
  subjectIds.forEach((id) => {
    const first = data.find(
      (d) => d.subject_id === id && d.nominal_study_day === TIME_POINTS[0],
    );
    if (first) baselines[id] = first[endpoint as keyof TwinRecord] as number;
  });

  const twinSeries: Record<string, [number, number][]> = {};
  subjectIds.forEach((id) => {
    twinSeries[id] = TIME_POINTS.map((day) => {
      const rec = data.find(
        (d) => d.subject_id === id && d.nominal_study_day === day,
      );
      const val = rec ? (rec[endpoint as keyof TwinRecord] as number) : 0;
      return [day, val - (baselines[id] || 0)];
    });
  });

  const popMean: [number, number][] = [];
  const popBand: [number, number, number][] = [];
  TIME_POINTS.forEach((day) => {
    const vals = subjectIds.map((id) => {
      const pt = twinSeries[id]?.find((p) => p[0] === day);
      return pt ? pt[1] : 0;
    });
    const n = vals.length;
    const mean = vals.reduce((a, b) => a + b, 0) / n;
    const sd =
      n > 1
        ? Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1))
        : 0;
    popMean.push([day, mean]);
    popBand.push([day, mean - sd, mean + sd]);
  });

  return { twinSeries, popMean, popBand };
}

function LegendItem({
  color,
  fill,
  label,
  isDash,
}: {
  color: string;
  fill?: string;
  label: string;
  isDash?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {isDash ? (
        <Box
          sx={{
            width: 18,
            height: 0,
            borderTop: `2px solid ${color}`,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 24,
            height: 10,
            bgcolor: fill || 'transparent',
            border: `2px solid ${color}`,
            borderRadius: '2px',
          }}
        />
      )}
      <Typography
        sx={{
          fontSize: '12px',
          color: '#555',
          fontFamily: 'Roboto Flex, sans-serif',
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function ProgressionChart({
  subtitle,
  endpoint,
  subjectIds,
  strataFilter,
}: ProgressionChartProps) {
  const [selectedTwin, setSelectedTwin] = useState<string | null>(null);

  const filteredIds = useMemo(() => {
    if (strataFilter === 'All') return subjectIds;
    return subjectIds.filter((id) => {
      const row = RAW_DATA.find((d) => d.subject_id === id);
      return row && row.strata === strataFilter;
    });
  }, [subjectIds, strataFilter]);

  const { twinSeries, popMean, popBand } = useMemo(
    () => computeStats(RAW_DATA, endpoint, filteredIds),
    [endpoint, filteredIds],
  );

  const selectedBand = useMemo(() => {
    if (!selectedTwin || !twinSeries[selectedTwin]) return null;
    const sdByDay: Record<number, number> = {};
    popBand.forEach(([day, lower, upper]) => {
      sdByDay[day] = (upper - lower) / 2;
    });
    return twinSeries[selectedTwin].map(([day, val]) => {
      const halfSd = (sdByDay[day] || 0) * 0.5;
      return [day, val - halfSd, val + halfSd] as [number, number, number];
    });
  }, [selectedTwin, twinSeries, popBand]);

  const handlePointClick = useCallback(
    (twinId: string) => {
      setSelectedTwin((prev) => (prev === twinId ? null : twinId));
    },
    [],
  );

  const options = useMemo(() => {
    const series: Record<string, unknown>[] = [];

    // Population SD band
    series.push({
      type: 'arearange',
      name: 'Population \u00b1 SD',
      data: popBand,
      color: POPULATION_BAND_COLOR,
      fillOpacity: 1,
      lineWidth: 0,
      marker: { enabled: false },
      enableMouseTracking: false,
      zIndex: 0,
    });

    // Selected twin prediction band
    if (selectedTwin && selectedBand) {
      series.push({
        type: 'arearange',
        name: `${selectedTwin} \u00b1 SD`,
        data: selectedBand,
        color: SELECTED_BAND_COLOR,
        fillOpacity: 1,
        lineWidth: 0,
        marker: { enabled: false },
        enableMouseTracking: false,
        zIndex: 1,
      });
    }

    // Individual twin lines
    filteredIds.forEach((id) => {
      const isSelected = selectedTwin === id;
      const hasSel = selectedTwin !== null;
      series.push({
        type: 'line',
        name: id,
        data: twinSeries[id],
        color: isSelected
          ? SELECTED_COLOR
          : hasSel
            ? TWIN_LINE_FADED
            : TWIN_LINE_COLOR,
        lineWidth: isSelected ? 2.5 : 1.2,
        marker: {
          enabled: isSelected,
          radius: isSelected ? 5 : 0,
          fillColor: isSelected ? SELECTED_COLOR : undefined,
          lineColor: '#fff',
          lineWidth: isSelected ? 2 : 0,
        },
        states: {
          hover: {
            lineWidth: 2.5,
            lineWidthPlus: 0,
          },
        },
        zIndex: isSelected ? 4 : 2,
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              handlePointClick(id);
            },
          },
        },
        events: {
          mouseOver: function () {
            if (!selectedTwin) {
              setSelectedTwin(id);
            }
          },
        },
      });
    });

    // Population mean line
    series.push({
      type: 'line',
      name: 'Population avg',
      data: popMean,
      color: POPULATION_COLOR,
      lineWidth: 2.5,
      marker: {
        enabled: true,
        radius: 5,
        fillColor: '#fff',
        lineColor: POPULATION_COLOR,
        lineWidth: 2,
      },
      zIndex: 5,
    });

    return {
      chart: {
        height: 370,
        backgroundColor: charts.backgroundColorInCard,
        style: { fontFamily: 'Roboto Flex, sans-serif' },
        events: {
          click: function () {
            setSelectedTwin(null);
          },
        },
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        title: {
          text: 'Time',
          style: {
            color: '#262626',
            fontSize: '14px',
            fontFamily: 'Roboto Flex, sans-serif',
          },
        },
        tickPositions: TIME_POINTS,
        labels: {
          formatter: function () {
            return dayToMonthLabel((this as unknown as { value: number }).value);
          },
          style: {
            color: '#666',
            fontSize: '12px',
            fontFamily: 'Roboto Mono, monospace',
            fontWeight: '500',
          },
        },
        lineColor: charts.axisLineColor,
        tickColor: charts.axisLineColor,
        gridLineWidth: 0,
      },
      yAxis: {
        title: {
          text: 'Change from baseline',
          style: {
            color: '#262626',
            fontSize: '14px',
            fontFamily: 'Roboto Flex, sans-serif',
          },
        },
        labels: {
          style: {
            color: '#666',
            fontSize: '12px',
            fontFamily: 'Roboto Mono, monospace',
            fontWeight: '500',
          },
        },
        gridLineColor: charts.gridLineColor,
        lineColor: charts.axisLineColor,
        lineWidth: 1,
      },
      tooltip: {
        shared: false,
        useHTML: true,
        backgroundColor: '#fff',
        borderColor: 'transparent',
        borderRadius: 4,
        shadow: {
          color: 'rgba(0,0,0,0.07)',
          offsetX: 0,
          offsetY: 1,
          width: 4,
        },
        style: {
          color: '#666',
          fontSize: '14px',
          fontFamily: 'Roboto Flex, sans-serif',
        },
        formatter: function () {
          const point = this as unknown as { x: number; y: number; series: { name: string } };
          const day = point.x;
          const label = dayToMonthLabel(day);
          const popPt = popMean.find((p) => p[0] === day);
          let html = `<div style="border-left: 8px solid #A98EF9; padding: 8px 12px;">`;
          html += `<div style="font-weight:600;color:#262626;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid #E8E8E8">${label}</div>`;
          if (popPt) {
            html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">`;
            html += `<span style="width:10px;height:10px;background:${POPULATION_BAND_COLOR};border:2px solid ${POPULATION_COLOR};display:inline-block"></span>`;
            html += `Population avg: ${popPt[1].toFixed(2)}</div>`;
          }
          if (point.series.name.startsWith('SUBJ-')) {
            html += `<div style="display:flex;align-items:center;gap:6px">`;
            html += `<span style="width:10px;height:10px;background:${SELECTED_BAND_COLOR};border:2px solid ${SELECTED_COLOR};display:inline-block"></span>`;
            html += `${point.series.name}: ${point.y.toFixed(2)}</div>`;
          }
          html += `</div>`;
          return html;
        },
      },
      plotOptions: {
        series: {
          animation: { duration: 300 },
          turboThreshold: 0,
        },
      },
      series,
    };
  }, [filteredIds, twinSeries, popMean, popBand, selectedTwin, selectedBand, handlePointClick]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        flex: 1,
        minWidth: 0,
        bgcolor: charts.backgroundColorInCard,
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#262626' }}>
        {filteredIds.length} twins
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: '#888',
          mb: 1.5,
          fontFamily: 'Roboto Flex, sans-serif',
        }}
      >
        {subtitle}
      </Typography>

      <Stack direction="row" spacing={2.5} sx={{ mb: 1, flexWrap: 'wrap' }}>
        <LegendItem
          color={POPULATION_COLOR}
          fill={POPULATION_BAND_COLOR}
          label="Population \u00b1 SD"
        />
        <LegendItem color={TWIN_LINE_COLOR} isDash label="Individual twin" />
        <LegendItem
          color={SELECTED_COLOR}
          fill={SELECTED_BAND_COLOR}
          label="Selected \u00b1 SD"
        />
      </Stack>

      <HighchartsChart options={options as unknown as import('highcharts').Options} />

      <Typography sx={{ fontSize: 12, color: '#aaa', mt: 1 }}>
        {selectedTwin
          ? `${selectedTwin} \u2014 showing individual prediction band`
          : 'Hover a twin line to highlight'}
      </Typography>
    </Paper>
  );
}
