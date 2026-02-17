const form = document.getElementById("form");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  const res = await fetch("/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    status.textContent = "Saved!";
    form.reset();
  } else {
    status.textContent = "Error saving bookmark";
  }
});
