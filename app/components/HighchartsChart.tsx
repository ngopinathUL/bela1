'use client';

import * as Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  highchartsMore(Highcharts);
}

interface Props {
  options: Highcharts.Options;
}

export default function HighchartsChart({ options }: Props) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Force reflow after mount so Highcharts picks up the container width
  useEffect(() => {
    const timer = setTimeout(() => {
      chartRef.current?.chart?.reflow();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: '100%', minHeight: 420 }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
}
