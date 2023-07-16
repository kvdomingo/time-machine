import { Box, Button } from "@mui/material";

import { useSelector } from "@/store/hooks.ts";
import { selectTextLog } from "@/store/timeSlice.ts";

function TextLog() {
  const data = useSelector(selectTextLog);

  function generateLog() {
    let textLog = "";
    Object.entries(data).forEach(([date, entry]) => {
      if (entry.length === 0) return;
      textLog = textLog.concat(`checkin ${date}`);
      textLog = textLog.concat(
        ...entry.map(
          dat =>
            `\n- ${dat.duration.toFixed(2)} hr${
              dat.duration === 1 ? "" : "s"
            } #${dat.tag} ${dat.activities.join(", ")}`,
        ),
      );
      textLog += "\n\n";
    });
    return textLog;
  }

  const text = generateLog();

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={() => navigator.clipboard.writeText(text)}
        className="my-2"
      >
        Copy to clipboard
      </Button>
      <Box
        component="textarea"
        readOnly
        sx={{
          p: 2,
          width: "100%",
          backgroundColor: "background.default",
          color: "text.primary",
          borderColor: "text.primary",
          boxShadow: "none",
          borderWidth: 1,
          borderRadius: 5,
          height: "100%",
        }}
        value={text}
      />
    </>
  );
}

export default TextLog;
