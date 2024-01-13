const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;
var corsOptions = {
  origin: "*",
};

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://ppcommercial31:punit12@cluster0.ogkgxal.mongodb.net/mernstack?retryWrites=true&w=majority&appName=AtlasApp"
);

const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: String,
  isbn: String,
  authors: [String],
  country: String,
  number_of_pages: Number,
  publisher: String,
  release_date: Date,
});

bookSchema.pre("save", function (next) {
  const book = this;
  if (!book.id) {
    Book.countDocuments({}, function (err, count) {
      if (err) {
        return next(err);
      }
      book.id = count + 1;
      next();
    });
  } else {
    next();
  }
});

const Book = mongoose.model("Book", bookSchema);

app.post("/api/v1/books", async (req, res) => {
  try {
    const newBookData = req.body;
    const newBook = new Book(newBookData);

    newBook.id = await getNextBookId();
    await newBook.save();
    res.status(201).json({
      status_code: 201,
      status: "success",
      data: [{ book: { ...newBook.toObject() } }],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getNextBookId() {
  try {
    const lastBook = await Book.findOne({}, {}, { sort: { id: -1 } });
    return lastBook ? lastBook.id + 1 : 1;
  } catch (error) {
    throw error;
  }
}

app.get("/api/v1/books", async (req, res) => {
  try {
    const { name, country, publisher, release_date } = req.query;
    const filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (country) filter.country = new RegExp(country, "i");
    if (publisher) filter.publisher = new RegExp(publisher, "i");
    if (release_date) filter.release_date = release_date;

    const books = await Book.find(filter).select("-__v");
    res.status(200).json({
      status_code: 200,
      status: "success",
      data: books.map((book) => ({ ...book.toObject(), id: book.id })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/v1/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.status(200).json({
      status_code: 200,
      status: "success",
      message: `The book ${updatedBook.name} was updated successfully`,
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/v1/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findOneAndDelete({ id });
    res.status(200).json({
      status_code: 200,
      status: "success",
      message: `The book ${deletedBook.name} was deleted successfully`,
      data: [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/v1/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOne({ id });
    res.status(200).json({
      status_code: 200,
      status: "success",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/external-books", async (req, res) => {
  try {
    const response = await axios.get(
      "https://anapioficeandfire.com/api/books/"
    );

    const transformedData = response.data.map((book) => ({
      name: book.name,
      isbn: book.isbn,
      authors: book.authors,
      number_of_pages: book.numberOfPages,
      publisher: book.publisher,
      country: book.country,
      release_date: book.released.split("T")[0],
    }));
    const { name } = req.query;
    const nameOfBook = name.replace(":", "");
    const filteredData = transformedData.filter((book) => {
      return book.name
        .trim()
        .toLowerCase()
        .includes(nameOfBook.trim().toLowerCase());
    });

    res.status(200).json({
      status_code: 200,
      status: "success",
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching external books:", error);

    res.status(500).json({
      status_code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
