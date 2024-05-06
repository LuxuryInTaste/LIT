import React, { useState, useEffect } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { MdOutlineZoomIn, MdOutlineZoomOut } from "react-icons/md";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
// import { Controlled as ControlledZoom } from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";
import Navbar from "./Navbar";

import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  IconButton,
  Link,
  styled,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDb } from "../context/DbContext";
import baseImage from "../assets/base2.png";
import newBaseImg from "../assets/new_base.png";
import gameTxtBg from "../assets/game_txt_bg.png";
import diamondImg from "../assets/diamond_img.png";
import lineImage from "../assets/game_partition_line.png";
import gameProductsCart from "../../pages/GameProductsCart";
import { set } from "firebase/database";
import { green } from "@mui/material/colors";

function Game({ gameData, from }) {
  const [selections, setSelections] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledData, setShuffledData] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [isLowLeft, setIsLowLeft] = useState(Math.random() < 0.5);
  const [currentScore, setCurrentScore] = useState(0);
  const { userId, userEmail } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [reset, setReset] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCorrectLeftAnswer, setShowCorrectLeftAnswer] = useState(false);
  const [showWrongLeftAnswer, setShowWrongLeftAnswer] = useState(false);
  const [showCorrectRightAnswer, setShowCorrectRightAnswer] = useState(false);
  const [showWrongRightAnswer, setShowWrongRightAnswer] = useState(false);
  const [showScoreRise, setShowScoreRise] = useState(false);
  const [productStatus, setProductStatus] = useState(false); // to show the product not saved in list
  const { storeGameData } = useDb();
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomImgPosition, setZoomImgPosition] = useState({ x: 0, y: 0 });
  const imageRef = React.useRef(null);
  const navigate = useNavigate();

  console.log(gameData);

  useEffect(() => {
    console.log("sending");
    const shuffleArray = (array) => {
      const shuffled = array.slice();

      //Fisher-Yates (or Knuth) shuffle algorithm
      // iterating backwards through the array, and for each element, swapping it with an element at a random index that is less than or equal to it. This results in a randomly shuffled array
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Ensure "low" and "high" options do not appear consecutively
      // for (let i = 0; i < shuffled.length - 1; i++) {
      //   if (shuffled[i].choice === "low" && shuffled[i + 1].choice === "high") {
      //     [shuffled[i], shuffled[i + 1]] = [shuffled[i + 1], shuffled[i]];
      //   } else if (
      //     shuffled[i].choice === "high" &&
      //     shuffled[i + 1].choice === "low"
      //   ) {
      //     [shuffled[i], shuffled[i + 1]] = [shuffled[i + 1], shuffled[i]];
      //   }
      // }

      return shuffled;
    };

    setShuffledData(shuffleArray(gameData));
  }, [reset]);

  const logGameData = () => {
    // console.log(selectedImages);
    // const correctOnepicked = selectedImages.filter(
    //   (item) => item.choice === "high"
    // );
    // const wrongOnepicked = selectedImages.filter(
    //   (item) => item.choice === "low"
    // );
    // const score = correctOnepicked.length;
    // const timestamp = new Date().toISOString();
    // const gameResult = {
    //   userId,
    //   userEmail,
    //   score,
    //   correctOnepicked,
    //   wrongOnepicked,
    //   gamedomain: from,
    //   timestamp,
    // };
    // console.log(gameResult);
    // storeGameData(gameResult);
  };

  const imgLink = (img_id) => {
    return `https://luxuryintaste.blob.core.windows.net/game-images/${img_id}.png`;
  };
  const handleSaveToCart = (currentData, chosenProduct) => {
    let selectedImage;
    if (chosenProduct === "affordable") {
      selectedImage = {
        choice: "low",
        imageLink: imgLink(currentData.img_id_affordable),
        brand_name: currentData.brand_name_affordable,
        category: currentData.category_name,
        category_name: currentData.category_name,
        productLink: currentData.product_link_affordable,
        price: currentData.price_affordable,
      };
    } else {
      selectedImage = {
        choice: "high",
        imageLink: imgLink(currentData.img_id_expensive),
        brand_name: currentData.brand_name_expensive,
        category: currentData.category_name,
        category_name: currentData.category_name,
        productLink: currentData.product_link_expensive,
        price: currentData.price_expensive,
      };
    }
    console.log(selectedImage);
    // setSelections([...selections, chosenProduct]);
    const imageData = selectedImages;
    imageData.push(selectedImage);
    setSelectedImages(imageData);
    console.log(selectedImages);
    // setCurrentIndex(currentIndex + 1);
  };

  const handleImageClick = (choice, side) => {
    if (!gameEnded) {
      const currentData = shuffledData[currentIndex];
      if (choice === "high" && !showInfo) {
        setCurrentScore(currentScore + 1);
        if (side === "left") {
          setShowCorrectLeftAnswer(true);
          setTimeout(() => setShowCorrectLeftAnswer(false), 2000);
          setTimeout(() => setShowScoreRise(true), 500);
          setTimeout(() => setShowScoreRise(false), 2500);
        } else {
          setShowCorrectRightAnswer(true);
          setTimeout(() => setShowCorrectRightAnswer(false), 2000);
          setTimeout(() => setShowScoreRise(true), 500);
          setTimeout(() => setShowScoreRise(false), 2500);
        }
      } else if (choice === "low" && !showInfo) {
        if (side === "left") {
          setShowWrongLeftAnswer(true);
          setTimeout(() => setShowWrongLeftAnswer(false), 2000);
        } else {
          setShowWrongRightAnswer(true);
          setTimeout(() => setShowWrongRightAnswer(false), 2000);
        }
      }
      // const selectedImage = {
      //   choice,
      //   imageLink: choice === "low" ? imgLink(currentData.img_id_affordable) : imgLink(currentData.img_id_expensive),
      // };
      // console.log(selectedImage);
      // setSelections([...selections, choice]);
      // const imageData = selectedImages;
      // imageData.push(selectedImage);
      // setSelectedImages(imageData);
      // console.log(selectedImages);
      // setCurrentIndex(currentIndex + 1);
      if (choice === "skip") {
        setShowInfo(false);
        setCurrentIndex(currentIndex + 1);
        setIsLowLeft(Math.random() < 0.5);
      } else {
        setShowInfo(true);
      }
    }
    setIsLowLeft(Math.random() < 0.5);
    if (currentIndex === shuffledData.length - 1) {
      // Call logGameData when the game is completed
      logGameData();
    }
  };

  const renderSavedProducts = () => {
    return navigate("/gameproductscart", {
      state: { selectedImages },
    });
  };

  const handleReset = () => {
    setSelections([]);
    setSelectedImages([]);
    setCurrentIndex(0);
    setGameEnded(false);
    setReset(!reset);
    setCurrentScore(0);
  };

  const renderResult = () => {
    // const highCount = selections.filter((choice) => choice === "high").length;

    let score;
    const highCount = currentScore;
    const totalCount = Math.min(10, shuffledData.length);
    if (highCount > totalCount / 2) {
      score = `${highCount} / ${totalCount}`;
    } else {
      score = `${highCount} / ${totalCount}`;
    }

    if (highCount > totalCount / 2) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            color="greenyellow"
            fontWeight={600}
            sx={{ textTransform: "uppercase", fontFamily: "CSGordon" }}
          >
            Congratulations, You Won!
          </Typography>
          <Typography
            fontWeight={500}
            fontSize={20}
            sx={{ textTransform: "uppercase", fontFamily: "CSGordon" }}
          >
            Your Score: {score}
          </Typography>
          {/* <Typography fontWeight={500} fontSize={20} sx={{textTransform: "uppercase",fontFamily: "CSGordon"}}>
            {selectedImages.map((item) => (
              <div>
                <img src={item.imageLink} alt={item.choice} />
                <p>{item.choice}</p>
              </div>  
            ))}
          </Typography> */}
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            color="red"
            fontWeight={600}
            sx={{ textTransform: "uppercase", fontFamily: "CSGordon" }}
          >
            You Lost
          </Typography>
          <Typography
            fontWeight={500}
            fontSize={20}
            sx={{ textTransform: "uppercase", fontFamily: "CSGordon" }}
          >
            Your Score: {score}
          </Typography>
          {/* <Typography fontWeight={500} fontSize={20} sx={{textTransform: "uppercase",fontFamily: "CSGordon"}}>
            {selectedImages.map((item) => (
              <div>
                <img src={item.imageLink} alt={item.choice} />
                <p>{item.choice}</p>
              </div>  
            ))}
          </Typography> */}
        </Box>
      );
    }
  };

  const renderImages = () => {
    //Game plays for 10 products
    if (currentIndex < Math.min(10, shuffledData.length)) {
      const currentData = shuffledData[currentIndex];
      const imgAffordable = imgLink(currentData.img_id_affordable);
      const imgExpensive = imgLink(currentData.img_id_expensive);
      // Randomly determine the position of "low" and "high" options
      // const isLowLeft = Math.random() < 0.5;

      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={"100vw"}
          height={"100%"}
        >
          <Box
            sx={{
              height: "20px",
              marginTop:{
                sm: "0px",
                xs: "50px",
              },
            }}
          >
            {!showInfo && (
              <Typography
                fontWeight={500}
                sx={{
                  textTransform: "uppercase",
                  // fontFamily: "CSGordon",
                  textAlign: "center",
                  mb: {
                    sm: 6,
                    xs: 1,
                  },
                  marginTop: {
                    sm: 5,
                    xs: 1,
                  },
                  fontSize: {
                    sm: 25,
                    xs: 15,
                  },
                  color: "white",
                  borderRadius: 20,
                  padding: 2,
                  backgroundImage:
                    "linear-gradient(to bottom, #d99dcd, #ab64db)",
                  boxShadow:
                    "inset 0 0 0 3px #ab64db, inset 0 0 0 4px white, 0 0 10px white",
                  padding: "10px",
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "center",
                  // backgroundImage: `url(${gameTxtBg})`, // replace YourImageURL with the URL of your image
                  // backgroundSize: 'cover', // cover the entire area of the Typography component
                  // backgroundRepeat: 'no-repeat', // prevent the image from repeating
                }}
              >
                <p
                  style={{
                    color: "white",
                    padding: "5px",
                  }}
                >
                  WHICH ONE LOOKS MORE EXPENSIVE?
                </p>
                <img
                  src={diamondImg}
                  alt="diamond"
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "inline-block",
                    marginLeft: "2px",
                    paddingBottom: "0.5px",
                    scale: "10",
                  }}
                />
              </Typography>
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"center"}
            gap={4}
            // backgroundColor="blue"
            sx={{
              flexDirection: {
                xs: "row",
                sm: "row",
              },
              width: {
                xs: "100%",
              },
              mt: {
                sm: 12,
                xs: 15,
              },
            }}
          >
            {isLowLeft ? (
              <>
                {/* Left-side box where lower price is at left */}
                <Box
                  display="flex"
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                    alignItems: {
                      xs: "center",
                      sm: "flex-start",
                    },
                    // backgroundColor: "green",
                  }}
                  // alignItems="center"
                  justifyContent="center"
                >
                  {/* Product info box  */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    // alignItems="flex-start"
                    justifyContent="center"
                    textAlign="left"
                    wordWrap="break-all"
                    overflowWrap="break-word"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "20vw",
                      },

                      alignItems: {
                        sm: "flex-start",
                        xs: "center",
                      },
                      order: {
                        sm: 1,
                        xs: 2,
                      },
                    }}
                    height="max-content"
                    marginTop={5}
                    padding={2}
                    fontFamily={"CSGorden"}
                    // backgroundColor="red"
                  >
                    {showInfo && (
                      <Box
                        sx={{
                          marginLeft: {
                            sm: 0,
                            xs: 2,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            height: "90px",
                            overflow: "auto",
                            fontSize: {
                              sm: 25,
                              xs: 10,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            BRAND: {currentData.brand_name_affordable}
                          </Typography>
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            Price:{" "}
                            <span style={{ color: "#FF76FE" }}>
                              ₹{currentData.price_affordable}
                            </span>
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="info"
                          sx={{ mt: 4 }}
                          size="medium"
                          fontFamily="CSGordon"
                          onClick={() => {
                            !productStatus &&
                              handleSaveToCart(currentData, "affordable");
                          }}
                        >
                          {!productStatus && "Save Product"}
                          {productStatus && "Product Saved"}
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Image box  */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="2x 0vw"
                    height="400px"
                    sx={{
                      height: {
                        sm: "400px",
                        xs: "100%",
                      },
                      order: {
                        sm: 2,
                        xs: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "20vw",
                        height: {
                          sm: 400,
                          xs: "50vw",
                        },
                        width: {
                          sm: "20vw",
                          xs: "50vw",
                        },
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          position: "relative",
                          // transform: `scale(${zoomScale})`, // Apply zoom level
                        }}
                        // onClick={() => handleImageClick("low", "left")}
                      >
                        <div
                          ref={imageRef}
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "relative",
                            cursor: "pointer",
                            // transform: `scale(${zoomScale}) translate(${zoomImgPosition.x}, ${zoomImgPosition.y})`, // Apply zoom level
                          }}
                          draggable="false"
                          onClick={() => handleImageClick("low", "left")}
                        >
                          {/* Base img  */}
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%) scaleY(1.2)", //change % to change base position
                              width: "130%",
                              // height: "00%",
                            }}
                          >
                            <img
                              height="auto"
                              // width={"200%"}
                              src={newBaseImg}
                              alt="Base Image"
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                          {/* Product image */}
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -80%)",
                              width: "75%",
                              // height: "75%",
                            }}
                          >
                            <TransformWrapper>
                              <TransformComponent>
                                <img
                                  src={imgAffordable}
                                  alt="Shoes Image"
                                  style={{ objectFit: "contain" }}
                                />
                              </TransformComponent>
                            </TransformWrapper>
                            {/* </div> */}
                          </div>
                        </div>
                      </Card>
                    </Box>
                  </Box>
                </Box>

                {/* Partition line  */}
                {/* <Box
                  component="img"
                  src={lineImage}
                  alt="Line"
                  sx={{
                    width: "auto",
                    height: {
                      xs: "50%",
                      sm: "100%",
                    },
                    marginBottom: {
                      xs: showInfo ? "55%":"15%",
                      sm: "0",
                    },
                    position: "absolute",
                    display: "block",
                    pointerEvents: "none",
                  }}
                /> */}

                {/* Right-side box where higher price is at right  */}
                <Box
                  display="flex"
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                    alignItems: {
                      xs: "center",
                      sm: "flex-start",
                    },
                    // backgroundColor: "green",
                  }}
                  // alignItems="center"
                  justifyContent="center"
                >
                  {/* Product image box */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="2x 0vw"
                    height="400px"
                    sx={{
                      height: {
                        sm: "400px",
                        xs: "100%",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "20vw",
                        height: {
                          sm: 400,
                          xs: "50vw",
                        },
                        width: {
                          sm: "20vw",
                          xs: "50vw",
                        },
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          position: "relative",
                        }}
                        onClick={() => handleImageClick("high", "right")}
                      >
                        {/* Base image with disk */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) scaleY(1.2)", //change % to change base position
                            width: "130%",
                            // height: "00%",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="auto"
                            // width={"200%"}
                            image={newBaseImg}
                            alt="Base Image"
                            sx={{ objectFit: "contain" }}
                          />
                        </div>
                        {/* Product image */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -80%)",
                            width: "75%",
                            // height: "75%",
                          }}
                        >
                          <TransformWrapper>
                            <TransformComponent>
                              <img
                                src={imgExpensive}
                                alt="Shoes Image"
                                style={{ objectFit: "contain" }}
                              />
                            </TransformComponent>
                          </TransformWrapper>
                          {/* </div> */}
                        </div>
                      </Card>
                    </Box>
                  </Box>

                  {/* Product info box  */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    // alignItems="flex-start"
                    justifyContent="center"
                    textAlign="left"
                    wordWrap="break-all"
                    overflowWrap="break-word"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "20vw",
                      },

                      alignItems: {
                        sm: "flex-start",
                        xs: "center",
                      },
                    }}
                    height="max-content"
                    marginTop={5}
                    padding={2}
                    fontFamily={"CSGorden"}
                  >
                    {showInfo && (
                      <Box>
                        <Box
                          sx={{
                            height: "90px",
                            overflow: "auto",
                            fontSize: {
                              sm: 25,
                              xs: 10,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            BRAND: {currentData.brand_name_expensive}
                          </Typography>
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            Price:{" "}
                            <span style={{ color: "#FF76FE" }}>
                              ₹{currentData.price_expensive}
                            </span>
                          </Typography>
                        </Box>

                        {/* <Typography sx={{textTransform: "uppercase",fontFamily: "CSGordon"}}>
                        Link:
                        <Link
                          href={currentData.product_link_expensive}
                          style={{
                            color: "blue",
                            wordBreak: "break-all",
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {currentData.product_link_expensive}
                        </Link>
                      </Typography> */}
                        <Button
                          variant="outlined"
                          color="info"
                          sx={{ mt: 4 }}
                          size="medium"
                          fontFamily="CSGordon"
                          onClick={() =>
                            handleSaveToCart(currentData, "expensive")
                          }
                        >
                          Save Product
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              <>
                {/* Left box with expensive product */}
                <Box
                  display="flex"
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                    alignItems: {
                      xs: "center",
                      sm: "flex-start",
                    },
                  }}
                  // alignItems="center"
                  justifyContent="center"
                  // width="50%"
                  // border={1}
                  // borderColor="primary"
                  // borderRadius={2}
                >
                  {/* product info box */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    // alignItems="flex-start"
                    justifyContent="center"
                    textAlign="left"
                    wordWrap="break-all"
                    overflowWrap="break-word"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "20vw",
                      },

                      alignItems: {
                        sm: "flex-start",
                        xs: "center",
                      },
                      order: {
                        sm: 1,
                        xs: 2,
                      },
                    }}
                    height="max-content"
                    marginTop={5}
                    padding={2}
                    fontFamily={"CSGorden"}
                    // backgroundColor="red"
                  >
                    {showInfo && (
                      <Box>
                        <Box
                          sx={{
                            height: "90px",
                            overflow: "auto",
                            fontSize: {
                              sm: 25,
                              xs: 10,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            BRAND: {currentData.brand_name_expensive}
                          </Typography>
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            Price:{" "}
                            <span style={{ color: "#FF76FE" }}>
                              ₹{currentData.price_expensive}
                            </span>
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="info"
                          sx={{ mt: 4 }}
                          size="medium"
                          fontFamily="CSGordon"
                          onClick={() =>
                            handleSaveToCart(currentData, "expensive")
                          }
                        >
                          Save Product
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Image Box  */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="2x 0vw"
                    height="400px"
                    sx={{
                      height: {
                        sm: "400px",
                        xs: "100%",
                      },
                      order: {
                        sm: 2,
                        xs: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "20vw",
                        height: {
                          sm: 400,
                          xs: "50vw",
                        },
                        width: {
                          sm: "20vw",
                          xs: "50vw",
                        },
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          position: "relative",
                        }}
                        onClick={() => handleImageClick("high", "left")}
                      >
                        {/* Base image */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) scaleY(1.2)", //change % to change base position
                            width: "130%",
                            // height: "00%",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="auto"
                            // width={"200%"}
                            image={newBaseImg}
                            alt="Base Image"
                            sx={{ objectFit: "contain" }}
                          />
                        </div>
                        {/* Product image */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -80%)",
                            width: "75%",
                            // height: "75%",
                          }}
                        >
                          <TransformWrapper>
                            <TransformComponent>
                              <img
                                src={imgExpensive}
                                alt="Shoes Image"
                                style={{ objectFit: "contain" }}
                              />
                            </TransformComponent>
                          </TransformWrapper>
                          {/* </div> */}
                        </div>
                      </Card>
                    </Box>
                  </Box>
                </Box>

                {/* Partition line  */}
                {/* <Box
                  component="img"
                  src={lineImage}
                  alt="Line"
                  sx={{
                    width: "auto",
                    height: {
                      xs: "50%",
                      sm: "100%",
                    },
                    marginBottom: {
                      xs: showInfo ? "55%":"15%",
                      sm: "0",
                    },
                    position: "absolute",
                    display: "block",
                    pointerEvents: "none",
                  }}
                /> */}

                {/* Right box with affordable product */}
                <Box
                  display="flex"
                  sx={{
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                    alignItems: {
                      xs: "center",
                      sm: "start",
                    },
                  }}
                  justifyContent="center"
                >
                  {/* Image Box  */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="2x 0vw"
                    height="400px"
                    sx={{
                      height: {
                        sm: "400px",
                        xs: "100%",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "20vw",
                        height: {
                          sm: 400,
                          xs: "50vw",
                        },
                        width: {
                          sm: "20vw",
                          xs: "50vw",
                        },
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          position: "relative",
                        }}
                        onClick={() => handleImageClick("low", "right")}
                      >
                        {/* Base image with disk */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%) scaleY(1.2)", //change % to change base position
                            width: "130%",
                            // height: "00%",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="auto"
                            // width={"200%"}
                            image={newBaseImg}
                            alt="Base Image"
                            sx={{ objectFit: "cover" }}
                          />
                        </div>

                        {/* Product image */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -80%)",
                            width: "75%",
                            // height: "75%",
                          }}
                        >
                          <TransformWrapper>
                            <TransformComponent>
                              <img
                                src={imgAffordable}
                                alt="Shoes Image"
                                style={{ objectFit: "contain" }}
                              />
                            </TransformComponent>
                          </TransformWrapper>
                          {/* </div> */}
                        </div>
                      </Card>
                    </Box>
                  </Box>

                  {/* Product info box  */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    // alignItems="flex-start"
                    justifyContent="center"
                    textAlign="left"
                    wordWrap="break-all"
                    overflowWrap="break-word"
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "20vw",
                      },

                      alignItems: {
                        sm: "flex-start",
                        xs: "center",
                      },
                    }}
                    height="max-content"
                    marginTop={5}
                    padding={2}
                    fontFamily={"CSGorden"}
                    // backgroundColor="red"
                  >
                    {showInfo && (
                      <Box>
                        <Box
                          sx={{
                            height: "90px",
                            overflow: "auto",
                            fontSize: {
                              sm: 25,
                              xs: 10,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            BRAND: {currentData.brand_name_affordable}
                          </Typography>
                          <Typography
                            sx={{
                              textTransform: "uppercase",
                              fontFamily: "CSGordon",
                            }}
                          >
                            Price:{" "}
                            <span style={{ color: "#FF76FE" }}>
                              ₹{currentData.price_affordable}
                            </span>
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="info"
                          sx={{ mt: 4 }}
                          size="medium"
                          fontFamily="CSGordon"
                          onClick={() =>
                            handleSaveToCart(currentData, "affordable")
                          }
                        >
                          Save Product
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>

          <Button
            variant="outlined"
            color="info"
            sx={{
              mt: {
                sm: 4,
                xs: 17,
              },
              mb: 4,
              width: "240px",
            }}
            size="medium"
            onClick={() => handleImageClick("skip")}
          >
            {!showInfo && "Skip"}
            {showInfo && "Next"}
          </Button>

          {/* Correct Left  */}
          <Typography
            sx={{
              textTransform: "uppercase",
              fontFamily: "CSGordon",
              position: "fixed",
              fontWeight: "bold",
              fontSize: "1.5rem",
              bottom: {
                sm: showCorrectLeftAnswer ? "75%" : "75%",
                xs: showCorrectLeftAnswer ? "50%" : "50%",
              },
              left: {
                sm: "38%",
                xs: "50%",
              },
              color: "green",
              transform: "translate(-40%, -40%)",
              opacity: showCorrectLeftAnswer ? 1 : 0,
              transition: "all 1s ease",
            }}
          >
            Correct Answer
          </Typography>
          {/* Correct right  */}
          <Typography
            sx={{
              textTransform: "uppercase",
              fontFamily: "CSGordon",
              position: "fixed",
              fontWeight: "bold",
              fontSize: "1.5rem",
              bottom: showCorrectRightAnswer ? "75%" : "75%",
              left: "62%",
              color: "green",
              transform: "translate(-50%, -50%)",
              opacity: showCorrectRightAnswer ? 1 : 0,
              transition: "all 1s ease",
            }}
          >
            Correct Answer
          </Typography>
          {/* Wrong Left  */}
          <Typography
            sx={{
              textTransform: "uppercase",
              fontFamily: "CSGordon",
              position: "fixed",
              fontWeight: "bold",
              fontSize: "1.5rem",
              bottom: showWrongLeftAnswer ? "75%" : "75%",
              left: "38%",
              color: "red",
              transform: "translate(-50%, -50%)",
              opacity: showWrongLeftAnswer ? 1 : 0,
              transition: "all 1s ease",
            }}
          >
            Wrong Answer
          </Typography>
          {/* Wrong Right  */}
          <Typography
            sx={{
              textTransform: "uppercase",
              fontFamily: "CSGordon",
              position: "fixed",
              fontWeight: "bold",
              fontSize: "1.5rem",
              bottom: showWrongRightAnswer ? "75%" : "75%",
              left: "62%",
              color: "red",
              transform: "translate(-50%, -50%)",
              opacity: showWrongRightAnswer ? 1 : 0,
              transition: "all 1s ease",
            }}
          >
            Wrong Answer
          </Typography>

          {/* +10 Marks text animation  */}
          <Typography
            sx={{
              textTransform: "uppercase",
              fontFamily: "CSGordon",
              position: "fixed",
              fontWeight: "bold",
              fontSize: "1.5rem",
              bottom: showScoreRise ? "65%" : "60%",
              left: "50%",
              color: "#FF76FE",
              transform: "translate(-50%, -50%)",
              opacity: showScoreRise ? 1 : 0,
              transition: "all 1s ease",
            }}
          >
            +10 Points
          </Typography>
        </Box>
      );
    } else {
      return (
        //results of game
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {renderResult()}
          <Button
            variant="outlined"
            color="info"
            onClick={renderSavedProducts}
            size="large"
            fontFamily="CSGordon"
          >
            Saved Products
            <TiShoppingCart size={25} style={{ margin: " 0 3px 0 3px" }} />
          </Button>

          <Button
            variant="outlined"
            color="info"
            onClick={handleReset}
            size="large"
            fontFamily="CSGordon"
          >
            Play Again
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              mt: 12,
            }}
          >
            <IconButton
              onClick={() => {
                navigate("/home");
              }}
            >
              <HomeIcon sx={{ fontSize: "48px", color: "white" }} />
            </IconButton>
          </Box>
        </Box>
      );
    }
  };

  return (
    // <div className="h-[93vh] flex flex-col item-center justify-center, ">
    //   {renderImages()}
    // </div>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {renderImages()}
    </Box>
  );
}

export default Game;
