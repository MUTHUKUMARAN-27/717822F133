import React, { useEffect, useState } from 'react';
import axios from "axios";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNjI3NzIyLCJpYXQiOjE3NDI2Mjc0MjIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA1MjhjOTU3LWJkNTEtNDEwNC1hZTk2LTI3NWYzYWUzNjc1MSIsInN1YiI6IjcxNzgyMmYxMzNAa2NlLmFjLmluIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiIwNTI4Yzk1Ny1iZDUxLTQxMDQtYWU5Ni0yNzVmM2FlMzY3NTEiLCJjbGllbnRTZWNyZXQiOiJBYXJEWkR3ZHltbnpubEFZIiwib3duZXJOYW1lIjoiTXV0aHVrdW1hcmFuIiwib3duZXJFbWFpbCI6IjcxNzgyMmYxMzNAa2NlLmFjLmluIiwicm9sbE5vIjoiNzE3ODIyZjEzMyJ9.3BF4Btn2i8kuJQiEiaWHyheEIzo_tuQzhx_V6Zr9mBk";

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://20.244.56.144/test/users', {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
        });
        const usersData = userResponse.data.users;
        setUsers(usersData);

        const postsData = [];
        for (const userId of Object.keys(usersData)) {
          const postResponse = await axios.get(`http://20.244.56.144/test/users/${userId}/posts`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
          });
          postsData.push(...postResponse.data.posts);
        }
        setPosts(postsData);

        const userPostCount = {};
        postsData.forEach(post => {
          userPostCount[post.userid] = (userPostCount[post.userid] || 0) + 1;
        });
        const sortedUsers = Object.entries(userPostCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => usersData[id]);
        setTopUsers(sortedUsers);

        const postCommentCount = [];
        for (const post of postsData) {
          const commentResponse = await axios.get(`http://20.244.56.144/test/posts/${post.id}/comments`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
          });
          postCommentCount.push({ ...post, commentCount: commentResponse.data.comments.length });
        }
        const sortedTrending = postCommentCount.sort((a, b) => b.commentCount - a.commentCount);
        setTrendingPosts(sortedTrending);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Social Media Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Top Users</h2>
          <ul>
            {topUsers.map((user, index) => (
              <li key={index} className="text-gray-700 py-1">{user}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Trending Posts</h2>
          <ul>
            {trendingPosts.map((post, index) => (
              <li key={index} className="text-gray-700 py-1">{post.content} ({post.commentCount} comments)</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md mt-4">
        <h2 className="text-xl font-semibold mb-2">Live Feed</h2>
        <ul>
          {posts.map((post, index) => (
            <li key={index} className="text-gray-700 py-1">{post.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;