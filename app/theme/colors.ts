// Pulled from dashboard-dev/web/src/themes/colors
export const purpleGraphLine = '#2802A1';
export const orangeGraphLine = '#CC3700';
export const grayDK90 = '#262626';
export const txtColorPrimary = '#262626';
export const txtColorSecondary = '#666';

export const charts = {
  axisLabelColor: '#666',
  titleColor: grayDK90,
  backgroundColor: '#FCFBF7',
  backgroundColorInCard: '#FFF',
  gridLineColor: '#EEEBE4',
  axisLineColor: '#BCBCBC',
} as const;

export const tooltipContainerStyle = {
  background: '#fff',
  borderRadius: '4px',
  borderLeft: '8px solid #A98EF9',
  padding: '10px 12px',
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.07)',
  zIndex: 5,
} as const;

export const SERIES_COLORS = [
  '#9A56FB', '#4C77FF', '#fc7233', '#05706a', '#962704',
  '#63d1f4', '#6ebf6e', '#d07290', '#fbc02d', '#ff2d55',
];

export const SELECTED_COLOR = '#CC3700';
export const POPULATION_COLOR = '#2802A1';
export const POPULATION_BAND_COLOR = 'rgba(40, 2, 161, 0.12)';
export const SELECTED_BAND_COLOR = 'rgba(204, 55, 0, 0.15)';
export const TWIN_LINE_COLOR = '#C4B5A8';
export const TWIN_LINE_FADED = 'rgba(200, 200, 200, 0.35)';

// Strata-specific colors (line, band)
export const STRATA_COLORS: Record<string, { line: string; band: string; faded: string }> = {
  'Stage I':   { line: '#9A56FB', band: 'rgba(154, 86, 251, 0.18)', faded: 'rgba(154, 86, 251, 0.25)' },
  'Stage II':  { line: '#4C77FF', band: 'rgba(76, 119, 255, 0.18)', faded: 'rgba(76, 119, 255, 0.25)' },
  'Stage III': { line: '#fc7233', band: 'rgba(252, 114, 51, 0.18)', faded: 'rgba(252, 114, 51, 0.25)' },
};
