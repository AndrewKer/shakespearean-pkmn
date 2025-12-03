import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function FullWidthTextField() {
  const [pkmnName, setPkmnName] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      alert("Running action for " + pkmnName);
    }
  };

  return (
    <Box sx={{ width: 500, maxWidth: "100%" }}>
      <TextField
        id="fullWidth"
        fullWidth
        value={pkmnName}
        onKeyDown={handleKeyDown}
        onChange={(e) => setPkmnName(e.target.value)}
      />
    </Box>
  );
}
