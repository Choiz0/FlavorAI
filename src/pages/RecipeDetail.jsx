import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { db } from "../firebase";
import {
  collection,
  query,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import defaultImg from "../assets/default.jpg";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const {
    data: recipeDetails,
    isLoading,
    error,
  } = useQuery(["recipeDetails", currentUser?.uid, recipeId], async () => {
    if (!currentUser) {
      throw new Error("You must be logged in to view recipe details.");
    }
    if (!recipeId) {
      throw new Error("Recipe ID is required.");
    }

    const docRef = doc(db, "users", currentUser.uid, "recipes", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      toast.error("No recipe found");

      throw new Error("No recipe found");
    }
  });

  const deleteRecipe = async (id) => {
    try {
      const docRef = doc(db, "users", currentUser.uid, "recipes", id);
      await deleteDoc(docRef);
      toast.success("Recipe deleted successfully.");
      navigate("/myrecipe");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("An error occurred while deleting the recipe.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return;

  return (
    <div className="  items-center  w-[90vw] max-w-[90ww] m-4  justify-center md:mt-0 mt-14 md:w-[98%] bg-white ">
      <ToastContainer />
      <div className="px-6 md:py-6 py-2 flex justify-between items-center md:pt-14 pt-8 bg-slate-50">
        <div>
          <span className="md:text-5xl text-lg">Recipe Details</span>
        </div>
        <div className="flex gap-2 no-print flex-wrap justify-end ">
          <button
            className="bg-dark text-white md:w-[100px] w-[70px]  rounded-lg onClick={handleSave} md:text-lg text-md"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="bg-navy text-white md:w-[100px] w-[70px] rounded-lg onClick={handleSave} md:text-lg text-md"
            onClick={() => navigate(`/myrecipe/edit/${recipeDetails.recipeId}`)}
          >
            Edit
          </button>
          <button
            className="bg-pink py-2 text-white md:w-[100px] w-[70px] rounded-lg onClick={handleSave} md:text-lg text-md"
            onClick={() => deleteRecipe(recipeDetails.recipeId)}
          >
            Delete
          </button>
          <button
            className="bg-green-500 py-2 text-white md:w-[100px] w-[70px] rounded-lg onClick={handleSave} md:text-lg text-md hidden md:block"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </div>
      <div className=" md:flex items-center h-[200px] md:justify-around  justify-center ">
        <h3 className="leading-6 text-gray-900 md:text-5xl  text-xl font-bold md:text-center justify-center pl-12  ">
          {recipeDetails.title}
        </h3>

        <div className="flex overflow-scroll  md:overflow-hidden ">
          {recipeDetails.images ? (
            recipeDetails?.images.map((it, index) => (
              <img
                key={index}
                src={it}
                alt="Search result
                "
                className="md:h-[200px] md:w-[200px] object-cover w-48 h-48 "
              />
            ))
          ) : (
            <img
              src={defaultImg}
              alt={recipeDetails.title}
              className="md:h-[200px] md:w-[200px] object-cover w-48 h-48"
            />
          )}
        </div>
      </div>

      <div className=" p-6 overflow-y-auto">
        {isLoading && (
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
          <div className="md:flex justify-between ">
            <p className="text-gray-700 text-xl md:w-1/3 mb-2">
              {recipeDetails?.description}
            </p>
            <div className="flex flex-col bg-yellow-50 rounded-lg md:w-[30%] p-2">
              <strong className="text-xl text-center max-h-[300px]">
                Custom Notes
              </strong>
              {recipeDetails?.notes}
            </div>
          </div>

          <div className="md:mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6  max-w[350px]">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Recipe Info</h2>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Difficulty:</span>
                  <span className="py-1 px-3 text-gray-600 bg-green-200 rounded-full">
                    {recipeDetails?.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Time:</span>
                  <span className="py-1 px-3 text-gray-600 bg-blue-200 rounded-full">
                    {recipeDetails?.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cuisine:</span>
                  <span className="py-1 px-3 text-gray-600 bg-slate-200 rounded-full">
                    {recipeDetails?.cuisine}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Servings:</span>
                  <span className="py-1 px-3 text-gray-600 bg-slate-200 rounded-full">
                    {recipeDetails?.servings}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow max-w[350px]">
              <h2 className="text-xl font-semibold mb-2">Nutritional Info</h2>
              <table className="w-full text-sm text-left text-gray-500">
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-2 font-medium">Calories</td>
                    <td className="px-4 py-2">{recipeDetails?.calories}</td>
                  </tr>
                  <tr className="bg-blue-100">
                    <td className="px-4 py-2 font-medium">Carbohydrates</td>
                    <td className="px-4 py-2">
                      {recipeDetails?.carbohydrates}
                    </td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-2 font-medium">Fat</td>
                    <td className="px-4 py-2">{recipeDetails?.fat}</td>
                  </tr>
                  <tr className="bg-blue-100">
                    <td className="px-4 py-2 font-medium">Protein</td>
                    <td className="px-4 py-2">{recipeDetails?.protein}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start my-2  ">
          <div className="md:min-w-[50%] p-4 rounded-lg shadow ">
            <p>
              <strong className="text-xl font-semibold mb-2">
                Ingredients
              </strong>
            </p>
            <ul>
              {recipeDetails?.ingredients?.map((ingredient, index) => (
                <li key={index} className="md:text-xl flex items-center py-2">
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

          <div className="p-4 rounded-lg shadow">
            <strong className="text-xl font-semibold mb-2">Tips</strong>

            <ul>
              {Array.isArray(recipeDetails.recipe_tips) ? (
                recipeDetails.recipe_tips.map((tip, index) => (
                  <div key={index} className="md:text-lg ">
                    {tip}
                  </div>
                ))
              ) : (
                <div>No tips provided.</div>
              )}
              {/* {(recipeDetails &&
                recipeDetails.recipe_tips &&
                recipeDetails.recipe_tips.map((tip, i) => (
                  <li key={i} className="md:text-xl py-2">
                    {i + 1}. {tip}
                  </li>
                ))) ||
                recipeDetails.recipe_tips} */}
            </ul>
          </div>
        </div>
        <div className="flex justify-center ">
          <strong className="text-xl font-semibold my-2">Instructions</strong>
        </div>
        <section className="">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-14">
            <div className="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
              <div className="w-full  mx-auto">
                <div className="-my-6">
                  {recipeDetails?.instructions && (
                    <ol className="relative">
                      {recipeDetails?.instructions?.map(
                        (instruction, index) => (
                          <li key={index} className="group ">
                            <div className="absolute left-0 sm:left-12 top-0 h-full w-0.5 bg-slate-300 "></div>

                            <div className="flex flex-col sm:flex-row items-center  ">
                              <div className="sm:absolute left-1  sm:translate-x-[-50%] inline-flex items-center justify-center text-md  font-bold uppercase w-20 h-8 mb-4 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">
                                {instruction.StepNumber}
                              </div>
                              <div className="absolute left-0 sm:left-12 w-3 h-3 bg-indigo-600 rounded-full z-10 translate-x-[-50%] translate-y-8"></div>
                            </div>

                            <div className="mb-2 pl-8 sm:pl-32 md:md:text-2xl py-2 ">
                              <h4 className="font-bold">
                                {" "}
                                {instruction.DesTitle}
                              </h4>
                              <p>{instruction.Description}</p>
                            </div>
                          </li>
                        )
                      )}
                    </ol>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetail;
