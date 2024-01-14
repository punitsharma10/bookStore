import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://bookstore-surz.onrender.com/api/v1/books";

export const CreateBook = ({ onBookCreated }) => {
  const navigate = useNavigate();

  const [newBook, setNewBook] = useState({
    name: "",
    isbn: "",
    authors: "",
    country: "",
    number_of_pages: 0,
    publisher: "",
    release_date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleCreate = async () => {

    const requiredFields = ["name", "isbn", "authors", "country", "number_of_pages", "publisher", "release_date"];

    const isFormValid = requiredFields.every(field => newBook[field].trim() !== "");

    if (!isFormValid) {
      alert("Please fill all details.");
      return;
    }
    try {
      await axios.post(API_URL, newBook);
      onBookCreated();
      navigate("/");
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <div>
      <button id="backtohomepage">
        <Link to={`/`}>Back to Homepage</Link>
      </button>
      <h2 id="heading">Create New Book</h2>
      <form id="paras">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newBook.name}
          onChange={handleInputChange}
        />

        <label>ISBN:</label>
        <input
          type="text"
          name="isbn"
          value={newBook.isbn}
          onChange={handleInputChange}
        />

        <label>Authors:</label>
        <input
          type="text"
          name="authors"
          value={newBook.authors}
          onChange={handleInputChange}
        />

        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={newBook.country}
          onChange={handleInputChange}
        />

        <label>Number of Pages:</label>
        <input
          type="number"
          name="number_of_pages"
          value={newBook.number_of_pages}
          onChange={handleInputChange}
        />

        <label>Publisher:</label>
        <input
          type="text"
          name="publisher"
          value={newBook.publisher}
          onChange={handleInputChange}
        />

        <label>Release Date:</label>
        <input
          type="date"
          name="release_date"
          value={newBook.release_date}
          onChange={handleInputChange}
        />

        <button type="button" onClick={handleCreate}>
          Create
        </button>
      </form>
    </div>
  );
};
