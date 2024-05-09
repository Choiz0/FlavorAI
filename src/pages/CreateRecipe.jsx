import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import useRecipeForm from "../hooks/useRecipeForm";
import { useAuth } from "../context/AuthContext";
import RecipeForm from "../components/RecipeForm";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const initialFormState = {
    title: "",
    description: "",
    ingredients: [{ Name: "", Amount: "" }],
    instructions: [{ Step: "", Description: "" }],
    difficulty: "",
    time: "",
    cuisine: "",
    servings: "",
    calories: "",
    carbohydrates: "",
    fat: "",
    protein: "",
    notes: "",
    recipe_tips: [""],
    images: [],
  };
  const { currentUser } = useAuth();
  const {
    formData,
    handleChange,
    handleIngredientChange,
    addIngredient,
    handleRemoveIngredient,
    handleInstructionChange,
    addInstruction,
    handleRemoveInstruction,
    handleImageChange,
    handleImageRemove,
  } = useRecipeForm(initialFormState);

  const handleSave = async () => {
    try {
      // 로그로 데이터 확인

      // Ensure there are images to save
      const recipeId = uuidv4();

      const imagesUrls = await Promise.all(
        formData.images.map(async (imageFile) => {
          const imageRef = storageRef(
            getStorage(),
            `recipes/${currentUser.uid}/${recipeId}/${imageFile.name}`
          );
          const snapshot = await uploadBytes(imageRef, imageFile);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          return downloadUrl;
        })
      );

      const docData = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        recipe_tips: formData.recipe_tips,
        saveTime: serverTimestamp(),
        recipeId: recipeId,
        difficulty: formData.difficulty,
        servings: formData.servings,
        calories: formData.calories,
        carbohydrates: formData.carbohydrates,
        fat: formData.fat,
        protein: formData.protein,
        time: formData.time,
        cuisine: formData.cuisine,
        notes: formData.notes,
        images: imagesUrls,
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

  return (
    <>
      <RecipeForm
        formData={formData}
        onChange={handleChange}
        handleIngredientChange={handleIngredientChange}
        addIngredient={addIngredient}
        handleRemoveIngredient={handleRemoveIngredient}
        handleInstructionChange={handleInstructionChange}
        addInstruction={addInstruction}
        handleRemoveInstruction={handleRemoveInstruction}
        onSave={handleSave}
        title="Create Recipe"
        handleImageChange={handleImageChange}
        handleImageRemove={handleImageRemove}
      />
    </>
  );
};

export default CreateRecipe;
