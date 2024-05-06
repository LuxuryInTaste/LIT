import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../common/components/Navbar";
import bg2 from "../common/assets/bg2.png";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Link,
  Grid,
  Button
} from "@mui/material";

const GameImgPage = () => {
  const location = useLocation();
  const selectedImages = location.state.selectedImages;
  console.log("selectedImages");
  console.log(selectedImages);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: `url(${bg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // backgroundColor: "rgba(0,0,0,.1)",
        height: "100vh",
        width: "100%",
        position: "fixed",
        overflow: "auto",
      }}
    >
      <Navbar />
      <Button
        variant="filled"
        color="primary"
        onClick={() => navigate("/home")}
        sx={{ margin: 2 }}
      >
        Back to Game
      </Button>

      {selectedImages.length !== 0 && (
        <Box 
          sx={{ 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            backgroundColor: "rgba(0,0,0,.1)",
          }}
        >
          <Grid container spacing={2}>
            {selectedImages.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ display: "flex", marginBottom: 2, width: "100%" }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 200, height: 200, objectFit: "cover" }} // Adjust as needed
                    image={item.imageLink}
                    alt={item.brand_name}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontFamily: "CSGordon",
                        }}
                      >
                        BRAND: {item.brand_name}
                      </Typography>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontFamily: "CSGordon",
                        }}
                      >
                        Price:{" "}
                        <span style={{ color: "#FF76FE" }}>₹{item.price}</span>
                      </Typography>
                      <Typography
                        sx={{
                          textTransform: "uppercase",
                          fontFamily: "CSGordon",
                        }}
                      >
                        Link:
                        <Link
                          href={item.productLink}
                          style={{
                            color: "blue",
                            wordBreak: "break-all",
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.productLink}
                        </Link>
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {selectedImages.length === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 64px)",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: "CSGordon", fontWeight: "600" }}
          >
            No items selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GameImgPage;
