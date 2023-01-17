import { Box } from "@mui/material";
import { useSelector } from "../../store/hooks";
import { selectTextLog } from "../../store/timeSlice";

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
            `\n- ${dat.duration.toFixed(2)} hr${dat.duration === 1 ? "" : "s"} #${dat.tag} ${dat.activities.join(
              ", ",
            )}`,
        ),
      );
      textLog += "\n\n";
    });
    return textLog;
  }

  return (
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
        minHeight: 150,
      }}
      value={generateLog()}
    />
  );
}

export default TextLog;
