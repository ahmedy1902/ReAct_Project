// ...existing imports...

const UserDetails = () => {
  const { user } = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Username
          </Typography>
          <Typography variant="body1">
            {user?.username || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1">
            {user?.email || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Role
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textTransform: 'capitalize',
              color: user?.role === 'admin' ? 'primary.main' : 'text.primary'
            }}
          >
            {user?.role || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Member Since
          </Typography>
          <Typography variant="body1">
            {formatDate(user?.createdAt)}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">
                {user?.stats?.totalPosts || 0}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Total Posts
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">
                {user?.stats?.favoritePosts || 0}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Favorite Posts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
