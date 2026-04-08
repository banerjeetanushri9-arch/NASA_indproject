const API_KEY = "DEMO_KEY";

let allData = []; // store fetched data

async function getImage() {
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Please select a date!");
    return;
  }

  document.getElementById("loading").innerText = "Loading...";

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
    );

    const data = await response.json();

    if (data.error) {
      alert(data.error.message);
      return;
    }

    allData.push(data); // store data
    displayData(allData);

  } catch (error) {
    alert("Error fetching data");
    console.error(error);
  }

  document.getElementById("loading").innerText = "";
}

// DISPLAY FUNCTION
function displayData(dataArray) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  dataArray.map((item, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${item.title}</h3>
      ${
        item.media_type === "image"
          ? `<img src="${item.url}" />`
          : `<p>🎥 Video content</p>`
      }
      <p>${item.explanation.substring(0, 100)}...</p>
      <button onclick="likePost(${index})">❤️ Like</button>
    `;

    gallery.appendChild(div);
  });
}

// SEARCH (filter + includes)
function searchData() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allData.filter(item =>
    item.title.toLowerCase().includes(keyword) ||
    item.explanation.toLowerCase().includes(keyword)
  );

  displayData(filtered);
}

// FILTER
function filterData(type) {
  if (type === "all") {
    displayData(allData);
    return;
  }

  const filtered = allData.filter(item => item.media_type === type);
  displayData(filtered);
}

// SORT
function sortData(order) {
  let sorted = [...allData];

  if (order === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === "za") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  }

  displayData(sorted);
}

// LIKE BUTTON
function likePost(index) {
  alert("❤️ You liked: " + allData[index].title);
}

// DARK MODE
function toggleTheme() {
  document.body.classList.toggle("light");
}