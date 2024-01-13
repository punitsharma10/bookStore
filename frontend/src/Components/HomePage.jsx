import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const HomePage = ({ books, onDelete }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchValue.trim() !== "") {
      navigate(`/searchpage?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };
  return (
    <div id="homepage">
      <h2 id="heading">BookStore</h2>
      <div id="searcharea">
        <div id="searchbar">
          <input
            id="searchinput"
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <button
            id="searchbutton"
            onClick={handleSearchClick}
            disabled={!searchValue.trim()}
          >
            Search
          </button>
        </div>
        <button id="createbutton">
          <Link to={`/create`}>Create Book</Link>
        </button>
      </div>

      <div id="container">
        {books.map((book) => (
          <BookCard book={book} onDelete={onDelete} key={book.id} />
        ))}
      </div>
    </div>
  );
};

function formatDate(inputDate) {
  const dateObject = new Date(inputDate);
  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

const BookCard = ({ book, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete(book.id);
  };

  return (
    <div id="card">
      <p>Name: {book.name}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Authors: {book.authors.join(", ")}</p>
      <p>Country: {book.country}</p>
      <p>Number of Pages: {book.number_of_pages}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Release Date: {formatDate(book.release_date)}</p>
      <div id="cardbutton">
        <button>
          <Link to={`/edit/${book.id}`}>Edit</Link>
        </button>
        <button onClick={handleDeleteClick}>Delete</button>
      </div>
    </div>
  );
};
