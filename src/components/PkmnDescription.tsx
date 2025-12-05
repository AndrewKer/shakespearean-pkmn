import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

export default function PkmnDescription({ name }: { name?: string }) {
  if (!name) return null;

  const { data, isLoading, error } = useQuery({
    queryKey: ['name', name],
    queryFn: async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      if (!response.ok) throw new Error('Failed to fetch pokemon data');
      return response.json();
    },
      
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card sx={{ display: "flex" }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="src\assets\react.svg"
        alt="pkmn sprite"
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {data?.name.toUpperCase()}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {data?.flavor_text_entries[0].flavor_text.replace(/\f/g, ' ')}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
