import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import useRecipeForm from "../hooks/useRecipeForm";
import RecipeForm from "../components/RecipeForm";
const EditRecipe = () => {
  const { currentUser } = useAuth();
  const { recipeId } = useParams();
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
  };
  const {
    formData,
    setFormData,
    handleChange,
    handleIngredientChange,
    addIngredient,
    handleRemoveIngredient,
    handleInstructionChange,
    addInstruction,
    handleRemoveInstruction,
  } = useRecipeForm(initialFormState);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, "users", currentUser.uid, "recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        toast.error("Recipe not found");
      }
    };
    fetchRecipe();
  }, [recipeId, currentUser.uid]);

  const handleUpdate = async () => {
    const docRef = doc(db, "users", currentUser.uid, "recipes", recipeId);
    await updateDoc(docRef, formData);
    toast.success("Recipe updated successfully");
    navigate(-1);
  };

  return (
    <div className=" p-4  m-2 ">
      <RecipeForm
        formData={formData}
        onChange={handleChange}
        handleIngredientChange={handleIngredientChange}
        addIngredient={addIngredient}
        handleRemoveIngredient={handleRemoveIngredient}
        handleInstructionChange={handleInstructionChange}
        addInstruction={addInstruction}
        handleRemoveInstruction={handleRemoveInstruction}
        onSave={handleUpdate}
        title="Edit Recipe"
      />
    </div>
  );
};

export default EditRecipe;
