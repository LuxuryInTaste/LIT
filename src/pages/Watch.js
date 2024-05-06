import { Box } from "@mui/material";
import React from "react";
import Navbar from "../common/components/Navbar";
import Game from "../common/components/Game";
import { useDb } from "../common/context/DbContext";
import { useAzDb } from "../common/context/AzureDbContext";
import bg2 from "../common/assets/bg2.png";
function Watch() {
  // const { gameData } = useDb();
  const { gameData } = useAzDb();
  return (
    <Box
      sx={{
        backgroundImage: `url(${bg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      {gameData && <Game gameData={gameData.watches} from="watch" />}
    </Box>
  );
}

export default Watch;
