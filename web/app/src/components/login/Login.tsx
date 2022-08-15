import { useState } from "react";
import { Button, Container, Grid, Paper } from "@mui/material";
import LoginMain from "./LoginMain";
import SignUp from "./SignUp";

enum Page {
  Login,
  SignUp,
}

function Login() {
  const [page, setPage] = useState(Page.Login);

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={2} sx={{ p: 4, width: 400 }}>
        {page === Page.Login ? <LoginMain /> : <SignUp goToLogin={() => setPage(Page.Login)} />}
        <Grid container justifyContent="center" mt={2}>
          <Button
            variant="text"
            color="primary"
            onClick={() => setPage(page === Page.Login ? Page.SignUp : Page.Login)}
          >
            {page === Page.Login ? "Sign up" : "Log in instead"}
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Login;
