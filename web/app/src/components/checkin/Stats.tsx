import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { Grid, Paper, Tab, Tabs } from "@mui/material";
import dateFormat from "dateformat";
import { CheckInResponse } from "../../api/types/checkIn";
import { useSelector } from "../../store/hooks";
import { selectCheckIns } from "../../store/timeSlice";

interface ChartData {
  labels: string[];
  values: number[];
}

function Stats() {
  const period = ["day", "week", "month", "allTime"];
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<ChartData>({ labels: [], values: [] });
  const checkIns = useSelector(selectCheckIns);

  useEffect(() => {
    updateStats();
  }, [tab, checkIns]);

  function millisToDays(ms: number) {
    return ms / 1000 / 60 / 60 / 24;
  }

  function condition(checkIn: CheckInResponse) {
    const now = new Date();

    switch (period[tab]) {
      case "allTime":
        return true;
      case "month": {
        return dateFormat(now, "yyyy-mm") === dateFormat(new Date(checkIn.created), "yyyy-mm");
      }
      case "week": {
        return millisToDays(now.getTime()) - millisToDays(new Date(checkIn.created).getTime()) <= 7;
      }
      case "day": {
        return dateFormat(now, "yyyy-mm-dd") === dateFormat(new Date(checkIn.created), "yyyy-mm-dd");
      }
    }
  }

  function updateStats() {
    let stats = {} as { [key: string]: number };
    let uniqueTags = new Set(checkIns.map(c => c.tag));
    uniqueTags.forEach(tag => {
      stats[tag] = 0;
    });
    checkIns.filter(condition).forEach(c => {
      stats[c.tag] += c.duration;
    });
    chartUpdate(stats);
  }

  function chartUpdate(data: { [key: string]: number }) {
    setData({
      labels: Object.keys(data),
      values: Object.values(data),
    });
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
        <Tab label="day" />
        <Tab label="week" />
        <Tab label="month" />
        <Tab label="allTime" />
      </Tabs>
      <Grid container mt={2} justifyContent="center" sx={{ overflow: "scroll" }}>
        {data.values.length === 0 || data.values.reduce((acc, val) => acc + val, 0) === 0 ? (
          "No check ins for the selected period"
        ) : (
          <Plot
            data={[{ ...data, type: "pie" }]}
            layout={{ width: 400, height: 400, margin: { pad: 0, t: 0, b: 0, l: 0, r: 0 } }}
          />
        )}
      </Grid>
    </Paper>
  );
}

export default Stats;
