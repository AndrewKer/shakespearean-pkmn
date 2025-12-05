import CardMedia from "@mui/material/CardMedia";
import { useQuery } from "@tanstack/react-query";

export default function PkmnSprite({ name }: { name?: string }) {
  if (!name) return null;

  const { data, isLoading, error } = useQuery({
    queryKey: ["sprite", name],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-form/${name}`
      );
      if (!response.ok) throw new Error("Failed to fetch pokemon sprite");
      return response.json();
    },
  });

  if (isLoading || error) return <></>;

  return (
    <CardMedia
      component="img"
      sx={{ width: 151 }}
      image={data ? data?.sprites.front_default : "src/assets/react.svg"}
      alt="pkmn sprite"
    />
  );
}
