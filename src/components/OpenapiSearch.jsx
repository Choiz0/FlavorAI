import React, { useState, useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "./RecipeCard";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const OpenapiSearch = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const uploadSingleImage = async (imageFile) => {
    setUploading(true);
    const recipeId = uuidv4();
    const imageRef = storageRef(
      getStorage(),
      `recipes/${currentUser.uid}/${recipeId}/${imageFile.name}`
    );
    try {
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadUrl);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadSingleImage(file);
    }
  };

  const fetchRecipes = useCallback(async () => {
    try {
      const messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and suggest the image menu recipes: You are a chef designed to output JSON format without whitespace between keys and values.
  Your role is to find recipes with the following specifics:  -Ingredients:  -Cuisine:  -Difficulty:  -Cooking time:  -Additional notes:
  Please return fields for title, ingredients[arraytype], cookingtime, difficulty, cuisine, and feature (max length: 20). You must search 2 to 4 recipes.`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "low" },
            },
          ],
        },
      ];

      console.log("imageUrl:", imageUrl);

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      const recipesJson = JSON.parse(response.choices[0].message.content);
      const recipesArray = recipesJson.recipes;

      console.log(recipesArray);
      if (recipesArray === undefined) {
        console.log(recipesJson);
        return recipesJson.recipes;
      }
      return recipesArray;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  }, [imageUrl]);

  const {
    mutate: searchRecipes,
    data,
    error,
    isLoading,
  } = useMutation(fetchRecipes);
  const removeImage = () => setImageUrl("");

  return (
    <div
      className={`${
        data?.length > 0 ? "md:-mt-20 " : "md:mt-0 mt-20 "
      } w-full justify-center items-center flex-col   bg-slate-50 h-full mx-auto container`}
    >
      <div
        className={`w-[80%] md:w-1/2 md:mb-10 relative md:grid grid-cols-1 md:grid-cols-3 border border-gray-100 bg-white rounded-md shadow-lg  mx-auto ${
          data?.length > 0 ? "hidden" : ""
        }`}
      >
        <div className="rounded-l-lg p-4 bg-white flex flex-col justify-center items-center border-0 border-r border-gray-300">
          <label
            className="cursor-pointer hover:opacity-80 inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            htmlFor="restaurantImage"
          >
            Select image
            <input
              id="restaurantImage"
              className="text-sm cursor-pointer w-36 hidden"
              type="file"
              onChange={onFileChange}
            />
          </label>
          <button
            className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            onClick={removeImage}
          >
            Remove image
          </button>
          <div className="mt-8 flex justify-end ">
            <button
              className="inline-flex items-center shadow-md px-6 py-2 bg-pink text-white border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={searchRecipes}
            >
              Search
            </button>
          </div>
        </div>
        <div className="relative order-first md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover">
          {uploading ? <Loading /> : null}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="md:w-[300px] md:h-[200px] w-200px] h-[100px] object-cover rounded-lg"
            />
          )}
          {!imageUrl && (
            <span className="text-gray-400 opacity-75">
              <svg
                className="w-14 h-14"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="0.7"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="flex md:flex-row flex-col flex-wrap md:w-[80vw]   items-center">
        {data && data?.length > 0 && (
          <button className="bg-dark text-white md:w-[100px] w-[70px]  rounded-lg onClick={handleSave} md:text-lg text-md  md:hidden mt-10 ">
            <a href="/openAI">Back</a>
          </button>
        )}
        {data &&
          data?.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              isMyRecipe={false}
              imageSearch={true}
            />
          ))}
      </div>
      {isLoading && <Loading />}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default OpenapiSearch;
