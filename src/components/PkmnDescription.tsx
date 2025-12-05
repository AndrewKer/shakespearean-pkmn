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
import { useRef } from "react";

export default function PkmnDescription({ name }: { name?: string }) {
  if (!name || !name.trim()) return null;

  const { addFavourite } = useFavourites();
  const shakespeareanRef = useRef<string>("");

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

  // Fetch sprite separately
  const { data: spriteData, isLoading: isSpriteLoading } = useQuery({
    queryKey: ["sprite", name],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-form/${name}`
      );
      if (!response.ok) throw new Error("Failed to fetch pokemon sprite");
      return response.json();
    },
    enabled: !!name,
  });

  if (isLoading || isSpriteLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const firstEnglishEntry = data.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  const descriptionText = firstEnglishEntry
    ? firstEnglishEntry.flavor_text.replace(/\f/g, " ")
    : "No english description available";

  const spriteUrl = spriteData?.sprites?.front_default || "src/assets/react.svg";

  const handleAddFavourite = () => {
    addFavourite({
      name: data?.name,
      description: descriptionText,
      shakespeareanDescription: shakespeareanRef.current,
      spriteUrl,
    });
  };

  return (
    <Card sx={{ display: "flex" }} data-testid="pkmn-description">
      <PkmnSprite sprite={spriteUrl} />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {data?.name.toUpperCase()}
          </Typography>
          <ShakespeareTranslator
            text={descriptionText}
            onTranslated={(translated) => {
              shakespeareanRef.current = translated;
            }}
          />
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
