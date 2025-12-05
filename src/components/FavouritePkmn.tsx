import React, { useContext } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFavourites, PkmnFavourite } from "../hooks/useFavourites";
import { FavContext } from "../App";


export default function FavouritePkmn() {
  const { removeFavourite, clearAll, isLoading } = useFavourites();
  const context = useContext(FavContext);
  const storedFavourites = context?.favourites ?? [];

  return (
    <Box sx={{ maxWidth: 480, width: "100%" }} >
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Button color="inherit" onClick={clearAll} data-testid="favourite-clear-button">
          Clear
        </Button>
      </Box>

      <Divider />

      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Favourite Pokemon
        </Typography>

        {isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading favourites...
          </Typography>
        ) : storedFavourites.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No favourite pokemons yet
          </Typography>
        ) : (
          <List data-testid="favourites-list">
            {storedFavourites.map((p: PkmnFavourite, i: number) => (
              <ListItem
                key={p.name + i}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`remove ${p.name}`}
                    onClick={() => removeFavourite(p.name)}
                    data-testid={`favourite-remove-${i}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                divider
              >
                <ListItemText primary={p.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}