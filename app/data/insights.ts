/** Types matching insights-schema.json */

export interface InsightBinding {
  endpoint: string;
  chart_strata: string[];
  table_strata?: string[];
  /** "change" (default) or "absolute" — controls y-axis mode */
  view_mode?: 'change' | 'absolute';
  /** Optional: pre-select a specific subject in the chart */
  subject?: string;
}

export interface Insight {
  id: string;
  tag: 'progression' | 'heterogeneity' | 'endpoint' | 'stratification' | 'safety' | 'enrichment';
  title: string;
  summary: string;
  detail?: string;
  binding: InsightBinding;
  priority?: number;
  status?: 'draft' | 'review' | 'approved';
}

export interface InsightsFile {
  version: string;
  study_id: string;
  created_by?: string;
  created_at?: string;
  insights: Insight[];
}

/**
 * Load and filter insights from a parsed InsightsFile.
 * Only returns approved insights, sorted by priority.
 */
export function loadInsights(file: InsightsFile): Insight[] {
  return file.insights
    .filter((i) => (i.status || 'approved') === 'approved')
    .sort((a, b) => (a.priority || 3) - (b.priority || 3));
}

/**
 * Normalize binding: if table_strata is missing, default to chart_strata.
 */
export function normalizeBinding(binding: InsightBinding) {
  return {
    endpoint: binding.endpoint,
    chartStrata: binding.chart_strata,
    tableStrata: binding.table_strata || binding.chart_strata,
    viewMode: (binding.view_mode || 'change') as 'change' | 'absolute',
    subject: binding.subject || null,
  };
}
