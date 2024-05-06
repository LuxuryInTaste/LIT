import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DbContext = createContext();

const AzDbProvider = ({ children }) => {
  const [accessoriesData, setAccessoriesData] = useState();
  const [shoesData, setShoesData] = useState();
  const [bagsData, setBagsData] = useState();
  const [clothingData, setClothingData] = useState();
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState()

  const fetchGameData = async () => {
    let imageData = {
      bags: [],
      shoes: [],
      clothes: [],
      accessories: [],
    };
    try {
      setLoading(true);

      // Fetch data for all categories simultaneously
      const [accessoriesResponse, shoesResponse, bagsResponse, clothingResponse] = await Promise.all([
        axios.get("https://lit-backend.azurewebsites.net/api/game/data/accessories").catch((error) => console.error("Error fetching accessories data:", error)),
        axios.get("https://lit-backend.azurewebsites.net/api/game/data/shoes"),
        axios.get("https://lit-backend.azurewebsites.net/api/game/data/bags"),
        axios.get("https://lit-backend.azurewebsites.net/api/game/data/clothing")
      ]);

      // Set state with fetched data for each category
      // setAccessoriesData(accessoriesResponse.data);
      // setShoesData(shoesResponse.data);
      // setBagsData(bagsResponse.data);
      // setClothingData(clothingResponse.data);
      const formattedBagsData = bagsResponse.data.map(obj => JSON.parse(JSON.stringify(obj)));
      const formattedShoesData = shoesResponse.data.map(obj => JSON.parse(JSON.stringify(obj)));
      const formattedAccessoriesData = accessoriesResponse.data.map(obj => JSON.parse(JSON.stringify(obj)));
      const formattedClothingData = clothingResponse.data.map(obj => JSON.parse(JSON.stringify(obj)));

    //   console.log(formattedBagsData[1].category);

      imageData.accessories = formattedAccessoriesData;
      imageData.shoes = formattedShoesData;
      imageData.bags = formattedBagsData;
      imageData.clothes = formattedClothingData;
      setGameData(imageData);
    console.log(imageData);
    //console.log(imageData.bags);
    //console.log(imageData.bags[0]);
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setLoading(false);
    }
  };

  const storeGameData = async (values) => {
    // Your existing function to store game data
    console.log("Game data storage not functional yet");
  };

//   useEffect(() => {
//     // Fetch data for all categories when component mounts
//     fetchGameData();
//   }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <DbContext.Provider
      value={{ gameData, fetchGameData, loading, storeGameData }}
    >
      {children}
    </DbContext.Provider>
  );
};

const useAzDb = () => useContext(DbContext);

export { AzDbProvider, useAzDb };