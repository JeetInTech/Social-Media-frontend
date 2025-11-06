import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaEdit, FaMapMarkerAlt, FaCalendar, FaUserPlus, FaUserCheck, 
  FaEye, FaHeart, FaUsers, FaUserFriends 
} from 'react-icons/fa';
import { profilesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // posts, followers, following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState('');
  
  const isOwnProfile = currentUser && currentUser.username === username;

  useEffect(() => {
    loadProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get profile data
      const profile = await profilesAPI.getProfile(username);
      setUserData(profile);
      
      // Get user's blogs
      const userBlogs = await profilesAPI.getUserBlogs(username);
      setBlogs(userBlogs);
      
      // Check if following (if logged in and not own profile)
      if (currentUser && !isOwnProfile) {
        const followStatus = await profilesAPI.checkIsFollowing(username);
        setIsFollowing(followStatus.is_following);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.response?.data?.detail || 'Failed to load profile');
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      return;
    }
    
    try {
      setFollowLoading(true);
      if (isFollowing) {
        await profilesAPI.unfollowUser(username);
        setIsFollowing(false);
        setUserData(prev => ({ ...prev, followers_count: prev.followers_count - 1 }));
      } else {
        await profilesAPI.followUser(username);
        setIsFollowing(true);
        setUserData(prev => ({ ...prev, followers_count: prev.followers_count + 1 }));
      }
      setFollowLoading(false);
    } catch (err) {
      console.error('Error toggling follow:', err);
      setFollowLoading(false);
    }
  };

  const loadFollowers = async () => {
    try {
      const data = await profilesAPI.getFollowers(username);
      setFollowers(data);
    } catch (err) {
      console.error('Error loading followers:', err);
    }
  };

  const loadFollowing = async () => {
    try {
      const data = await profilesAPI.getFollowing(username);
      setFollowing(data);
    } catch (err) {
      console.error('Error loading following:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'followers') {
      loadFollowers();
    } else if (activeTab === 'following') {
      loadFollowing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, username]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="cyber-loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="cyber-btn">Go Home</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            {userData.avatar_url ? (
              <img src={userData.avatar_url} alt={userData.username} className="profile-avatar-large" />
            ) : (
              <div className="profile-avatar-large">{userData.username[0].toUpperCase()}</div>
            )}
          </div>
          
          <div className="profile-info">
            <div className="profile-title-row">
              <h1 className="profile-username">@{userData.username}</h1>
              {!isOwnProfile && currentUser && (
                <button 
                  className={`cyber-btn ${isFollowing ? 'following' : 'follow'}`}
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                >
                  {followLoading ? (
                    'Loading...'
                  ) : isFollowing ? (
                    <><FaUserCheck /> Following</>
                  ) : (
                    <><FaUserPlus /> Follow</>
                  )}
                </button>
              )}
              {isOwnProfile && (
                <Link to="/profile/edit" className="cyber-btn">
                  <FaEdit /> Edit Profile
                </Link>
              )}
            </div>
            
            {userData.full_name && <h2 className="profile-fullname">{userData.full_name}</h2>}
            {userData.bio && <p className="profile-bio">{userData.bio}</p>}
            
            <div className="profile-meta">
              {userData.location && <span><FaMapMarkerAlt /> {userData.location}</span>}
              {userData.website && (
                <span>
                  <a href={userData.website} target="_blank" rel="noopener noreferrer">
                    🌐 Website
                  </a>
                </span>
              )}
              <span><FaCalendar /> Joined {formatDate(userData.created_at)}</span>
            </div>
            
            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{userData.posts_count}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item clickable" onClick={() => setActiveTab('followers')}>
                <span className="stat-number">{userData.followers_count}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item clickable" onClick={() => setActiveTab('following')}>
                <span className="stat-number">{userData.following_count}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'posts' && (
            <div className="profile-blogs">
              {blogs.length === 0 ? (
                <div className="empty-state">
                  <p>No posts yet</p>
                  {isOwnProfile && (
                    <Link to="/write" className="cyber-btn">Write your first post</Link>
                  )}
                </div>
              ) : (
                blogs.map(blog => (
                  <Link to={`/blog/${blog.id}`} key={blog.id} className="profile-blog-card">
                    {blog.cover_image_url && (
                      <div className="blog-card-cover">
                        <img src={blog.cover_image_url} alt={blog.title} />
                      </div>
                    )}
                    <div className="blog-card-content">
                      <h3>{blog.title}</h3>
                      {blog.excerpt && <p className="blog-excerpt">{blog.excerpt}</p>}
                      <div className="blog-stats">
                        <span><FaEye /> {blog.views_count} views</span>
                        <span><FaHeart /> {blog.likes_count} likes</span>
                        <span>📅 {formatDate(blog.published_at || blog.created_at)}</span>
                      </div>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="blog-tags">
                          {blog.tags.map((tag, idx) => (
                            <span key={idx} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="users-list">
              {followers.length === 0 ? (
                <div className="empty-state">
                  <FaUsers />
                  <p>No followers yet</p>
                </div>
              ) : (
                followers.map(follower => (
                  <Link to={`/profile/${follower.username}`} key={follower.id} className="user-card">
                    {follower.avatar_url ? (
                      <img src={follower.avatar_url} alt={follower.username} className="user-avatar" />
                    ) : (
                      <div className="user-avatar">{follower.username[0].toUpperCase()}</div>
                    )}
                    <div className="user-info">
                      <h4>@{follower.username}</h4>
                      {follower.bio && <p>{follower.bio}</p>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="users-list">
              {following.length === 0 ? (
                <div className="empty-state">
                  <FaUserFriends />
                  <p>Not following anyone yet</p>
                </div>
              ) : (
                following.map(user => (
                  <Link to={`/profile/${user.username}`} key={user.id} className="user-card">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="user-avatar" />
                    ) : (
                      <div className="user-avatar">{user.username[0].toUpperCase()}</div>
                    )}
                    <div className="user-info">
                      <h4>@{user.username}</h4>
                      {user.bio && <p>{user.bio}</p>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
