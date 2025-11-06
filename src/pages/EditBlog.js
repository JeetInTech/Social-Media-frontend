import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import './Write.css';

const predefinedTags = ['AI', 'Machine Learning', 'Gaming', 'Tech News', 'Tutorial', 'Review', 'Cyberpunk', 'Web Development', 'Cloud Computing'];

function EditBlog({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    coverImage: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching blog data
    setTimeout(() => {
      setFormData({
        title: 'The Future of AI in Gaming',
        content: 'Sample content here...',
        tags: ['AI', 'Gaming'],
        coverImage: ''
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagToggle = (tag) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tag)
      });
    } else if (formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }
    // Mock update - in real app, call API
    console.log('Blog updated:', formData);
    alert('Blog updated successfully!');
    navigate(`/blog/${id}`);
  };

  if (loading) {
    return (
      <div className="write-page">
        <div className="loading-container">
          <div className="cyber-loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="write-page">
      <div className="write-container">
        <div className="write-header">
          <h1 className="write-title">Edit Blog</h1>
        </div>

        <form onSubmit={handleSubmit} className="write-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="cyber-input"
              placeholder="Enter an engaging title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="cyber-textarea"
              placeholder="Write your blog content here..."
              rows="20"
              required
            />
          </div>

          <div className="form-group">
            <label>Tags (Select up to 5)</label>
            <div className="tags-selection">
              {predefinedTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${formData.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL (Optional)</label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="cyber-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cyber-btn-outline" onClick={() => navigate(`/blog/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="cyber-btn">
              <FaSave /> Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
