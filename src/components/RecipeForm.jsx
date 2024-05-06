// components/RecipeForm.js
import React from "react";
import Button from "./Button"; // Assuming you have a custom Button component
import { useNavigate } from "react-router-dom";

const RecipeForm = ({
  formData,
  onChange,
  handleIngredientChange,
  addIngredient,
  handleRemoveIngredient,
  handleInstructionChange,
  addInstruction,
  handleRemoveInstruction,
  onSave,
  title,
}) => {
  const navigate = useNavigate();
  return (
    <div className=" bg-white rounded-lg  shadow-xl w-[90vw] max-w-[90vw] md:m-4 mt-12 h-full  ">
      {/* Sticky Save Button */}
      <div className="flex w-full justify-center my-3">
        <h2 className=" md:text-2xl text-lg font-bold md:mb-3 text-cetner  ">
          {title}
        </h2>
      </div>
      <div className=" px-4 py-2 md:fixed flex w-[90vw] justify-end gap-4">
        <button
          onClick={onSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 px-4  py-1 rounded md:text-xl"
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-pink text-white font-bold md:py-2 px-4 rounded text-xl  py-1  md:text-xl"
        >
          cancel
        </button>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="md:w-2/3  py-4  mx-auto md:mt-14 w-[90%] "
      >
        <div className="mb-4 flex items-center w-full space-x-6 ">
          <label className="text-gray-600 dark:text-gray-400 w-[5%]">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className="rounded-md w-full border border-[#e0e0e0] bg-white md:py-3 py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
        </div>
        <div className="mb-4 flex items-center w-full space-x-6 ">
          <label className="text-gray-600 dark:text-gray-400 w-[5%] ">
            Tips
          </label>
          <textarea
            type="text"
            rows={4}
            name="recipe_tips"
            value={formData.recipe_tips}
            onChange={onChange}
            className="rounded-md md:w-full w-[90%] border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
        </div>
        <div className="mb-4 md:flex items-center w-full space-x-6 ">
          <label className="text-gray-600 dark:text-gray-400 w-[5%]">
            Cuision
          </label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={onChange}
            className="rounded-md md:w-full w-[90%] border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
        </div>
        {/* Description */}
        <div className="mb-4 md:flex items-center w-full space-x-6 ">
          <label className="text-gray-600 dark:text-gray-400 w-[5%] ">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            className="rounded-md md:w-full w-[90%]  border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            rows="4"
          ></textarea>
        </div>
        {/* Ingredients */}
        <div className="mb-4 md:flex flex-col items-center w-full space-x-6 ">
          <label className="text-gray-600 dark:text-gray-400 mb-4 ">
            Ingredients
          </label>
          {formData.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex md:items-center mb-2 flex-col md:flex-row "
            >
              <input
                type="text"
                name="Name"
                placeholder="Ingredient Name"
                value={ingredient.Name}
                onChange={(e) => handleIngredientChange(index, e)}
                className="rounded-md w-full border my-2 border-[#e0e0e0] bg-white md:py-3 py-1 px-1 md:px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              <input
                type="text"
                name="Amount"
                placeholder="Amount"
                value={ingredient.Amount}
                onChange={(e) => handleIngredientChange(index, e)}
                className="rounded-md w-full border border-[#e0e0e0] bg-white md:py-3 py-1 md:px-6 px-1 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm  hover:text-blue-700 bg-lightblue py-1 px-2 rounded-md"
          >
            Add Ingredient
          </button>
        </div>
        {/* Cooking Time and Difficulty */}
        <div className="mb-4 flex justify-between">
          <div className="w-1/2 mr-2">
            <label className="text-gray-600 dark:text-gray-400 mb-4">
              Cooking Time
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={onChange}
              className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="w-1/2">
            <label className="text-gray-600 dark:text-gray-400 mb-4">
              Difficulty
            </label>
            <input
              type="text"
              name="difficulty"
              value={formData.difficulty}
              onChange={onChange}
              className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
        </div>
        {/* Nutrition Information */}
        <label className="text-gray-600 dark:text-gray-400 mb-4">
          Nutrition Information
        </label>
        <div className="mb-4 flex items-center justify-between md:flex-row flex-col">
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-400 mb-4">
              Calories
            </label>
            <input
              type="text"
              name="calories"
              placeholder="Calories"
              value={formData.calories}
              onChange={onChange}
              className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-400 mb-4">
              Carbohydrates
            </label>
            <input
              type="text"
              name="carbohydrates"
              placeholder="Carbohydrates"
              value={formData.carbohydrates}
              onChange={onChange}
              className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-400 mb-4">fat</label>
            <input
              type="text"
              name="fat"
              placeholder="Fat"
              value={formData.fat}
              onChange={onChange}
              className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="flex flex-col">
            {" "}
            <label className="text-gray-600 dark:text-gray-400 mb-4">
              protein
            </label>
            <input
              type="text"
              name="protein"
              placeholder="Protein"
              value={formData.protein}
              onChange={onChange}
              className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-gray-600 dark:text-gray-400 mb-4">
            Instructions
          </label>
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex flex-col mb-4">
              <input
                type="text"
                name="Step"
                placeholder="Step Title"
                value={instruction.DesTitle}
                onChange={(e) => handleInstructionChange(index, e)}
                className="mb-2 rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              <textarea
                name="Description"
                placeholder="Description"
                value={instruction.Description}
                onChange={(e) => handleInstructionChange(index, e)}
                className="rounded-md w-full border border-[#e0e0e0] bg-white py-1 md:px-6 px-2 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                rows="3"
              ></textarea>
              <button
                type="button"
                onClick={() => handleRemoveInstruction(index)}
                className="text-sm text-red-500 hover:text-red-700 mt-2"
              >
                Remove Step
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            className="text-sm bg-lightblue py-1 px-2 rounded hover:text-blue-700"
          >
            Add Instruction
          </button>
        </div>
        {/* Notes */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            className="rounded-md w-full border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            rows="4"
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
