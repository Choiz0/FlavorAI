import React from "react";
import { useAuth } from "../context/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useQuery } from "react-query";
import RecipeCard from "../components/RecipeCard";
import { orderBy } from "lodash";
import Loading from "../components/Loading";

const MyRecipeList = () => {
  const { currentUser } = useAuth(); // 현재 로그인된 사용자의 정보를 가져옴

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery(
    ["userRecipes", currentUser?.uid],
    async () => {
      if (!currentUser) {
        throw new Error("You must be logged in to see this page.");
      }

      const q = query(
        collection(db, "users", currentUser.uid, "recipes"),
        orderBy("saveTime", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    {
      enabled: !!currentUser, // Query is only executed if the currentUser is not null
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="flex flex-col items-center w-full justify-center ">
      <h1 className="md:text-2xl text-xl font-medium text-gray-800 dark:text-white mb-8 ">
        My Recipes
      </h1>
      <div className="flex flex-wrap items-start justify-center w-full">
        {recipes &&
          recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              image={recipe.images} // Assuming each recipe has its own images
              isMyRecipe={true}
            />
          ))}
      </div>
    </div>
  );
};

export default MyRecipeList;
