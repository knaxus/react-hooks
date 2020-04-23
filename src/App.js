/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'http://hn.algolia.com/api/v1/search?query=';

function App() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('reactjs');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const searchInputRef = useRef();

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = async () => {
    if (search) {
      try {
        setLoading(true);
        const res = await axios.get(`${API}${search}`);
        setResults(res.data.hits);
        setLoading(false);
        setSearch('');
        searchInputRef.current.focus();
      } catch (err) {
        setErr(err.message);
      }
    }
  }

  const handleSearch = async (e) => {
    setSearch(e.target.value);

    if (e.keyCode === 13) {
      console.log('Enter pressed');
      await callAPI();
    }
  }

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      await callAPI();
    }
  }

  return (
    <div className="App">
      <h1>Hacker News</h1>
      <input
        type="text"
        placeholder={"search here"}
        value={search}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        ref={searchInputRef}
      />

      <button
        onClick={async () => await callAPI()}
      >Search</button>
      <br />
      <div className="news-holder">
        {
          loading && !err ? 'Loading...' :
            (
              <ul>
                {
                  results.map((item) => (
                    item.title && item.url ? (
                      <li key={item.objectID}>
                        <a href={item.url}>{item.title}</a>
                      </li>
                    ) : null
                  ))
                }
              </ul>
            )
        }

        {
          err && (
            <p style={{ color: 'red ' }}>{err}</p>
          )
        }

      </div>
    </div>
  );
}

export default App;
