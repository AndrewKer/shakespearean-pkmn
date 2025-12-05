import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import "./App.css";
import PkmnNameInput from "./components/PkmnNameInput";
import PkmnDescription from "./components/PkmnDescription";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Box sx={{ width: "100%" }}>
          <Stack spacing={5}>
            <PkmnNameInput />
            <PkmnDescription />
          </Stack>
        </Box>
      </QueryClientProvider>
    </>
  );
}

export default App;
