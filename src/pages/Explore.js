import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFire, FaHashtag, FaRobot, FaGamepad, FaLaptopCode, FaChartLine, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import './Explore.css';

const RSS_API_BASE_URL = 'http://localhost:8001/api';

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All News', icon: <FaFire /> },
    { id: 'ai', name: 'AI & ML', icon: <FaRobot /> },
    { id: 'tech', name: 'Tech', icon: <FaLaptopCode /> },
    { id: 'gaming', name: 'Gaming', icon: <FaGamepad /> },
    { id: 'trending', name: 'Trending', icon: <FaChartLine /> },
  ];

  // Fetch news from API
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = selectedCategory === 'all' 
        ? `${RSS_API_BASE_URL}/news/all`
        : `${RSS_API_BASE_URL}/news/${selectedCategory}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to load news. Make sure the RSS feed server is running on http://localhost:8001');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filter articles by search query
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="explore-page">
      <div className="explore-container">
        <div className="explore-header">
          <h1 className="explore-title">
            <FaHashtag className="title-icon" />
            Explore Real-Time News
          </h1>
          <p className="explore-subtitle">Live updates from verified AI, Tech, and Gaming sources</p>
        </div>

        <form onSubmit={handleSearch} className="search-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news articles..."
              className="cyber-input search-input"
            />
          </div>
          <button type="button" onClick={fetchNews} className="cyber-btn">
            Refresh
          </button>
        </form>

        <section className="category-tabs-section">
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={fetchNews} className="retry-btn">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="loading-section">
            <FaSpinner className="spinner" />
            <p>Loading latest news...</p>
          </div>
        ) : (
          <section className="news-articles-section">
            <div className="section-header">
              <h2>
                <FaFire /> {filteredArticles.length} Articles Found
              </h2>
              <span className="last-updated">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="news-grid">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                    className="news-card"
                  >
                    {article.image && (
                      <div className="news-image" style={{ backgroundImage: `url(${article.image})` }} />
                    )}
                    <div className="news-content">
                      <div className="news-meta">
                        <span className="news-source">{article.source}</span>
                        {article.category && (
                          <span className={`news-category ${article.category}`}>
                            {article.category}
                          </span>
                        )}
                      </div>
                      <h3 className="news-title">{article.title}</h3>
                      <p className="news-description">{article.description}</p>
                      <div className="news-footer">
                        <span className="news-author">by {article.author}</span>
                        <span className="news-time">{formatDate(article.published)}</span>
                        <FaExternalLinkAlt className="external-icon" />
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="no-results">
                  <p>No articles found matching your search.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Explore;
