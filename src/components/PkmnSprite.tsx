import CardMedia from "@mui/material/CardMedia";

export default function PkmnSprite({ sprite }: { sprite?: string }) {
  if (!sprite || !sprite.trim()) return null;

  return (
    <CardMedia
      component="img"
      sx={{ width: 151, height: 151 }}
      image={sprite}
      alt="pkmn sprite"
    />
  );
}
