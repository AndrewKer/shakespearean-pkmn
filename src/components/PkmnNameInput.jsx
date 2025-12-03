import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function PkmnNameInput() {
  const [pkmnName, setPkmnName] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      alert(pkmnName);
    }
  };

  return (
    <Box sx={{ width: 500, maxWidth: "100%" }}>
      <TextField
        data-testid="pkmn-name-input"
        fullWidth
        value={pkmnName}
        onKeyDown={handleKeyDown}
        onChange={(e) => setPkmnName(e.target.value)}
      />
    </Box>
  );
}
