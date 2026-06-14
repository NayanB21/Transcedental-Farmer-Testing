const {
 GoogleGenAI
}
=
require(
 "@google/genai"
);

const ai =
new GoogleGenAI({

 apiKey:
 process.env.GEMINI_API_KEY

});

async function askAgronomist({

 crop = "",
 analytics = {},
 stresses = [],
 question = ""

}){

 const prompt = `

You are an expert agricultural advisor.

Crop:
${crop}

Analytics:
${JSON.stringify(
 analytics,
 null,
 2
)}

Detected Stresses:
${
  stresses.length > 0
  ? stresses.join(", ")
  : "Not Provided"
}

Farmer Question:
${question}

Answer in clean markdown format.
discard the irrelavent promts/questions and ask for relevant questions.
dont give any code and sensitive information.

Use:

🌾 Problem

Explain issue.

✅ Recommended Actions

Bullet points.

⚠️ Precautions

Bullet points.

Keep answer under 200 words.

Do not write huge paragraphs.

Use farmer-friendly language.

If question is in Hindi,
answer in Hindi. 
If question is in bengali, answer in bengali .
And by default answer in english.

we are using satelite data for inferencing which i provided.

Keep answer practical
for farmers.

discard the irrelavent promts/questions and ask for relevant questions.

`;

 const response =
 await ai.models.generateContent({

  model:
  "gemini-2.5-flash",

  contents:
  prompt

 });

 return response.text;

}

module.exports = {
 askAgronomist
};