import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import PkmnSprite from "./PkmnSprite";
import ShakespeareTranslator from "./ShakespeareTranslator";
import { useFavourites } from "../hooks/useFavourites";

export default function PkmnDescription({ name }: { name?: string }) {
  if (!name) return null;

  const { addFavourite } = useFavourites();

  const { data, isLoading, error } = useQuery({
    queryKey: ["description", name],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`
      );
      if (!response.ok) throw new Error("Failed to fetch pokemon data");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const firstEnglishEntry = data.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  const descriptionText = firstEnglishEntry
    ? firstEnglishEntry.flavor_text.replace(/\f/g, " ")
    : "No english description available";

  const handleAddFavourite = () => {
    addFavourite({
      name: data?.name,
      description: descriptionText,
      shakespeareanDescription: "",
      spriteUrl: "",
    });
  };

  return (
    <Card sx={{ display: "flex" }} data-testid="pkmn-description">
      <PkmnSprite name={data?.name} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {data?.name.toUpperCase()}
          </Typography>
          <ShakespeareTranslator text={descriptionText} />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={handleAddFavourite}
            data-testid="favourite-add-button"
          >
            Add to favourites
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
