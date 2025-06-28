const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/public/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

const app = express();

// Middleware do prasowania danych z formularzy
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Konfiguracja silnika HBS
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// Pliki statyczne
app.use(express.static(path.join(__dirname, "/public")));

// Middleware blokujący dostęp do /user/*
app.use("/user", (req, res) => {
  res.render("forbidden");
});

// Endpointy
app.get("/", (req, res) => res.render("index"));
app.get("/home", (req, res) => res.render("index"));
app.get("/hello/:name", (req, res) =>
  res.render("hello", { name: req.params.name })
);
app.get("/about", (req, res) => res.render("about"));
app.get("/contact", (req, res) => res.render("contact"));
app.get("/info", (req, res) => res.render("info"));
app.get("/history", (req, res) => res.render("history"));

// POST z walidacją + plik
app.post("/contact/send-message", upload.single("design"), (req, res) => {
  const { author, sender, title, message } = req.body;
  const file = req.file;

  const isValid =
    author &&
    sender &&
    title &&
    message &&
    file &&
    [".png", ".jpg", ".jpeg", ".gif"].includes(
      path.extname(file.originalname).toLowerCase()
    );

  if (isValid) {
    const imageUrl = `/uploads/${file.filename}`;
    res.render("contact", { isSent: true, imageUrl });
  } else {
    res.render("contact", { isError: true });
  }
});

// Obsługa 404
app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something broke!");
});

// Start serwera
app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
