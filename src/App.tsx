import { createContext, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import PkmnNameInput from "./components/PkmnNameInput";
import FavouritePkmn from "./components/FavouritePkmn";
import { PkmnFavourite } from "./hooks/useFavourites";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create context
export const FavContext = createContext<{
  favourites: PkmnFavourite[];
  setFavourites: (favourites: PkmnFavourite[]) => void;
}>({
  favourites: [],
  setFavourites: () => {},
});

function App() {
  const [favourites, setFavourites] = useState<PkmnFavourite[]>([]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Box sx={{ width: "100%" }}>
          <Stack spacing={5}>
            <FavContext.Provider value={{ favourites, setFavourites }}>
              <PkmnNameInput />
              <FavouritePkmn />
            </FavContext.Provider>
          </Stack>
        </Box>
      </QueryClientProvider>
    </>
  );
}

export default App;
