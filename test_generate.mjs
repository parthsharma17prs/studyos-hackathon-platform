const formData = new FormData();
formData.append('content', 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.');
formData.append('difficulty', 'medium');
formData.append('language', 'English');
formData.append('questionCount', '3');
formData.append('format', 'text');
const res = await fetch('http://localhost:3001/api/groq/summarize', {
  method: 'POST',
  body: formData
});
const text = await res.text();
console.log("RESPONSE:", text);
