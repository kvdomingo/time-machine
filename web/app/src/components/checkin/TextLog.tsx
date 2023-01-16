import { Box } from "@mui/material";
import moment from "moment";
import { useSelector } from "../../store/hooks";
import { selectTextLog } from "../../store/timeSlice";

function TextLog() {
  const data = useSelector(selectTextLog);

  function generateLog() {
    let textLog = `checkin ${moment().format("YYYY-MM-DD")}`;
    textLog = textLog.concat(
      ...data.map(
        dat =>
          `\n- ${dat.duration.toFixed(2)} hr${dat.duration === 1 ? "" : "s"} #${dat.tag} ${dat.activities.join(", ")}`,
      ),
    );
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
