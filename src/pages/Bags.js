import { Box } from "@mui/material";
import {React, useEffect} from "react";
import Navbar from "../common/components/Navbar";
import { useDb } from "../common/context/DbContext";
import { useAzDb } from "../common/context/AzureDbContext";
import Game from "../common/components/Game";
import bg2 from "../common/assets/bg.png";
import { useNavigate } from "react-router-dom";

function Bags() {
  const navigate = useNavigate();
  // const { gameData } = useDb();
  const { fetchGameData, gameData } = useAzDb();

  useEffect(() => {
    async function fetchData(retries = 1) {
      if (retries === 0) return;
      await fetchGameData();
      if (gameData === undefined) {
        console.log("No data");
        // Fetch again after a delay
        setTimeout(() => fetchData(retries - 1), 1000);
      }
    }
    if (gameData === undefined) {
      fetchData();
    }
  }, [fetchGameData, gameData]);
  return (
    <Box
      height={"100vh"}
    >
      <Box
      sx={{
        backgroundImage: `url(${bg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%",
        width: "100%",
        position: "fixed",
        overflow: "auto",
        //hide scrollbar
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "&": {
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
        },

      }}
    >
      <Navbar />
      {gameData && <Game gameData={gameData.bags} from="bags" />}
    </Box>
    </Box>
  );
}

export default Bags;
