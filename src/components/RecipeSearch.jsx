import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "react-query";
import Button from "./Button";
import RecipeCard from "./RecipeCard";
import axios from "axios";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const API_KEY_IMG = import.meta.env.VITE_CUSTOM_SEARCH_API;

const RecipeSearch = () => {
  const navigate = useNavigate();

  const [imageData, setImageData] = useState({});
  const ref = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [time, setTime] = useState("");

  const [anything, setAnything] = useState("");

  const handleCuisineChange = (e) => {
    const { value, checked } = e.target;

    setCuisine((prevCuisines) =>
      checked
        ? [...prevCuisines, value]
        : prevCuisines.filter((cuisine) => cuisine !== value)
    );
  };

  //   const fetchRecipes = useCallback(
  //     async (ingredients, cuisine, difficulty, time, anything) => {
  //       const genAI = new GoogleGenerativeAI(API_KEY);
  //       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  //       const prompt = `Please provide a list of recipes that meet the following criteria:
  // - Key ingredients: ${ingredients}
  // - Cuisine type: ${cuisine}
  // - Difficulty level: ${difficulty}
  // - Cooking time: ${time}
  // - Special requirements or notes: ${anything}

  // Each recipe should include:
  //         Recipe Title: [Name of the Dish]
  //        Ingredients: [List the main key ingredients used]
  //         Cooking Time: [Specify the total time required to prepare and cook the dish]
  //         Difficulty Level: [Indicate whether the dish is easy, medium, or hard to prepare]
  //         cuisine: [cusine type]
  //         Comment: [Any additional notes or tips about the recipe]
  //         result example:

  //         [
  //         {
  //             "id": "recipe-1",
  //             "title": "Kimchi Fried Rice",
  //             "image": "link to image",
  //             "ingredients": ["Kimchi", "onion", "tuna", "rice"],
  //             "cookingTime": "15 min",
  //             "difficulty": "Easy",
  //             "cuisine": "Korean",
  //             "comment": "A quick and easy weeknight meal that uses up leftover kimchi."
  //           },
  //           {
  //             "id": "recipe-2",
  //     "title": "Kimchi Fried Rice",
  //     "image": "link to image",
  //     "ingredients": ["Kimchi", "onion", "tuna", "rice"],
  //     "cookingTime": "15 minutes",
  //     "difficulty": "Easy",
  //     "cuisine": "Korean",
  //     "comment": "A quick and easy weeknight meal that uses up leftover kimchi."
  //           }]

  //         You must find and get results of recipe menus including key ingredients: ${ingredients} and  ${cuisine} cuisions,  and difficulty: ${difficulty} and time: ${time}.
  //         Your job is find which include recipes that specifically mention or are related to '${anything}'. This could be a specific cooking style, ingredient, dietary restriction, or any particular theme or preference mentioned in the recipe details.
  //         Think step by step and for webpage display, make sure it shuold be in a array object strict JSON format and must do not include any text or symbol  such as 'js' or comma or  outside of array object .
  //         You must not contain any backticks or period, as these can cause parsing errors.

  //         `;

  //       const result = await model.generateContent(prompt);
  //       const response = await result.response;
  //       const text = response.text(); // 이 부분에서 반환되는 데이터의 형태를 확인

  //       const removeText = text.replace("`", "");

  //       const parsedRecipes = JSON.parse(removeText);

  //       return parsedRecipes;
  //     },
  //     [API_KEY, ingredients, cuisine, difficulty, time, anything]
  //   );
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const fetchRecipes = useCallback(async () => {
    const messages = [
      {
        role: "system",
        content: `You are a chef designed to output JSON format without whitespace between keys and values your role is find recipes with the following specifics:-Ingredients:${ingredients}-Cuisine:${cuisine}-Difficulty:${difficulty}- Cooking time: ${time}- Additional notes: ${anything}- image: [search menu real image link] Please return fields for title, ingredients[arraytype], cooking time, difficulty, cuisine, image and feature(maxlength:20).you must search 2 to 4 recipes," `,
      },
    ];
    console.log(messages);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        response_format: { type: "json_object" },
        messages,
        temperature: 0.5,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log(completion);
      const recipesJson = JSON.parse(completion.choices[0].message.content);
      const recipesArray = recipesJson.recipes;

      console.log(recipesArray);

      return recipesArray;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return null;
    }
  }, [ingredients, cuisine, difficulty, time, anything]);

  const queryKeys = useMemo(
    () => [
      "recipes",
      ingredients,
      cuisine.join(","),
      difficulty,
      time,
      anything,
    ],
    [ingredients, cuisine, difficulty, time, anything]
  );

  const fetchImagesForRecipes = async (recipes) => {
    const imagePromises = recipes.map(async (recipe) => {
      const address = `https://www.googleapis.com/customsearch/v1?key=${API_KEY_IMG}&cx=05d57925008784ee9&q=${recipe.title}&num=1`;
      console.log("recipe title", recipe.title);
      try {
        const response = await axios.get(address);
        return {
          [recipe.title]: response.data.items[0]?.pagemap?.cse_image[0]?.src,
        };
      } catch (error) {
        console.error("Failed to fetch image for", recipe.title, error);
        return { [recipe.id]: "../assets/default.jpg" }; // Set a default image path
      }
    });

    Promise.all(imagePromises).then((results) => {
      setImageData((prev) => ({ ...prev, ...Object.assign({}, ...results) }));
      console.log(imageData);
    });
  };
  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery(
    queryKeys,
    () => fetchRecipes(ingredients, cuisine, difficulty, time, anything),
    {
      enabled: fetchTrigger,
      onSuccess: (data) => {
        fetchImagesForRecipes(data);
        setFetchTrigger(false);
      },
      onError: () => {
        setFetchTrigger(false);
      },
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 60,
    }
  );
  const handleRecipe = (e) => {
    e.preventDefault();
    console.log("Ingredients at submit:", ingredients);

    setFetchTrigger(true);
  };
  console.log(recipes);

  return (
    <div
      className={`${
        recipes?.length > 0 ? " md:justify-start" : " justify-center"
      } w-full items-center flex md:-mt-44 bg-slate-50`}
    >
      <div
        className={`  lg:pt-10 flex-col md:flex-row md:space-x-4 items-start   ${
          recipes?.length > 0
            ? "md:bg-red-50 h-full lg:w-96 flex   md:w-full justify-start"
            : "flex justify-center w-full md:items-start items-center h-full "
        }`}
      >
        <ToastContainer />
        <div
          className={`flex flex-col transition-all md:p-8 p-4 rounded-lg my-4  ${
            recipes?.length > 0
              ? "md:flex-start md:justify-start md:border-r-2 md:border-zinc-200 md:h-screen mx-auto  "
              : "bg-white shadow-lg justify-center md:w-[40%] mt-24 sm:mt-48 lg:mt-10 w-[80%]  "
          }`}
        >
          <h1 className="text-lg font-bold text-center">
            Ingredients based Recipe
          </h1>
          <form
            onSubmit={handleRecipe}
            className={`md:block ${
              recipes?.length > 0 || isLoading ? "hidden" : ""
            }`}
          >
            <div className="md:flex items-center my-8 ">
              <label className="mr-4  sm:text-2xl text-md sm:w-32 ">
                {" "}
                Ingredients
              </label>
              <input
                ref={ref}
                className=" rounded-lg flex-1 appearance-none border border-lightgray w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 fo focus:ring-pink focus:border-transparent"
                type="text"
                placeholder="Enter ingredients to search recipe"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <label className="mr-4 sm:text-2xl text-md md:w-32 w-20">
                Cuisine
              </label>
              <div className="flex   justify-end sm:items-center sm:space-y-0 space-y-2 flex-col w-30 pl-4">
                <div className="flex items-start space-x-2 md:items-center">
                  <input
                    type="checkbox"
                    name="korean"
                    value="korean"
                    onChange={handleCuisineChange}
                    className="appearance-none bg-white bg-check h-6 w-6 border border-gray-300 rounded-md checked:bg-pink checked:border-transparent focus:outline-none"
                  />
                  <span className="w-24 text-right font-normal pl-2 md:text-xl text-md text-gray-700 md:text-left">
                    Korean
                  </span>
                </div>

                <div className="flex items-start space-x-2 md:items-center">
                  <input
                    type="checkbox"
                    name="Japanese"
                    value="Japanese"
                    onChange={handleCuisineChange}
                    className="appearance-none bg-white bg-check h-6 w-6 border border-gray-300 rounded-md checked:bg-pink checked:border-transparent focus:outline-none"
                  />
                  <span className="w-24 text-right font-normal pl-2 md:text-xl text-md text-gray-700 md:text-left">
                    Japanese
                  </span>
                </div>
                <div className="flex items-start space-x-2 md:items-center">
                  <input
                    type="checkbox"
                    name="chinese"
                    value="chinese"
                    onChange={handleCuisineChange}
                    className="appearance-none bg-white bg-check h-6 w-6 border border-gray-300 rounded-md checked:bg-pink checked:border-transparent focus:outline-none"
                  />
                  <span className="w-24 text-right font-normal pl-2 md:text-xl text-md text-gray-700 md:text-left">
                    Chinese
                  </span>
                </div>
                <div className="flex items-start space-x-2 md:items-center">
                  <input
                    type="checkbox"
                    name="western"
                    value="western"
                    onChange={handleCuisineChange}
                    className="appearance-none bg-white bg-check h-6 w-6 border border-gray-300 rounded-md checked:bg-pink checked:border-transparent focus:outline-none"
                  />
                  <span className="w-24 text-right font-normal pl-2 md:text-xl text-md text-gray-700 md:text-left">
                    Western
                  </span>
                </div>
              </div>
            </div>

            <div className="my-4">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full mt-4 md:text-xl border-dark rounded border  md:text-left  py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-pink focus:border-transparent focus:ring-2"
              >
                <option value="">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full mt-4 md:text-xl   border-dark rounded border focus:ring-2 focus:ring-pink py-2 px-4 focus:border-transparent"
            >
              <option value="">Cooking Time</option>
              <option value="Under 15min">Under 15min</option>
              <option value="Under than 1hr">Under than 1hr</option>
              <option value="More than 1hr">More than 1hr</option>
            </select>
            <div className="flex my-8 flex-col gap-4">
              <label className="mr-4 md:text-xl">
                Add details or search by menu name:
              </label>
              <input
                className="rounded-lg border-dark flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-pink focus:border-transparent"
                type="text"
                placeholder="Specify recipe details or menu name"
                value={anything}
                onChange={(e) => setAnything(e.target.value)}
              />
            </div>

            <div className="mt-8 flex justify-end ">
              <button className="bg-pink lg:w-[100px] w-[60px] p-2 rounded-md text-sm lg:text-xl text-white">
                Search
              </button>
            </div>
          </form>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center w-screen h-[100vh] text-gray-900 ">
            <div>
              <h1 className="text-xl lg:text-5xl  flex items-center">
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
          </div>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          recipes && (
            <div className=" px-10 ">
              <div className=" md:py-6 flex space-x-2">
                <h2 className="text-xl md:text-3xl font-bold md:mb-4 mb-2">
                  Results for:
                </h2>
                <div className="inline-flex md:flex-nowrap flex-wrap md:justify-center gap-1 mb-2 items-center ">
                  {ingredients && (
                    <span className="bg-green-200 text-green-900 md:text-sm text-xs font-medium  md:px-4 md:py-2 p-1 px-2 rounded-full">
                      {ingredients}
                    </span>
                  )}
                  {cuisine.length > 0 && (
                    <span className="bg-green-200 text-green-900 md:text-sm text-xs font-medium  md:px-4 md:py-2 p-1 px-2 rounded-full">
                      {cuisine.join(", ")} Cuisine
                    </span>
                  )}
                  {difficulty && (
                    <span className="bg-green-200 text-green-900 md:text-sm text-xs font-medium  md:px-4 md:py-2 p-1 px-2 rounded-full">
                      {difficulty} level
                    </span>
                  )}
                  {time && (
                    <span className="bg-green-200 text-green-900 md:text-sm text-xs font-medium  md:px-4 md:py-2 p-1 px-2 rounded-full">
                      Cooking time: {time}
                    </span>
                  )}
                  {anything && (
                    <span className="bg-purple-200 text-purple-900 text-sm font-medium px-4 py-2 rounded-full">
                      {anything}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col flex-wrap md:w-[80vw]   items-center">
                {recipes?.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    imageSearchList={imageData[recipe.title]}
                    isMyRecipe={false}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
