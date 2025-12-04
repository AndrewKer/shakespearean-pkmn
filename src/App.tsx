import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./App.css";
import PkmnNameInput from "./components/PkmnNameInput";
import PkmnDescription from "./components/PkmnDescription";

function App() {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={5}>
          <PkmnNameInput />
          <PkmnDescription />
        </Stack>
      </Box>
    </>
  );
}

export default App;
