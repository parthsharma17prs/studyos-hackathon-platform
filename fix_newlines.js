const content = `
{
  "summary": "This is line 1\nThis is line 2"
}`;
try {
  let c = content.replace(/[\u0000-\u001F]+/g,"");
  console.log(JSON.parse(c));
} catch(e) {
  console.log("Failed", e.message);
}
