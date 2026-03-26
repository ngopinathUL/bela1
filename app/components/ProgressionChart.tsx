'use client';

import { useMemo, useState } from 'react';
import {
  Paper, Typography, Box, Stack,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
  ToggleButtonGroup, ToggleButton,
  Autocomplete, TextField,
} from '@mui/material';
import HighchartsChart from './HighchartsChart';
import StrataToggle from './StrataToggle';
import {
  RAW_DATA,
  ENDPOINTS,
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
  TWIN_LINE_FADED,
  STRATA_COLORS,
} from '../theme/colors';

interface ProgressionChartProps {
  subjectIds: string[];
  selectedStrata: string[];
  onStrataChange: (next: string[]) => void;
  lockedEndpoint?: string;
  lockedViewMode?: 'change' | 'absolute';
  lockedSubjects?: string[];
  disabled?: boolean;
}

function getSubjectStrata(subjectId: string): string {
  const row = RAW_DATA.find((d) => d.subject_id === subjectId);
  return row?.strata || '';
}

function computeStats(
  data: TwinRecord[],
  endpoint: string,
  subjectIds: string[],
  mode: 'change' | 'absolute',
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
      return [day, mode === 'absolute' ? val : val - (baselines[id] || 0)];
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

function LegendSwatch({
  color,
  fill,
  label,
  isDash,
  isDashFill,
}: {
  color: string;
  fill?: string;
  label: string;
  isDash?: boolean;
  isDashFill?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {isDashFill ? (
        <Box sx={{ width: 24, height: 10, bgcolor: fill || 'transparent', borderTop: `3px dashed ${color}`, borderRadius: '2px' }} />
      ) : isDash ? (
        <Box sx={{ width: 18, height: 0, borderTop: `2px solid ${color}` }} />
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
        sx={{ fontSize: '12px', color: '#555', fontFamily: 'Roboto Flex, sans-serif' }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function ProgressionChart({
  subjectIds,
  selectedStrata,
  onStrataChange,
  lockedEndpoint,
  lockedViewMode,
  lockedSubjects,
  disabled,
}: ProgressionChartProps) {
  const [internalEndpoint, setInternalEndpoint] = useState<string>('cuhdrs');
  const [internalViewMode, setInternalViewMode] = useState<'change' | 'absolute'>('change');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const endpoint = lockedEndpoint || internalEndpoint;
  const viewMode = disabled && lockedViewMode ? lockedViewMode : internalViewMode;
  const highlighted = (disabled && lockedSubjects) ? new Set(lockedSubjects) : new Set(selectedSubjects);
  const hasHighlights = highlighted.size > 0;

  const filteredIds = useMemo(() => {
    return subjectIds.filter((id) => selectedStrata.includes(getSubjectStrata(id)));
  }, [subjectIds, selectedStrata]);

  const { twinSeries, popMean, popBand } = useMemo(
    () => computeStats(RAW_DATA, endpoint, filteredIds, viewMode),
    [endpoint, filteredIds, viewMode],
  );

  // Compute prediction band for every twin (twin value ± half population SD)
  const twinBands = useMemo(() => {
    const sdByDay: Record<number, number> = {};
    popBand.forEach(([day, lower, upper]) => {
      sdByDay[day] = (upper - lower) / 2;
    });
    const bands: Record<string, [number, number, number][]> = {};
    filteredIds.forEach((id) => {
      if (!twinSeries[id]) return;
      bands[id] = twinSeries[id].map(([day, val]) => {
        const halfSd = (sdByDay[day] || 0) * 0.5;
        return [day, val - halfSd, val + halfSd] as [number, number, number];
      });
    });
    return bands;
  }, [filteredIds, twinSeries, popBand]);


  const yAxisLabel = viewMode === 'absolute'
    ? `${ENDPOINTS[endpoint]}`
    : `Change from baseline (${ENDPOINTS[endpoint]})`;

  const options = useMemo(() => {
    const series: Record<string, unknown>[] = [];

    series.push({
      type: 'arearange',
      name: 'Population ± SD',
      data: popBand,
      color: POPULATION_BAND_COLOR,
      fillOpacity: 1,
      lineWidth: 0,
      marker: { enabled: false },
      enableMouseTracking: false,
      zIndex: 0,
    });

    // Determine which IDs to render (all, or only highlighted if toggle is on)
    const visibleIds = (showOnlySelected && hasHighlights)
      ? filteredIds.filter((id) => highlighted.has(id))
      : filteredIds;

    // Per-twin prediction bands
    visibleIds.forEach((id) => {
      const isHighlighted = highlighted.has(id);
      const strata = getSubjectStrata(id);
      const strataBand = STRATA_COLORS[strata]?.band || 'rgba(196, 181, 168, 0.15)';
      const bandColor = isHighlighted
        ? strataBand.replace(/[\d.]+\)$/, '0.35)')
        : hasHighlights
          ? 'rgba(200, 200, 200, 0.06)'
          : strataBand;

      if (twinBands[id]) {
        series.push({
          type: 'arearange',
          name: `${id} band`,
          data: twinBands[id],
          color: bandColor,
          fillOpacity: 1,
          lineWidth: 0,
          marker: { enabled: false },
          enableMouseTracking: false,
          zIndex: isHighlighted ? 1 : 0,
        });
      }
    });

    visibleIds.forEach((id) => {
      const isHighlighted = highlighted.has(id);
      const strata = getSubjectStrata(id);
      const strataColor = STRATA_COLORS[strata]?.line || '#C4B5A8';

      series.push({
        type: 'line',
        name: id,
        data: twinSeries[id],
        color: isHighlighted ? strataColor : hasHighlights ? TWIN_LINE_FADED : strataColor,
        lineWidth: isHighlighted ? 3 : 1.2,
        marker: {
          enabled: isHighlighted,
          radius: isHighlighted ? 5 : 0,
          fillColor: isHighlighted ? strataColor : undefined,
          lineColor: '#fff',
          lineWidth: isHighlighted ? 2 : 0,
        },
        states: { hover: { lineWidth: 2.5, lineWidthPlus: 0 } },
        zIndex: isHighlighted ? 4 : 2,
        cursor: 'pointer',
        custom: { strata },
        point: {
          events: {
            click: function () {
              if (!disabled) {
                setSelectedSubjects((prev) =>
                  prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
                );
              }
            },
          },
        },
        events: {
          mouseOver: function () {},
        },
      });
    });

    series.push({
      type: 'line',
      name: 'Population avg',
      data: popMean,
      color: POPULATION_COLOR,
      lineWidth: 3,
      dashStyle: 'ShortDash',
      marker: {
        enabled: true,
        symbol: 'diamond',
        radius: 5,
        fillColor: '#fff',
        lineColor: POPULATION_COLOR,
        lineWidth: 2.5,
      },
      zIndex: 5,
    });

    return {
      chart: {
        height: 420,
        backgroundColor: charts.backgroundColorInCard,
        style: { fontFamily: 'Roboto Flex, sans-serif' },
        events: { click: function () { if (!disabled) setSelectedSubjects([]); } },
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        title: { text: 'Time', style: { color: '#262626', fontSize: '14px', fontFamily: 'Roboto Flex, sans-serif' } },
        tickPositions: TIME_POINTS,
        labels: {
          formatter: function () { return dayToMonthLabel((this as unknown as { value: number }).value); },
          style: { color: '#666', fontSize: '12px', fontFamily: 'Roboto Mono, monospace', fontWeight: '500' },
        },
        lineColor: charts.axisLineColor,
        tickColor: charts.axisLineColor,
        gridLineWidth: 0,
      },
      yAxis: {
        title: { text: yAxisLabel, style: { color: '#262626', fontSize: '14px', fontFamily: 'Roboto Flex, sans-serif' } },
        labels: { style: { color: '#666', fontSize: '12px', fontFamily: 'Roboto Mono, monospace', fontWeight: '500' } },
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
        shadow: { color: 'rgba(0,0,0,0.07)', offsetX: 0, offsetY: 1, width: 4 },
        style: { color: '#666', fontSize: '14px', fontFamily: 'Roboto Flex, sans-serif' },
        formatter: function () {
          const point = this as unknown as { x: number; y: number; series: { name: string; options: { custom?: { strata?: string } } } };
          const day = point.x;
          const label = dayToMonthLabel(day);
          const popPt = popMean.find((p) => p[0] === day);
          const strata = point.series.options.custom?.strata;
          const strataColor = strata ? STRATA_COLORS[strata]?.line : SELECTED_COLOR;
          let html = `<div style="border-left: 8px solid #A98EF9; padding: 8px 12px;">`;
          html += `<div style="font-weight:600;color:#262626;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid #E8E8E8">${label}</div>`;
          if (popPt) {
            html += `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">`;
            html += `<span style="width:10px;height:10px;background:${POPULATION_BAND_COLOR};border:2px solid ${POPULATION_COLOR};display:inline-block"></span>`;
            html += `Population avg: ${popPt[1].toFixed(2)}</div>`;
          }
          if (point.series.name.startsWith('SUBJ-')) {
            html += `<div style="display:flex;align-items:center;gap:6px">`;
            html += `<span style="width:10px;height:10px;background:${STRATA_COLORS[strata || '']?.band || SELECTED_BAND_COLOR};border:2px solid ${strataColor};display:inline-block"></span>`;
            html += `${point.series.name}${strata ? ` (${strata})` : ''}: ${point.y.toFixed(2)}</div>`;
          }
          html += `</div>`;
          return html;
        },
      },
      plotOptions: { series: { animation: { duration: 300 }, turboThreshold: 0 } },
      series,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredIds, twinSeries, popMean, popBand, JSON.stringify([...highlighted]), showOnlySelected, twinBands, yAxisLabel, disabled]);

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: charts.backgroundColorInCard }}>
      {/* Header row: title + controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#262626' }}>
          Disease progression
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
          {/* View mode toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            size="small"
            onChange={(_, val) => { if (val && !disabled) setInternalViewMode(val); }}
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontSize: 12,
                fontFamily: 'Roboto Mono, monospace',
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
                color: '#888',
                borderColor: '#ddd',
                '&.Mui-selected': {
                  bgcolor: '#F2F0EB',
                  color: '#262626',
                  fontWeight: 600,
                  borderColor: '#ccc',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                },
              },
            }}
          >
            <ToggleButton value="change" disabled={disabled}>
              Change from baseline
            </ToggleButton>
            <ToggleButton value="absolute" disabled={disabled}>
              Absolute values
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel sx={{ fontFamily: 'Roboto Mono, monospace', fontSize: 12, fontWeight: 500 }}>
              Endpoint
            </InputLabel>
            <Select
              value={endpoint}
              label="Endpoint"
              disabled={disabled}
              onChange={(e: SelectChangeEvent) => setInternalEndpoint(e.target.value)}
              sx={{ bgcolor: '#fff', borderRadius: 2, fontFamily: 'Roboto Flex, sans-serif', fontSize: 14 }}
            >
              {Object.entries(ENDPOINTS).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <StrataToggle selectedStrata={selectedStrata} onChange={onStrataChange} disabled={disabled} />
        </Stack>
      </Stack>

      {/* Subject selector + show-only toggle */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5, flexWrap: 'wrap' }}>
        <Autocomplete
          multiple
          value={disabled && lockedSubjects ? lockedSubjects : selectedSubjects}
          onChange={(_, val) => { if (!disabled) setSelectedSubjects(val); }}
          options={filteredIds}
          getOptionLabel={(id) => `${id} (${getSubjectStrata(id)})`}
          disabled={disabled}
          size="small"
          limitTags={3}
          sx={{ minWidth: 280, flex: 1, maxWidth: 480 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Subjects"
              placeholder={highlighted.size === 0 ? 'Select twins to highlight...' : ''}
              InputLabelProps={{ ...params.InputLabelProps, sx: { fontFamily: 'Roboto Mono, monospace', fontSize: 12, fontWeight: 500 } }}
              sx={{ '& .MuiInputBase-root': { bgcolor: '#fff', borderRadius: 2, fontFamily: 'Roboto Flex, sans-serif', fontSize: 13 } }}
            />
          )}
        />
        {hasHighlights && (
          <ToggleButtonGroup
            value={showOnlySelected ? 'only' : 'all'}
            exclusive
            size="small"
            onChange={(_, val) => { if (val) setShowOnlySelected(val === 'only'); }}
            disabled={disabled}
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none', fontSize: 11, fontFamily: 'Roboto Mono, monospace',
                fontWeight: 500, px: 1.5, py: 0.3, color: '#888', borderColor: '#ddd',
                '&.Mui-selected': { bgcolor: '#F2F0EB', color: '#262626', fontWeight: 600, borderColor: '#ccc' },
              },
            }}
          >
            <ToggleButton value="all">Show all</ToggleButton>
            <ToggleButton value="only">Selected only</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>

      {/* Legend */}
      <Stack direction="row" spacing={2.5} sx={{ mb: 1, flexWrap: 'wrap' }}>
        <LegendSwatch color={POPULATION_COLOR} fill={POPULATION_BAND_COLOR} isDashFill label="Population ± SD" />
        {selectedStrata.map((s) => (
          <LegendSwatch key={s} color={STRATA_COLORS[s]?.line || '#999'} fill={STRATA_COLORS[s]?.band} label={`${s} ± SD`} />
        ))}
      </Stack>

      <HighchartsChart options={options} />

      <Typography sx={{ fontSize: 12, color: '#aaa', mt: 1 }}>
        {hasHighlights
          ? `${[...highlighted].join(', ')} highlighted \u2014 click lines or use selector above`
          : 'Click a twin line or use the subject selector to highlight'}
      </Typography>
    </Paper>
  );
}
