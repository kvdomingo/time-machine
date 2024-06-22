import type { Data } from "plotly.js";
import { useMemo, useState } from "react";
import Plot from "react-plotly.js";

import api, { BaseQueryKey } from "@/api";

import type { CheckInResponse } from "@/api/types/checkIn.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

interface DataPoint {
  tag: string;
  value: number;
}

type ChartType = "pie" | "bar";

const Route = getRouteApi("/");

interface TabContentProps {
  checkIns: CheckInResponse[];
  data: Data;
}

function TabContent({ checkIns, data }: TabContentProps) {
  return checkIns.length === 0 ? (
    "No checkins within the selected period"
  ) : (
    <Plot
      data={[data]}
      layout={{
        width: 400,
        height: 500,
        margin: { t: 0, b: 0, l: 0, r: 0, pad: 0 },
        legend: {
          orientation: "h",
        },
        font: {
          family: "Nunito",
          color: "white",
        },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
      }}
      config={{
        responsive: true,
        displayModeBar: false,
      }}
    />
  );
}

function Stats() {
  const { tag, start_date, end_date } = Route.useSearch();
  const byTag = !!tag;

  const {
    data: {
      data: { results: checkIns },
    },
  } = useSuspenseQuery({
    queryFn: () => api.checkin.listAll(start_date, end_date),
    queryKey: [BaseQueryKey.CHECKIN, start_date, end_date],
  });

  const [chartSelector, setChartSelector] = useState<ChartType>("pie");
  const uniqueTags = byTag
    ? [...new Set(checkIns.map(c => c.activities))]
    : [...new Set(checkIns.map(c => c.tag))];

  const data = useMemo<Data>(() => {
    const stats: DataPoint[] = uniqueTags.map(tag => ({ tag, value: 0 }));

    for (const c of checkIns) {
      const indexOfTag = stats.findIndex(s => s.tag === (byTag ? c.activities : c.tag));
      stats[indexOfTag].value += c.duration;
    }

    stats.sort((a, b) => a.value - b.value);

    switch (chartSelector) {
      case "pie": {
        return {
          labels: stats.map(s => s.tag),
          values: stats.map(s => s.value),
          type: "pie",
          textinfo: "value+percent",
        };
      }
      case "bar": {
        return {
          x: stats.map(s => s.value),
          y: stats.map(s => s.tag),
          type: "bar",
          orientation: "h",
          text: stats.map(s => `${s.tag} ${s.value} ${s.value === 1 ? "hr" : "hrs"}`),
        };
      }
      default: {
        return {};
      }
    }
  }, [checkIns, chartSelector, byTag, uniqueTags]);

  return (
    <Tabs
      className="mt-8 flex flex-col items-center"
      value={chartSelector}
      onValueChange={value => setChartSelector(value as ChartType)}
    >
      <TabsList>
        <TabsTrigger value="pie">Pie</TabsTrigger>
        <TabsTrigger value="bar">Bar</TabsTrigger>
      </TabsList>
      <TabsContent className="mt-4" value="pie">
        <TabContent checkIns={checkIns} data={data} />
      </TabsContent>
      <TabsContent value="bar">
        <TabContent checkIns={checkIns} data={data} />
      </TabsContent>
    </Tabs>
  );
}

export default Stats;
