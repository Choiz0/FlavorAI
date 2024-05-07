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

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // 파일 리스트를 배열로 변환
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ...files], // 기존 이미지 배열에 새 파일들 추가
    }));
  };
  const handleImageRemove = (index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index)
    }));
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
    handleImageChange,
    handleImageRemove,
  };
};

export default useRecipeForm;
