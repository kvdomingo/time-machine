import { Box, Button } from "@mui/material";

import type { TextLogResponse } from "@/api/types/checkIn.ts";
import { useMemo } from "react";

interface TextLogProps {
  log: TextLogResponse;
}

function TextLog({ log: data }: TextLogProps) {
  const text = useMemo<string>(() => {
    let textLog = "";

    for (const [date, entry] of Object.entries(data)) {
      if (entry.length === 0) continue;

      textLog = textLog.concat(`checkin ${date}`);
      textLog = textLog.concat(
        ...entry.map(
          dat =>
            `\n  • ${dat.duration.toFixed(2)} hr${dat.duration === 1 ? "" : "s"} #${
              dat.tag
            } ${dat.activities}`,
        ),
      );
      textLog += "\n\n";
    }

    return textLog;
  }, [data]);

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
