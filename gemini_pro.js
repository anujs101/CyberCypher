import dotenv from "dotenv";
import { GoogleGenerativeAI} from "@google/generative-ai"

dotenv.config();

const genAi= new GoogleGenerativeAI(process.env.API_KEY);


async function run() {
  const model =  genAi.getGenerativeModel({model:"gemini-pro"})

  const prompt = 
    "Who are you give a one liner"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text)
  
 

}
run();