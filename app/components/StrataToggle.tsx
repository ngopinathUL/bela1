'use client';

import { Chip, Stack, Typography } from '@mui/material';
import { STRATA } from '../data/digitalTwinData';
import { STRATA_COLORS } from '../theme/colors';

interface StrataToggleProps {
  selectedStrata: string[];
  onChange: (next: string[]) => void;
}

export default function StrataToggle({ selectedStrata, onChange }: StrataToggleProps) {
  const handleToggle = (strata: string) => {
    const isActive = selectedStrata.includes(strata);
    if (isActive && selectedStrata.length === 1) return; // keep at least 1
    const next = isActive
      ? selectedStrata.filter((s) => s !== strata)
      : [...selectedStrata, strata];
    onChange(next);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: '#888',
          fontFamily: 'Roboto Mono, monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.36px',
          mr: 0.5,
        }}
      >
        Strata
      </Typography>
      {STRATA.map((s) => {
        const active = selectedStrata.includes(s);
        const color = STRATA_COLORS[s]?.line || '#999';
        return (
          <Chip
            key={s}
            label={s}
            size="small"
            onClick={() => handleToggle(s)}
            sx={{
              height: 28,
              fontSize: 13,
              fontFamily: 'Roboto Flex, sans-serif',
              fontWeight: active ? 600 : 400,
              bgcolor: active ? STRATA_COLORS[s]?.band || '#eee' : 'transparent',
              border: `2px solid ${active ? color : '#ddd'}`,
              color: active ? color : '#aaa',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: STRATA_COLORS[s]?.band || '#f5f5f5',
                borderColor: color,
              },
            }}
          />
        );
      })}
    </Stack>
  );
}
