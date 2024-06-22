import { Box } from "@mui/material";

import type { TextLogResponse } from "@/api/types/checkIn.ts";
import { Button } from "@/components/ui/button.tsx";
import { useMemo } from "react";
import { toast } from "sonner";

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
        onClick={() => {
          void navigator.clipboard.writeText(text);
          toast.info("Copied to clipboard");
        }}
        className="my-2"
      >
        Copy to clipboard
      </Button>
      <Box
        component="textarea"
        readOnly
        className="pointer-events-none h-full w-full rounded-xl border border-ctp-surface2 bg-transparent p-4 text-ctp-text shadow-none active:ring-0 focus-visible:ring-0 focus:ring-0"
        value={text}
      />
    </>
  );
}

export default TextLog;
