import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Grid, Paper, Tab, Tabs } from "@mui/material";
import { CheckInResponse } from "../../api/types/checkIn";

interface StatsProps {
  checkIns: CheckInResponse[];
  byTag: boolean;
}

interface Data {
  tag: string;
  value: number;
}

enum ChartType {
  Pie,
  Bar,
}

function Stats({ checkIns, byTag }: StatsProps) {
  const [chartSelector, setChartSelector] = useState<ChartType>(ChartType.Pie);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    let uniqueTags = byTag ? [...new Set(checkIns.map(c => c.activities))] : [...new Set(checkIns.map(c => c.tag))];
    let stats: Data[] = uniqueTags.map(tag => ({ tag, value: 0 }));
    checkIns.forEach(c => {
      let indexOfTag = stats.findIndex(s => s.tag === (byTag ? c.activities : c.tag));
      stats[indexOfTag].value += c.duration;
    });
    stats.sort((a, b) => a.value - b.value);

    switch (chartSelector) {
      case ChartType.Pie: {
        setData({
          labels: stats.map(s => s.tag),
          values: stats.map(s => s.value),
          type: "pie",
        });
        break;
      }
      case ChartType.Bar: {
        setData({
          x: stats.map(s => s.value),
          y: stats.map(s => s.tag),
          type: "bar",
          orientation: "h",
          text: stats.map(s => `${s.tag} ${s.value} ${s.value === 1 ? "hr" : "hrs"}`),
        });
        break;
      }
      default: {
        setData({});
      }
    }
  }, [checkIns, chartSelector]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Tabs value={chartSelector} onChange={(e, newValue) => setChartSelector(newValue)}>
        <Tab label="pie" />
        <Tab label="bar" />
      </Tabs>
      <Grid container justifyContent="center" sx={{ overflow: "scroll" }}>
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
              },
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
