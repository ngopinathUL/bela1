'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface HighchartsWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructOptions: (Highcharts: any) => any;
}

function HighchartsWrapperInner({ constructOptions }: HighchartsWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hc, setHc] = useState<any>(null);

  // Load Highcharts once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import('highcharts');
      const Highcharts = mod.default || mod;
      const moreMod = await import('highcharts/highcharts-more');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const more: any = moreMod.default || moreMod;
      more(Highcharts);
      if (!cancelled) setHc(Highcharts);
    })();
    return () => { cancelled = true; };
  }, []);

  // Create / update chart
  useEffect(() => {
    if (!hc || !containerRef.current) return;

    const opts = constructOptions(hc);

    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = hc.chart(containerRef.current, opts);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [hc, constructOptions]);

  if (!hc) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 370 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', minHeight: 370 }} />;
}

export default memo(HighchartsWrapperInner);
