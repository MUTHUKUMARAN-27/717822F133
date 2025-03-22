import { useState } from 'react'


function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://20.244.56.144/test/users');
        const usersData = userResponse.data.users;
        setUsers(usersData);

        const postsData = [];
        for (const userId of Object.keys(usersData)) {
          const postResponse = await axios.get(`http://20.244.56.144/test/users/${userId}/posts`);
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
          const commentResponse = await axios.get(`http://20.244.56.144/test/posts/${post.id}/comments`);
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

export default App
