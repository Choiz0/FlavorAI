import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import defaultImg from "../assets/default.jpg";
import RecipeModal from "./RecipeModal";

const RecipeCard = ({ recipe, isMyRecipe, imageSearchList }) => {
  const navigate = useNavigate();
  const [showModal, setshowModal] = useState(false);

  const handleClick = () => {
    if (isMyRecipe) {
      navigate(`/myrecipe/${recipe.recipeId}`);
    } else {
      setshowModal(true);
    }
  };
  console.log(imageSearchList);
  return (
    <>
      {showModal && (
        <RecipeModal
          setshowModal={setshowModal}
          showModal={showModal}
          title={recipe?.title}
          defaultImg={defaultImg}
        />
      )}

      <div
        onClick={handleClick}
        className="flex flex-col h-[400px] mb-4 w-[80%] lg:h-[600px] lg:w-[400px] md:w-[50%] overflow-hidden md:mr-12 md:mb-12 rounded-lg shadow-lg cursor-pointer bg-white hover:scale-105 hover:transition-all hover: ease-in-out    "
      >
        <img
          src={
            isMyRecipe
              ? recipe?.images && recipe.images.length > 0
                ? recipe.images[0]
                : defaultImg
              : imageSearchList || defaultImg
          }
          alt={`Image of ${recipe?.title || recipe?.recipe_title}`}
          className="object-cover w-full md:max-h-40 rounded-lg max-h-32"
        />

        <p className="md:text-2xl text-lg font-medium text-gray-800 dark:text-white md:mb-8 text-center bg-slate-100 py-2">
          {recipe?.title}
        </p>
        <div className="px-4">
          <div className="mt-2 md:text-xl flex text-sm">
            <strong className="md:w-40 w-28">Ingredients</strong>
            <div className="flex flex-wrap text-gray-700  md:text-lg justify-start ">
              {recipe?.ingredients?.slice(0, 4).map((ingredient, index) => (
                <span
                  key={index}
                  className="m-1 py-1 md:px-4 px-2 text-gray-600 bg-green-100 rounded-2xl text-xs md:text-lg"
                >
                  {isMyRecipe
                    ? ingredient.Name || ingredient[0]
                    : ingredient.Name || ingredient}
                </span>
              ))}
            </div>
          </div>
          <div className="my-2 md:text-xl flex text-sm ">
            <strong className="md:w-40 w-28">Cooking Time </strong>
            <p className="m-1 py-1 md:px-4 px-2 text-gray-600 bg-green-100 rounded-2xl text-xs md:text-lg">
              {recipe?.cookingTime
                ? recipe.cookingTime.toUpperCase()
                : recipe?.time}
            </p>
          </div>
          <div className="my-2 md:text-xl flex text-sm">
            <strong className="md:w-40 w-28">Difficulty Level</strong>
            <p className="mx-2 py-1 md:px-4 px-2 text-gray-600 bg-blue-100 rounded-2xl text-xs md:text-lg">
              {recipe?.difficulty
                ? recipe.difficulty.toUpperCase()
                : recipe?.difficulty}
            </p>
          </div>
          <div className="my-2 md:text-xl flex text-sm ">
            <strong className="md:w-40 w-28">Cuisine</strong>
            <p className="mx-2 py-1 md:px-4 px-2 text-gray-600 bg-blue-100 rounded-2xl text-xs md:text-lg">
              {recipe?.cuisine ? recipe.cuisine.toUpperCase() : recipe?.cuisine}
            </p>
          </div>
          <div className=" my-2 md:text-xl flex text-sm ">
            <strong className="md:w-40 w-28">Feature</strong>
            <p className="mx-2 py-1 px-4 text-gray-600 max-w-80">
              {(recipe?.comment || recipe?.description).slice(0, 50)}...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default RecipeCard;
