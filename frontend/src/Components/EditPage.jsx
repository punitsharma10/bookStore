import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://bookstore-surz.onrender.com/api/v1/books';

export const EditPage = ({ onBookUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    name: '',
    isbn: '',
    authors: [],
    country: '',
    number_of_pages: 0,
    publisher: '',
    release_date: '',
  });

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setBook(response.data.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`${API_URL}/${id}`, book);
      onBookUpdated();
      navigate('/');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
<div>
      <h2 id="heading">Edit Book</h2>
      <form id='paras'>
        <label>Name:</label>
        <input type="text" name="name" value={book.name} onChange={handleInputChange} />

        <label>ISBN:</label>
        <input type="text" name="isbn" value={book.isbn} onChange={handleInputChange} />

        <label>Authors:</label>
        <input type="text" name="authors" value={book.authors} onChange={handleInputChange} />

        <label>Country:</label>
        <input type="text" name="country" value={book.country} onChange={handleInputChange} />

        <label>Number of Pages:</label>
        <input type="number" name="number_of_pages" value={book.number_of_pages} onChange={handleInputChange} />

        <label>Publisher:</label>
        <input type="text" name="publisher" value={book.publisher} onChange={handleInputChange} />

        <label>Release Date:</label>
        <input type="text" name="release_date" value={book.release_date} onChange={handleInputChange} />

        <button type="button" onClick={handleUpdate}>
          Update
        </button>
      </form>
    </div>
  );
};
