const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");

const app = express();

// Konfiguracja silnika HBS
app.engine("hbs", hbs());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// Pliki statyczne
app.use(express.static(path.join(__dirname, "/public")));

// Middleware blokujący dostęp do /user/*
app.use("/user", (req, res) => {
  res.render("forbidden", { layout: false });
});

// Endpointy
app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/home", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/hello/:name", (req, res) => {
  res.render("hello", { layout: false, name: req.params.name });
});

app.get("/about", (req, res) => {
  res.render("about", { layout: false });
});

app.get("/contact", (req, res) => {
  res.render("contact", { layout: false });
});

app.get("/info", (req, res) => {
  res.render("info", { layout: false });
});

app.get("/history", (req, res) => {
  res.render("history", { layout: false });
});

// Obsługa 404
app.use((req, res) => {
  res.status(404).render("404", { layout: false });
});

// Start serwera
app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
