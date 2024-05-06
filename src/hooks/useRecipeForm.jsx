// hooks/useRecipeForm.js
import { useState } from "react";

const useRecipeForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = formData.ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [e.target.name]: e.target.value };
      }
      return ingredient;
    });
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    const newIngredient = { Name: "", Amount: "" };
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, newIngredient],
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, e) => {
    const newInstructions = formData.instructions.map((instruction, i) => {
      if (i === index) {
        return { ...instruction, [e.target.name]: e.target.value };
      }
      return instruction;
    });
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    const newInstruction = { Step: "", Description: "" };
    setFormData({
      ...formData,
      instructions: [...formData.instructions, newInstruction],
    });
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleIngredientChange,
    addIngredient,
    handleRemoveIngredient,
    handleInstructionChange,
    addInstruction,
    handleRemoveInstruction,
  };
};

export default useRecipeForm;
