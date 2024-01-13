import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { HomePage } from "./Components/HomePage";
import { EditPage } from "./Components/EditPage";
import { CreateBook } from "./Components/CreateBook";
import { SearchPage } from "./Components/SearchPage";



const API_URL = "https://bookstore-surz.onrender.com/api/v1/books";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            books={books}
            onDelete={handleDelete}
            onBookUpdated={fetchBooks}
          />
        }
      />
      <Route
        path="/edit/:id"
        element={<EditPage onBookUpdated={fetchBooks} />}
      />
      <Route
        path="/create"
        element={<CreateBook onBookCreated={fetchBooks} />}
      />
      <Route path="/searchpage" element={<SearchPage />} />
    </Routes>
  );
}

export default App;
