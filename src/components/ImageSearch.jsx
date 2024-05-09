import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "YOUR_API_KEY_HERE"; // 여기에 실제 API 키를 입력하세요.
const genAI = new GoogleGenerativeAI(API_KEY);

function ImageSearch() {
  const [file, setFile] = useState(null);
  const [recipes, setRecipes] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  };

  const run = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const imagePart = await fileToGenerativePart(file);

      const prompt = "Provide a recipe based on this image";
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = await response.text();
      setRecipes(text);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={run}>Search Recipe</button>
      {recipes && (
        <div>
          <strong>Recipes:</strong> <p>{recipes}</p>
        </div>
      )}
    </div>
  );
}

export default ImageSearch;
