import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaSave, FaEye } from 'react-icons/fa';
import { blogsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';
import './Write.css';

const predefinedTags = ['AI', 'Machine Learning', 'Gaming', 'Tech News', 'Tutorial', 'Review', 'Cyberpunk', 'Web Development', 'Cloud Computing'];

function Write() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    coverImage: ''
  });
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleAIAssist = () => {
    toast.info('AI Writing Assistant coming soon! This will help you generate content, improve grammar, and suggest tags.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      setLoading(true);
      
      const blogData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        cover_image_url: formData.coverImage || null,
        status: 'published',
        excerpt: formData.content.substring(0, 200) + '...'
      };

      const response = await blogsAPI.createBlog(blogData);
      console.log('Blog created:', response);
      toast.success('Blog published successfully!');
      setTimeout(() => {
        navigate(`/blog/${response.id}`);
      }, 500);
    } catch (err) {
      console.error('Error creating blog:', err);
      toast.error(err.response?.data?.detail || 'Failed to publish blog. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="write-page">
      <div className="write-container">
        <div className="write-header">
          <h1 className="write-title">
            <FaRobot className="title-icon" />
            Create New Blog
          </h1>
          <div className="write-actions">
            <button 
              type="button" 
              className="cyber-btn-outline"
              onClick={() => setPreview(!preview)}
            >
              <FaEye /> {preview ? 'Edit' : 'Preview'}
            </button>
            <button 
              type="button" 
              className="cyber-btn"
              onClick={handleAIAssist}
            >
              <FaRobot /> AI Assist
            </button>
          </div>
        </div>

        {!preview ? (
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
                disabled={loading}
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
                placeholder="Write your blog content here... (Markdown supported)"
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
              <button type="button" className="cyber-btn-outline" onClick={() => navigate('/')} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="cyber-btn" disabled={loading}>
                <FaSave /> {loading ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>
          </form>
        ) : (
          <div className="preview-container">
            <div className="preview-card">
              <h1 className="preview-title">{formData.title || 'Your Title Here'}</h1>
              <div className="preview-meta">
                <span className="preview-author">{user.username}</span>
                <span className="preview-date">{new Date().toLocaleDateString()}</span>
              </div>
              {formData.tags.length > 0 && (
                <div className="preview-tags">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="preview-content">
                {formData.content || 'Your content will appear here...'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Write;
