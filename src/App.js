import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider } from "./common/context/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Bags from "./pages/Bags";
import Clothes from "./pages/Clothes";
import Ring from "./pages/Ring";
import Shoes from "./pages/Shoes";
import Watch from "./pages/Watch";
import { DbProvider } from "./common/context/DbContext";
import { AzDbProvider } from "./common/context/AzureDbContext";
import MarketPlace from "./pages/MarketPlace";
import MainHome from "./pages/MainHome";
import Avatar from "./pages/Avatar";
import GameProductsCart from "./pages/GameProductsCart";

const theme = createTheme({
  typography: {
    color: "white",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AzDbProvider>
            <DbProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<MainHome />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/bags" element={<Bags />} />
                  <Route path="/clothes" element={<Clothes />} />
                  <Route path="/ring" element={<Ring />} />
                  <Route path="/shoes" element={<Shoes />} />
                  <Route path="/watch" element={<Watch />} />
                  <Route path="/marketplace" element={<MarketPlace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/avatar" element={<Avatar />} />
                  <Route path="/gameproductscart" element={<GameProductsCart />} />
                </Routes>
              </BrowserRouter>
            </DbProvider>
          </AzDbProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
