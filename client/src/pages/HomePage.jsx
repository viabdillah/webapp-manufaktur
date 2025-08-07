import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Endpoint ini publik, jadi tidak perlu token
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Gagal memuat postingan blog.');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center">Memuat...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Blog & Informasi Terbaru</h1>
        <p className="text-lg text-gray-600 mt-2">Wawasan terbaru dari dunia desain dan kemasan.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <Link to={`/blog/${post.slug}`}>
              <img src={post.image_url || 'https://via.placeholder.com/400x200'} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-4">oleh {post.author_name} - {new Date(post.created_at).toLocaleDateString('id-ID')}</p>
                {/* Menampilkan potongan konten */}
                <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;