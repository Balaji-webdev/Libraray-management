import { useEffect, useState } from "react";

export function useDataFetch(url) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [next,setNext] = useState(true)

  useEffect(() => {
   let isAdded = true;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isAdded) {
          setBooks(data);
        }
      })
      .catch((err) => {
        if (!isAdded) return;
        setError(err);
      });
    return () => {
      isAdded = false;
    };
  }, [url]);
  return  { books, error,setBooks };
}
