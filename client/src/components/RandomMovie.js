import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Slide, IconButton, Alert } from "@mui/material";
import { Close } from "@mui/icons-material";


const RandomMovie = ({ setShowRandom }) => {
  const [failure, setFailure] = useState(false);
  const navigate = useNavigate();

  const closeAlert = () => {
    setFailure(false);
    setTimeout(() => setShowRandom(false), 300);
  };

  const handleFailure = () => {
    setFailure(true);
    setTimeout(() => closeAlert(), 3000);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/random`)
      .then((resp) => resp.json())
      .then((respJson) => {
        if (!!respJson?.id) {
          setShowRandom(false);
          navigate(`/movie/${respJson?.id}`)
        } else {
          console.log("Bad resp");
          handleFailure();
        }
      })
      .catch((error) => handleFailure());
  }, []);

  return (
    <Slide direction='left' in={failure}>
      <Alert
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          m: 4
        }}
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => closeAlert()}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }>
        Failed to load
      </Alert>
    </Slide>
  );
};

export default RandomMovie;