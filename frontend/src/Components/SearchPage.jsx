import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const SearchPage = ({ location }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const nameOfABook = new URLSearchParams(window.location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `https://bookstore-surz.onrender.com/api/external-books?name=:${nameOfABook}`
        );
        setSearchResults(response.data.data);
        setSearchError("");
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setSearchError("Error fetching search results. Please try again later.");
      }
    };

    if (nameOfABook) {
      fetchSearchResults();
    }
  }, [nameOfABook]);

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObject.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <button id="backtohomepage">
        <Link to={`/`}>Back to Homepage</Link>
      </button>

      <h2 id="heading">Search Results</h2>

      {searchError && <p style={{ color: "red" }}>{searchError}</p>}

      <div id="container">
        {searchResults.length === 0 && !searchError && <p>No results found.</p>}
        
        {searchResults.map((book) => (
          <div id="card" key={book.isbn}>
            <p>Name: {book.name}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Authors: {book.authors.join(", ")}</p>
            <p>Country: {book.country}</p>
            <p>Number of Pages: {book.number_of_pages}</p>
            <p>Publisher: {book.publisher}</p>
            <p>Release Date: {formatDate(book.release_date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

