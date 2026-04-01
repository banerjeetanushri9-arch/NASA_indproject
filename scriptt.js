const API_KEY = "DEMO_KEY"; // Replace with your key later

async function getImage() {
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Please select a date!");
    return;
  }

  document.getElementById("loading").innerText = "Loading...";
  document.getElementById("title").innerText = "";
  document.getElementById("desc").innerText = "";
  document.getElementById("img").style.display = "none";

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
    );

    const data = await response.json();

    console.log(data); // debugging

    // Handle API error
    if (data.error) {
      alert(data.error.message);
      document.getElementById("loading").innerText = "";
      return;
    }

    document.getElementById("title").innerText = data.title;
    document.getElementById("desc").innerText = data.explanation;

    // Handle image/video
    if (data.media_type === "image") {
      const img = document.getElementById("img");
      img.src = data.url;
      img.style.display = "block";
    } else {
      document.getElementById("desc").innerText =
        "This date contains a video. Try another date!";
    }

  } catch (error) {
    alert("Error fetching data. Check internet or API key.");
    console.error(error);
  }

  document.getElementById("loading").innerText = "";
}