'use client';

import { Box, Typography, Stack, Chip, IconButton } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/LightbulbOutlined';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LayersIcon from '@mui/icons-material/Layers';
import { INSIGHTS, Insight } from '../data/insights';
import { ENDPOINTS } from '../data/digitalTwinData';

interface InsightsPanelProps {
  activeInsightId: string | null;
  onActivate: (insight: Insight) => void;
  onDeactivate: () => void;
}

const TAG_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  progression: { label: 'Progression', color: '#7B41DA', icon: <TrendingUpIcon sx={{ fontSize: 14 }} /> },
  heterogeneity: { label: 'Heterogeneity', color: '#4C77FF', icon: <ShuffleIcon sx={{ fontSize: 14 }} /> },
  endpoint: { label: 'Endpoint', color: '#fc7233', icon: <TrackChangesIcon sx={{ fontSize: 14 }} /> },
  stratification: { label: 'Stratification', color: '#05706a', icon: <LayersIcon sx={{ fontSize: 14 }} /> },
};

function InsightCard({
  insight,
  isActive,
  onActivate,
  onDeactivate,
}: {
  insight: Insight;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const tag = TAG_CONFIG[insight.tag];
  const isGreyed = !isActive;

  return (
    <Box
      sx={{
        border: isActive ? `2px solid ${tag.color}` : '1px solid #E8E5E0',
        borderRadius: 2,
        p: 2,
        mb: 1.5,
        bgcolor: isActive ? '#fff' : '#FAFAF8',
        opacity: isActive ? 1 : 0.55,
        transition: 'all 0.25s ease',
        cursor: isGreyed ? 'pointer' : 'default',
        '&:hover': isGreyed
          ? { opacity: 0.85, borderColor: tag.color, bgcolor: '#fff' }
          : {},
      }}
      onClick={isGreyed ? onActivate : undefined}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          <Chip
            icon={tag.icon as React.ReactElement}
            label={tag.label}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'Roboto Mono, monospace',
              bgcolor: isActive ? `${tag.color}15` : '#F2F0EB',
              color: isActive ? tag.color : '#999',
              '& .MuiChip-icon': { color: isActive ? tag.color : '#bbb', fontSize: 14 },
            }}
          />
          {isActive && (
            <Chip
              icon={<LockIcon sx={{ fontSize: 12 }} />}
              label={ENDPOINTS[insight.binding.endpoint]}
              size="small"
              sx={{
                height: 22,
                fontSize: 10,
                fontFamily: 'Roboto Mono, monospace',
                bgcolor: '#F2F0EB',
                color: '#666',
                '& .MuiChip-icon': { color: '#999', fontSize: 12 },
              }}
            />
          )}
        </Stack>
        {isActive && (
          <IconButton size="small" onClick={onDeactivate} sx={{ p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 16, color: '#999' }} />
          </IconButton>
        )}
      </Stack>

      {/* Title */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: isActive ? '#262626' : '#888',
          fontFamily: 'Roboto Flex, sans-serif',
          mt: 1,
          mb: 0.5,
          lineHeight: 1.3,
        }}
      >
        {insight.title}
      </Typography>

      {/* Summary — always visible */}
      <Typography
        sx={{
          fontSize: 12,
          color: isActive ? '#555' : '#aaa',
          fontFamily: 'Roboto Flex, sans-serif',
          lineHeight: 1.5,
        }}
      >
        {insight.summary}
      </Typography>

      {/* Detail — only when active */}
      {isActive && (
        <Typography
          sx={{
            fontSize: 12,
            color: '#666',
            fontFamily: 'Roboto Flex, sans-serif',
            lineHeight: 1.6,
            mt: 1.5,
            pt: 1.5,
            borderTop: '1px solid #EEEBE4',
          }}
        >
          {insight.detail}
        </Typography>
      )}

      {/* CTA when inactive */}
      {isGreyed && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mt: 1, color: tag.color, opacity: 0.7 }}
        >
          <LightbulbIcon sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, fontFamily: 'Roboto Mono, monospace' }}>
            Activate to explore
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default function InsightsPanel({
  activeInsightId,
  onActivate,
  onDeactivate,
}: InsightsPanelProps) {
  return (
    <Box
      sx={{
        width: 320,
        minWidth: 320,
        borderLeft: '1px solid #E8E5E0',
        bgcolor: '#fff',
        overflow: 'auto',
        p: 2.5,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        maxHeight: '100vh',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <LightbulbIcon sx={{ fontSize: 18, color: '#9A56FB' }} />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: '#262626',
            fontFamily: 'Roboto Mono, monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Curated Insights
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontSize: 12,
          color: '#999',
          fontFamily: 'Roboto Flex, sans-serif',
          mb: 2,
          lineHeight: 1.5,
        }}
      >
        Select an insight to lock the chart and table to the relevant view.
      </Typography>

      {INSIGHTS.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          isActive={activeInsightId === insight.id}
          onActivate={() => onActivate(insight)}
          onDeactivate={onDeactivate}
        />
      ))}
    </Box>
  );
}
