import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const API_KEY_IMG = import.meta.env.VITE_CUSTOM_SEARCH_API;
function RecipeModal({ setshowModal, showModal, title, defaultImg }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const imageFetch = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY_IMG}&cx=05d57925008784ee9&q=${title}&searchType=image&num=5`
      );

      if (response.status === 200) {
        const imageLinks = response.data.items
          ? response.data.items.map((item) => item.link)
          : [];

        return imageLinks;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const fetchRecipe = async () => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `A provide detail recipe for ${title}. the recipe have to include the following details and portion size must Kilogram or grams the recipe. : 
          {
              "Title": "Kimchi Fried Rice",
              "difficutly": "Easy",
              "time": "30 minutes",
              "cuisine": "Korean",
              "servings": "2",
              "calories": "300",
              "carbohydrates": "50g",
              "fat": "10g",
              "protein": "15g",
              "Description": "Kimchi fried rice is a popular Korean dish made with kimchi, rice, and other ingredients. It is a flavorful and satisfying meal that can be easily customized to suit your taste preferences. This recipe is a simple and delicious version of kimchi fried rice that you can make at home.",
              "Ingredients": [
                 
  {Name: 'Cooked rice', Amount: '2 cups (preferably cold or day-old rice works best)'},
  
  {Name: 'Kimchi', Amount: '1 cup (chopped)'},
  
  {Name: 'Kimchi juice (optional)', Amount: '1/4 cup (for extra flavor)'},
   
  {Name: 'Pork belly or bacon (optional)', Amount: '4 ounces (diced)'},
   
  {Name: 'Vegetable oil', Amount: '2 tablespoons'},
   
  {Name: 'Onion', Amount: '1/2 (chopped)'},
   
  {Name: 'Garlic', Amount: '2 cloves (minced)'},
   
  {Name: 'Green onions', Amount: '2 (sliced)'},
   
  {Name: 'Soy sauce', Amount: '2 tablespoons (adjust to taste)'}
  ,
  {Name: 'Sesame oil', Amount: '1 teaspoon'},
              ],
              "Instructions": [
                 
                  {StepNumber: 1, DesTitle:'Prepare Ingredients',  Description: 'Chop the kimchi into small pi…on, mince the garlic, and slice the green onions.'}
                 ,
                  {StepNumber: 2, DesTitle:'Cook Pork Belly',  Description: 'Heat a large skillet or wok over medium heat. Add the diced pork belly or bacon and cook until browned and crispy, about 5-7 minutes. Remove from the skillet and set aside.'}
                  ,
                  {StepNumber: 3, DesTitle:'Saute Vegetables',  Description: 'In the same skillet, add the vegetable oil. Add the chopped onion and cook until softened, about 3-4 minutes. Add the minced garlic and cook for another 1-2 minutes until fragrant.'}
                  ,
                  {StepNumber: 4, DesTitle:'Add Kimchi and Rice',  Description: 'Add the chopped kimchi and kimchi juice (if using) to the skillet. Cook for 2-3 minutes until the kimchi is heated through. Add the cooked rice and stir to combine with the kimchi and vegetables.'}
                  ,
                  {StepNumber: 5, DesTitle:'Season the Fried Rice',  Description: 'Add the soy sauce and sesame oil to the skillet. Stir well to combine and coat the rice evenly with the seasonings. Cook for an additional 2-3 minutes to allow the flavors to meld together.'}
                  ,
                  {StepNumber: 6, DesTitle:'Serve',  Description: 'Remove the skillet from the heat. Taste the fried rice and adjust the seasoning if needed. Serve the kimchi fried rice hot, garnished with sliced green onions.'}
              ],
                
               
              "Tips": [
                "Rice: Using cold rice prevents the fried rice from becoming soggy. Freshly cooked rice can clump together and become mushy when stir-fried.",
                "Flavor Adjustments: Depending on your taste preference and the flavor intensity of your kimchi, adjust the amount of soy sauce and sesame oil.",
                "Vegetarian Option: Omit the pork belly and add more vegetables like carrots or zucchini for a vegetarian version."
              ]
            },
    

  
                     Think step by step andfor webpage display, make sure it shuold be  strict JSON format and must do not include any text or symbol  such as 'js' or comma or  outside of array object .
                    you must not contain any backticks or period, as these can cause parsing errors.
                     it must be json format .
  
               `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text(); // Assume JSON format text

      const parsedRecipe = JSON.parse(text);
      console.log(parsedRecipe);

      return parsedRecipe;
    } catch (error) {
      toast.error("Failed to fetch recipe details.");
      console.error("Error fetching recipe:", error);
    }
  };
  const {
    data: recipe,
    isLoading: isRecipeLoading,
    error: recipeError,
  } = useQuery(["recipeDetail", title], fetchRecipe, {
    enabled: !!title,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 60, // 60 minutes
    onError: (err) => {
      toast.error(`Error: ${err.message}`);
    },
  });
  const {
    data: images,
    isLoading: isImageLoading,
    error: isImageError,
  } = useQuery(["recipeImages", title], imageFetch, {
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 60, // 60 minutes
  });

  const handleSave = async () => {
    try {
      // 로그로 데이터 확인
      console.log("Saving recipe:", recipe);
      console.log("Images:", images);
      if (!recipe) {
        throw new Error("No recipe data available to save.");
      }

      // Ensure there are images to save

      const safeImages = images && images.length > 0 ? images : [];
      const recipeId = uuidv4();
      const docData = {
        title: recipe.Title,
        description: recipe.Description || recipe.description,
        ingredients: recipe.Ingredients || recipe.ingredients,
        instructions: recipe.Instructions || recipe.instructions,
        recipe_tips: recipe.Tips || recipe.tips,
        saveTime: new Date().toISOString(),
        recipeId: recipeId,
        difficulty: recipe.Difficulty || recipe.difficulty,
        servings: recipe.Servings || recipe.servings,
        calories: recipe.Calories || recipe.calories,
        carbohydrates: recipe.Carbohydrates || recipe.carbohydrates,
        fat: recipe.Fat || recipe.fat,
        protein: recipe.Protein || recipe.protein,
        time: recipe.Time || recipe.time,
        cuisine: recipe.Cuisine || recipe.cuisine,
        images: safeImages,
      };
      await setDoc(
        doc(db, "users", currentUser.uid, "recipes", recipeId),
        docData
      );

      toast.success("Recipe saved successfully");
      navigate("/myrecipe");
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast.error("Failed to save recipe: " + error.message);
    }
  };
  if (recipeError || isImageError)
    return toast.error(
      `Failed to fetch recipe details: ${
        recipeError.message || isImageError.message
      }`
    );

  return (
    <div className="font-sans bg-gray-100 flex items-center justify-center h-screen  ">
      <ToastContainer />

      {/* Privacy Policy Modal */}
      {showModal && (
        <div
          className="fixed z-1  inset-0 flex items-center justify-center md:mt-60 mt-52"
          onClick={() => setshowModal(false)}
        >
          <div className="absolute bg-gray-500 opacity-75"></div>

          <div
            className="relative bg-white rounded-lg overflow-hidden  shadow-xl w-[90vw] max-w-[90ww] m-4 justify-center  "
            onClick={(e) => e.stopPropagation()}
          >
            <div className=" md:flex items-center md:h-[200px] md:justify-around bg-slate-50  ">
              <h3 className=" leading-6 text-gray-900 md:text-5xl  text-xl font-bold md:text-center justify-center pt-2">
                {title}
              </h3>

              <div className="flex overflow-scroll  md:overflow-hidden ">
                {images ? (
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Search result
                  "
                      className="md:h-[300px] md:w-[300px] object-cover w-40 h-40"
                    />
                  ))
                ) : (
                  <img
                    src={defaultImg}
                    alt={title}
                    className="object-cover h-[300px]"
                  />
                )}
              </div>
            </div>
            <div className="px-6 py-4 flex bg-slate-50 justify-between items-center md:pt-14 ">
              <div>
                <span className="md:text-2xl text-lg">Recipe Details</span>
              </div>
              <div className="flex gap-2 ">
                <button
                  className="bg-pink text-white md:w-[100px] w-[70px] rounded-lg  md:text-lg text-md"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-dark text-white md:w-[100px] w-[30px] rounded-lg  md:text-lg text-md"
                  onClick={() => navigate(-1)}
                >
                  X
                </button>
              </div>
            </div>

            <div
              className=" p-6 overflow-y-auto"
              style={{
                maxHeight: "70vh",
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.375rem",
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              {(isRecipeLoading || isImageLoading) && (
                <div className=" flex justify-center items-center">
                  <h1 className="text-xl md:text-3xl font-bold text-pink flex items-center">
                    L
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="animate-spin"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"></path>
                    </svg>{" "}
                    ading . . .
                  </h1>
                </div>
              )}

              <div className="bg-gray-100 md:p-6 ">
                <h1 className="md:text-3xl text-lg font-bold mb-4 ">
                  {recipe?.Title}
                </h1>

                <div className="mb-6">
                  <p className="text-gray-700 text-lg">{recipe?.Description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6  max-w[350px]">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Recipe Info</h2>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Difficulty:</span>
                        <span className="py-1 px-3 text-gray-600 bg-green-200 rounded-full">
                          {recipe?.Difficulty || recipe?.difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Time:</span>
                        <span className="py-1 px-3 text-gray-600 bg-blue-200 rounded-full">
                          {recipe?.Time || recipe?.time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Cuisine:</span>
                        <span className="py-1 px-3 text-gray-600 bg-slate-200 rounded-full">
                          {recipe?.Cuisine || recipe?.cuisine}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Servings:</span>
                        <span className="py-1 px-3 text-gray-600 bg-slate-200 rounded-full">
                          {recipe?.Servings || recipe?.servings}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow max-w[350px]">
                    <h2 className="text-xl font-semibold mb-2">
                      Nutritional Info
                    </h2>
                    <table className="w-full text-sm text-left text-gray-500">
                      <tbody>
                        <tr className="bg-blue-50">
                          <td className="px-4 py-2 font-medium">Calories</td>
                          <td className="px-4 py-2">
                            {recipe?.Calories || recipe?.calories}
                          </td>
                        </tr>
                        <tr className="bg-blue-100">
                          <td className="px-4 py-2 font-medium">
                            Carbohydrates
                          </td>
                          <td className="px-4 py-2">
                            {recipe?.Carbohydrates || recipe?.carbohydrates}
                          </td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td className="px-4 py-2 font-medium">Fat</td>
                          <td className="px-4 py-2">
                            {recipe?.Fat || recipe?.fat}
                          </td>
                        </tr>
                        <tr className="bg-blue-100">
                          <td className="px-4 py-2 font-medium">Protein</td>
                          <td className="px-4 py-2">
                            {recipe?.Protein || recipe?.protein}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start my-2">
                <div className="md:min-w-[50%] ">
                  <p>
                    <strong className="md:text-3xl">Ingredients</strong>
                  </p>
                  <ul>
                    {recipe?.Ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="md:text-2xl flex items-center py-2"
                      >
                        <svg
                          className="h-6 w-6 text-dark mx-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {ingredient?.Name}: {ingredient?.Amount}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="md:text-3xl">Tips</strong>

                  <ul>
                    {recipe?.Tips?.map((tip, i) => (
                      <li key={i} className="md:text-2xl py-2">
                        {i + 1}. {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-center">
                <strong className="md:text-3xl text-center">
                  Instructions
                </strong>
              </div>
              <section className="">
                <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-14">
                  <div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
                    <div className="w-full max-w-3xl mx-auto">
                      {/* Vertical Timeline #1 */}
                      <div className="-my-6">
                        {/* Check if instructions exist and map over them */}
                        {recipe?.Instructions && (
                          <ol className="relative">
                            {recipe.Instructions.map((instruction, index) => (
                              <li key={index} className="group ">
                                {/* Vertical line */}
                                <div className="absolute left-0 sm:left-12 top-0 h-full w-0.5 bg-slate-300 "></div>
                                {/* Time/Step Number and Circle Marker */}
                                <div className="flex flex-col sm:flex-row items-center  ">
                                  <div className="sm:absolute left-1  sm:translate-x-[-50%] inline-flex items-center justify-center text-md  font-bold uppercase w-20 h-8 mb-4 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">
                                    Step {instruction.StepNumber || index + 1}
                                  </div>
                                  <div className="absolute left-0 sm:left-12 w-3 h-3 bg-indigo-600 rounded-full z-10 translate-x-[-50%] translate-y-8"></div>
                                </div>
                                {/* Content */}
                                <div className="mb-2 pl-8 sm:pl-32 md:md:text-2xl py-2 ">
                                  <h4 className="font-bold">
                                    {instruction.DesTitle}
                                  </h4>
                                  <p>{instruction.Description}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeModal;
