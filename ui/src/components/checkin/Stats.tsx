import type { Data } from "plotly.js";
import { useMemo, useState } from "react";
import Plot from "react-plotly.js";

import { Grid, Paper, Tab, Tabs } from "@mui/material";

import api, { BaseQueryKey } from "@/api";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

interface DataPoint {
  tag: string;
  value: number;
}

enum ChartType {
  Pie,
  Bar,
}

const Route = getRouteApi("/");

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

  const [chartSelector, setChartSelector] = useState<ChartType>(ChartType.Pie);
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
      case ChartType.Pie: {
        return {
          labels: stats.map(s => s.tag),
          values: stats.map(s => s.value),
          type: "pie",
          textinfo: "value+percent",
        };
      }
      case ChartType.Bar: {
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
    <Paper elevation={2} sx={{ p: 2, backgroundColor: "black", mt: 4 }}>
      <Grid container justifyContent="center">
        <Tabs
          value={chartSelector}
          onChange={(_, newValue) => setChartSelector(newValue)}
        >
          <Tab label="pie" />
          <Tab label="bar" />
        </Tabs>
      </Grid>
      <Grid container mt={2} justifyContent="center" sx={{ overflow: "scroll" }}>
        {checkIns.length === 0 ? (
          "No check ins within the selected period"
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
        )}
      </Grid>
    </Paper>
  );
}

export default Stats;
