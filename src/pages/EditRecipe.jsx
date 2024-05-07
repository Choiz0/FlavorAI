import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import useRecipeForm from "../hooks/useRecipeForm";
import RecipeForm from "../components/RecipeForm";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
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
    images: [],
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
    handleImageChange,
    handleImageRemove,
  } = useRecipeForm(initialFormState);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, "users", currentUser.uid, "recipes", recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure that images is always an array
        setFormData({
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
        });
      } else {
        toast.error("Recipe not found");
      }
    };
    fetchRecipe();
  }, [recipeId, currentUser.uid]);

  const handleUpdate = async () => {
    try {
      if (formData.images.length > 0) {
        const newImages = formData.images.filter(
          (image) => image instanceof File
        );
        const imagesUrls = await Promise.all(
          newImages.map(async (imageFile) => {
            const imageRef = storageRef(
              getStorage(),
              `recipes/${currentUser.uid}/${recipeId}/${imageFile.name}`
            );
            const snapshot = await uploadBytes(imageRef, imageFile);
            return await getDownloadURL(snapshot.ref);
          })
        );
        const updateData = {
          ...formData,
          images: [
            ...formData.images.filter((image) => !(image instanceof File)),
            ...imagesUrls,
          ],
        };
        const docRef = doc(db, "users", currentUser.uid, "recipes", recipeId);
        await updateDoc(docRef, updateData);
        toast.success("Recipe updated successfully");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Failed to update recip ", error);
    }
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
        handleImageChange={handleImageChange}
        handleImageRemove={handleImageRemove}
        onSave={handleUpdate}
        title="Edit Recipe"
      />
    </div>
  );
};

export default EditRecipe;
