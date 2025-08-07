import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BlogDetailPage() {
  const { slug } = useParams(); // Mengambil 'slug' dari URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        if (!response.ok) {
          throw new Error('Postingan tidak ditemukan.');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <p className="text-center">Memuat...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <img src={post.image_url || 'https://via.placeholder.com/800x400'} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
      <p className="text-md text-gray-500 mb-6">
        Ditulis oleh {post.author_name} pada {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div className="prose max-w-none">
        {/* Split konten berdasarkan baris baru untuk render paragraf */}
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      <Link to="/" className="text-blue-600 hover:underline mt-8 inline-block">&larr; Kembali ke semua postingan</Link>
    </div>
  );
}

export default BlogDetailPage;