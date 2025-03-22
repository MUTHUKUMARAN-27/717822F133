import { useState } from 'react';
import axios from "axios";

const API_BASE = "http://20.244.56.144/test";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNjI2NTgzLCJpYXQiOjE3NDI2MjYyODMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA1MjhjOTU3LWJkNTEtNDEwNC1hZTk2LTI3NWYzYWUzNjc1MSIsInN1YiI6IjcxNzgyMmYxMzNAa2NlLmFjLmluIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiIwNTI4Yzk1Ny1iZDUxLTQxMDQtYWU5Ni0yNzVmM2FlMzY3NTEiLCJjbGllbnRTZWNyZXQiOiJBYXJEWkR3ZHltbnpubEFZIiwib3duZXJOYW1lIjoiTXV0aHVrdW1hcmFuIiwib3duZXJFbWFpbCI6IjcxNzgyMmYxMzNAa2NlLmFjLmluIiwicm9sbE5vIjoiNzE3ODIyZjEzMyJ9.FoQ-FLHE37UMDxloihuDsY-5m83r7e45WqMl2OmE7Zk";

function App() {

    const [numberType, setNumberType] = useState(" ");
    const [prevWindow, setPrevWindow] = useState([]);
    const [currWindow, setCurrWindow] = useState([]);
    const [average, setAverage] = useState(0);
  
    const WINDOW_SIZE = 10;
  
    const fetchNumbers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/${numberType}`, {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });
        const newNumbers = response.data.numbers.filter(
          (num) => !currWindow.includes(num)
        );
  
        if (newNumbers.length > 0) {
          const updatedWindow = [...currWindow, ...newNumbers].slice(-WINDOW_SIZE);
  
          setPrevWindow(currWindow);
          setCurrWindow(updatedWindow);
          setAverage(
            updatedWindow.reduce((sum, num) => sum + num, 0) / updatedWindow.length
          );
        }
      } catch (error) {
        console.error("Error fetching numbers:", error);
      }
    };
  
    return (
      <div className="min-h-screen bg-whilte-100 p-4">
        <div className="bg-white border-2 border-black p-4 mx-auto max-w-md">
          <h2 className="text-center text-2xl font-bold mb-4 text-blue-600">Average Calculator</h2>
  
          <div className="mb-4">
            <select
              value={numberType}
              onChange={(e) => setNumberType(e.target.value)}
              className="border-2 border-blue-500 p-1 mb-2 w-full"
            >
              <option value=" ">Select Number Type</option>
              <option value="primes">Prime</option>
              <option value="fibo">Fibonacci</option>
              <option value="even">Even</option>
              <option value="rand">Random</option>
            </select>
  
            <button onClick={fetchNumbers} className="bg-green-500 text-white p-2 w-full font-bold">
              FETCH NUMBERS
            </button>
          </div>
  
          <div>
            <h3 className="font-bold text-blue-600">Previous Window:</h3>
            <div className="border-2 border-gray-400 p-2 mb-4 bg-gray-100">{JSON.stringify(prevWindow)}</div>
  
            <h3 className="font-bold text-blue-600">Current Window:</h3>
            <div className="border-2 border-gray-400 p-2 mb-4 bg-gray-100">{JSON.stringify(currWindow)}</div>
  
            <h3 className="font-bold text-blue-600">Average:</h3>
            <div className="border-2 border-red-500 p-2 bg-red-100 text-center font-bold text-xl">
              {average.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    )
  };
  

export default App;