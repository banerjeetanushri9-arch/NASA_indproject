const API_KEY = "bve2gkE2AI2tJztmrixinEFQ8N6FElGgYQ3hYlbB";

let allData = [];

// FETCH IMAGE
async function getImage() {
  const date = document.getElementById("date").value;
  const loading = document.getElementById("loading");
  const btn = document.getElementById("fetchBtn");

  if (!date) {
    alert("Please select a date!");
    return;
  }

  // Prevent duplicate fetch
  if (allData.some(item => item.date === date)) {
    alert("Data already fetched for this date!");
    return;
  }

  loading.innerText = "Loading...";
  if (btn) btn.disabled = true;

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
    );

    // 👇 Get raw response first
    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text); // safe parse
    } catch (err) {
      throw new Error("Server returned invalid response (not JSON)");
    }

    // Handle API errors
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "API Error");
    }

    allData.push(data);
    displayData(allData);

  } catch (error) {
    alert("Error: " + error.message);
    console.error("Fetch Error:", error);
  } finally {
    loading.innerText = ""; // always stop loading
    if (btn) btn.disabled = false;
  }
}

// DISPLAY FUNCTION
function displayData(dataArray) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  if (dataArray.length === 0) {
    gallery.innerHTML = "<p>No data found</p>";
    return;
  }

  dataArray.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <h3>${item.title}</h3>
      ${
        item.media_type === "image"
          ? `<img src="${item.url}" alt="${item.title}" />`
          : `<p>🎥 Video content</p>`
      }
      <p>${item.explanation.substring(0, 120)}...</p>
      <button onclick="likePost(${index})">❤️ Like</button>
    `;

    gallery.appendChild(div);
  });
}

// SEARCH (Debounced)
let searchTimeout;

function searchData() {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const keyword = document
      .getElementById("searchInput")
      .value.toLowerCase();

    const filtered = allData.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.explanation.toLowerCase().includes(keyword)
    );

    displayData(filtered);
  }, 300);
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

// LIKE
function likePost(index) {
  alert("❤️ You liked: " + allData[index].title);
}

// DARK MODE
function toggleTheme() {
  document.body.classList.toggle("light");
}