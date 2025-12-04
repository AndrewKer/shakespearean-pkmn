import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function PkmnDescription() {

  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            PKMN NAME
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            DESCRIPTION
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="/static/images/cards/live-from-space.jpg"
        alt="pkmn sprite"
      />
    </Card>
  );
}