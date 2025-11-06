import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaShare, FaRegHeart, FaRobot } from 'react-icons/fa';
import { blogsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest');

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogsAPI.getBlogs({ 
        skip: 0, 
        limit: 20,
        status: 'published'
      });
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading blogs:', err);
      toast.error('Failed to load blogs');
      setLoading(false);
    }
  };

  const handleLike = async (blogId, isLiked) => {
    if (!user) {
      toast.warning('Please login to like blogs');
      return;
    }

    try {
      if (isLiked) {
        await blogsAPI.unlikeBlog(blogId);
        toast.success('Blog unliked');
      } else {
        await blogsAPI.likeBlog(blogId);
        toast.success('Blog liked!');
      }
      
      // Refresh blogs to get updated counts
      loadBlogs();
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error(err.response?.data?.detail || 'Failed to update like');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="cyber-loader"></div>
          <p>Loading Feed...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">
            <FaRobot className="title-icon" />
            <span>InnerWhispers Feed</span>
          </h1>
          <p className="home-subtitle">Discover the latest in AI, Tech, and Gaming</p>
        </div>

        <div className="filter-section">
          <button 
            className={`filter-btn ${filter === 'latest' ? 'active' : ''}`}
            onClick={() => setFilter('latest')}
          >
            Latest
          </button>
          <button 
            className={`filter-btn ${filter === 'trending' ? 'active' : ''}`}
            onClick={() => setFilter('trending')}
          >
            Trending
          </button>
          <button 
            className={`filter-btn ${filter === 'following' ? 'active' : ''}`}
            onClick={() => setFilter('following')}
            disabled={!user}
          >
            Following
          </button>
        </div>

        <div className="blogs-grid">
          {blogs.length === 0 ? (
            <div className="empty-state" style={{textAlign: 'center', padding: '3rem', gridColumn: '1 / -1'}}>
              <FaRobot size={64} style={{opacity: 0.5, marginBottom: '1rem'}} />
              <h2>No Blogs Yet</h2>
              <p>Be the first to share your thoughts!</p>
              {user && <Link to="/write" className="cyber-btn" style={{marginTop: '1rem'}}>Write a Blog</Link>}
            </div>
          ) : (
            blogs.map((blog, index) => (
              <article 
                key={blog.id} 
                className="blog-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="blog-card-header">
                  <div className="author-info">
                    {blog.author?.avatar_url ? (
                      <img src={blog.author.avatar_url} alt={blog.author.username} className="author-avatar" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                    ) : (
                      <span className="author-avatar">{blog.author?.username?.[0]?.toUpperCase() || '?'}</span>
                    )}
                    <div>
                      <Link to={`/profile/${blog.author?.username}`} className="author-name">
                        {blog.author?.username || 'Unknown'}
                      </Link>
                      <span className="blog-date">{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/blog/${blog.id}`} className="blog-content">
                  <h2 className="blog-title">{blog.title}</h2>
                  <p className="blog-excerpt">{blog.excerpt || blog.content?.substring(0, 150) + '...'}</p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.map((tag, i) => (
                        <span key={i} className={`tag ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>

                <div className="blog-card-footer">
                  <button 
                    className={`action-btn like-btn ${blog.is_liked ? 'liked' : ''}`}
                    onClick={() => handleLike(blog.id, blog.is_liked)}
                  >
                    {blog.is_liked ? <FaHeart /> : <FaRegHeart />}
                    <span>{blog.likes_count || 0}</span>
                  </button>
                  <Link to={`/blog/${blog.id}`} className="action-btn comment-btn">
                    <FaComment />
                    <span>{blog.comments_count || 0}</span>
                  </Link>
                  <button className="action-btn share-btn" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/blog/${blog.id}`);
                    toast.success('Link copied to clipboard!');
                  }}>
                    <FaShare />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {!user && (
          <div className="cta-section">
            <h2>Join the InnerWhispers Community</h2>
            <p>Share your thoughts on AI, Technology, and Gaming</p>
            <Link to="/register" className="cyber-btn">Get Started</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
