import React from "react";
import Navbar from "../components/Navbar";
import RecipeSearch from "../components/RecipeSearch";
import { auth } from "../firebase";
import OpenapiSearch from "../components/OpenapiSearch";

const Homepage = () => {
  console.log(auth.currentUser);

  return (
    <>
      <RecipeSearch />
    </>
  );
};

export default Homepage;
