'use client';

import * as Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import { HighchartsReact } from 'highcharts-react-official';
import { useRef } from 'react';

if (typeof window !== 'undefined') {
  highchartsMore(Highcharts);
}

interface Props {
  options: Highcharts.Options;
}

export default function HighchartsChart({ options }: Props) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartRef}
    />
  );
}
