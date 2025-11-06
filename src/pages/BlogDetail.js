import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaComment, FaShare, FaEdit, FaTrash, FaRegHeart, FaReply } from 'react-icons/fa';
import { blogsAPI, commentsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';
import './BlogDetail.css';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadBlog();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      
      const data = await blogsAPI.getBlog(id);
      setBlog(data);
      
      // Record view
      await blogsAPI.recordView(id).catch(() => {
        // Silently fail if view recording fails
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading blog:', err);
      toast.error(err.response?.data?.detail || 'Failed to load blog');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.warning('Please login to like blogs');
      return;
    }

    try {
      if (blog.is_liked) {
        await blogsAPI.unlikeBlog(id);
        toast.success('Blog unliked');
      } else {
        await blogsAPI.likeBlog(id);
        toast.success('Blog liked!');
      }
      
      // Reload blog to get updated counts
      loadBlog();
    } catch (err) {
      console.error('Error toggling like:', err);
      toast.error(err.response?.data?.detail || 'Failed to update like');
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const data = await commentsAPI.getComments(id);
      setComments(data);
      setCommentsLoading(false);
    } catch (err) {
      console.error('Error loading comments:', err);
      setCommentsLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please login to comment');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await commentsAPI.createComment(id, newComment, replyTo?.id || null);
      toast.success(replyTo ? 'Reply posted!' : 'Comment posted!');
      setNewComment('');
      setReplyTo(null);
      loadComments();
      loadBlog(); // Refresh to update comment count
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error(err.response?.data?.detail || 'Failed to post comment');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await commentsAPI.updateComment(commentId, editContent);
      toast.success('Comment updated!');
      setEditingComment(null);
      setEditContent('');
      loadComments();
    } catch (err) {
      console.error('Error updating comment:', err);
      toast.error(err.response?.data?.detail || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentsAPI.deleteComment(commentId);
      toast.success('Comment deleted!');
      loadComments();
      loadBlog(); // Refresh to update comment count
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete comment');
    }
  };

  const startReply = (comment) => {
    setReplyTo(comment);
    setNewComment(`@${comment.user?.username} `);
  };

  const cancelReply = () => {
    setReplyTo(null);
    setNewComment('');
  };

  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await blogsAPI.deleteBlog(id);
      toast.success('Blog deleted successfully!');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error(err.response?.data?.detail || 'Failed to delete blog');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-container">
          <div className="cyber-loader"></div>
        </div>
      </div>
    );
  }

  if (!loading && !blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-container" style={{textAlign: 'center', padding: '3rem'}}>
          <h2>Error</h2>
          <p>Blog not found</p>
          <Link to="/" className="cyber-btn">Go Home</Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && blog.author && user.username === blog.author.username;

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <article className="blog-detail-card">
          <div className="blog-detail-header">
            <div className="blog-author-info">
              {blog.author?.avatar_url ? (
                <img src={blog.author.avatar_url} alt={blog.author.username} className="author-avatar-large" style={{width: '60px', height: '60px', borderRadius: '50%'}} />
              ) : (
                <span className="author-avatar-large">{blog.author?.username?.[0]?.toUpperCase() || '?'}</span>
              )}
              <div>
                <Link to={`/profile/${blog.author?.username}`} className="author-name-large">
                  {blog.author?.username || 'Unknown'}
                </Link>
                <span className="blog-date-large">{formatDate(blog.published_at || blog.created_at)}</span>
              </div>
            </div>
            {isAuthor && (
              <div className="blog-actions">
                <Link to={`/edit/${blog.id}`} className="action-btn-icon edit-btn">
                  <FaEdit />
                </Link>
                <button onClick={handleDelete} className="action-btn-icon delete-btn">
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          <h1 className="blog-detail-title">{blog.title}</h1>

          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-detail-tags">
              {blog.tags.map((tag, i) => (
                <span key={i} className={`tag ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="blog-detail-content">
            {blog.content.split('\n').map((para, i) => (
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            ))}
          </div>

          <div className="blog-detail-footer">
            <button 
              className={`action-btn-large like-btn ${blog.is_liked ? 'liked' : ''}`} 
              onClick={handleLike}
            >
              {blog.is_liked ? <FaHeart /> : <FaRegHeart />}
              <span>{blog.likes_count || 0}</span>
            </button>
            <button className="action-btn-large comment-btn">
              <FaComment />
              <span>{blog.comments_count || 0}</span>
            </button>
            <button 
              className="action-btn-large share-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
            >
              <FaShare />
            </button>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({blog.comments_count || 0})</h2>

          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              {replyTo && (
                <div className="reply-indicator">
                  <span>Replying to @{replyTo.user?.username}</span>
                  <button type="button" onClick={cancelReply} className="cancel-reply">×</button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? "Write your reply..." : "Write a comment..."}
                className="cyber-textarea"
                rows="3"
              />
              <div className="comment-form-actions">
                <button type="submit" className="cyber-btn">
                  {replyTo ? 'Post Reply' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <p style={{textAlign: 'center', opacity: 0.7, padding: '2rem'}}>
              <Link to="/login" style={{color: '#00ff88'}}>Login</Link> to comment
            </p>
          )}

          <div className="comments-list">
            {commentsLoading ? (
              <p style={{textAlign: 'center', opacity: 0.5, padding: '2rem'}}>
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p style={{textAlign: 'center', opacity: 0.5, padding: '2rem'}}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  currentUser={user}
                  onReply={startReply}
                  onEdit={startEdit}
                  onDelete={handleDeleteComment}
                  editingCommentId={editingComment}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  onSaveEdit={handleEditComment}
                  onCancelEdit={cancelEdit}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Comment Item Component
function CommentItem({ 
  comment, 
  currentUser, 
  onReply, 
  onEdit, 
  onDelete,
  editingCommentId,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
  formatDate,
  isReply = false 
}) {
  const isAuthor = currentUser && comment.user && currentUser.id === comment.user.id;
  const isEditing = editingCommentId === comment.id;

  return (
    <div className={`comment-card ${isReply ? 'reply-comment' : ''}`}>
      <div className="comment-header">
        {comment.user?.avatar_url ? (
          <img 
            src={comment.user.avatar_url} 
            alt={comment.user.username} 
            className="comment-avatar"
            style={{width: '40px', height: '40px', borderRadius: '50%'}}
          />
        ) : (
          <span className="comment-avatar">
            {comment.user?.username?.[0]?.toUpperCase() || '?'}
          </span>
        )}
        <div className="comment-info">
          <div className="comment-meta">
            <span className="comment-author">{comment.user?.username || 'Unknown'}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
            {comment.created_at !== comment.updated_at && (
              <span className="comment-edited">(edited)</span>
            )}
          </div>
        </div>
        {isAuthor && !isEditing && (
          <div className="comment-actions">
            <button onClick={() => onEdit(comment)} className="comment-action-btn">
              <FaEdit /> Edit
            </button>
            <button onClick={() => onDelete(comment.id)} className="comment-action-btn delete">
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="cyber-textarea"
            rows="3"
          />
          <div className="comment-edit-actions">
            <button onClick={() => onSaveEdit(comment.id)} className="cyber-btn-sm">
              Save
            </button>
            <button onClick={onCancelEdit} className="cyber-btn-outline-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="comment-content">{comment.content}</p>
          {currentUser && !isReply && (
            <button onClick={() => onReply(comment)} className="comment-reply-btn">
              <FaReply /> Reply
            </button>
          )}
        </>
      )}

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              editingCommentId={editingCommentId}
              editContent={editContent}
              setEditContent={setEditContent}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              formatDate={formatDate}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
