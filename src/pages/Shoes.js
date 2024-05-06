import { Box } from "@mui/material";
import { React, useEffect } from "react";
import Navbar from "../common/components/Navbar";
import { useDb } from "../common/context/DbContext";
import { useAzDb } from "../common/context/AzureDbContext";
import Game from "../common/components/Game";
import bg2 from "../common/assets/bg2.png";
import newBg from "../common/assets/bg.png";
function Shoes() {
  const { fetchGameData, gameData } = useAzDb();

  useEffect(() => {
    async function fetchData(retries = 1) {
      if (retries === 0) return;
      await fetchGameData();
      if (gameData === undefined) {
        console.log("No data");
        // Fetch again after a delay
        setTimeout(() => fetchData(retries - 1), 1000);
      } else {
        console.log(gameData.shoes);
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
        backgroundImage: `url(${newBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
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
      {gameData && <Game gameData={gameData.shoes} from="shoes" />}
    </Box>
    </Box>
  );
}

export default Shoes;
