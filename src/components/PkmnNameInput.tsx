import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PkmnDescription from "./PkmnDescription";

export default function PkmnNameInput() {
  const [pkmnName, setPkmnName] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      setShowResult(true);
    }
  };

  return (
    <Box sx={{ width: 500, maxWidth: "100%" }}>
      <TextField
        data-testid="pkmn-name-input"
        fullWidth
        value={pkmnName}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setPkmnName(e.target.value);
          setShowResult(false);
        }}
      />
      {showResult && <PkmnDescription name={pkmnName} />}
    </Box>
  );
}
