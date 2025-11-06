import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaUserCheck, FaTimes } from 'react-icons/fa';
import { profilesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';
import './UserSearch.css';

function UserSearch({ onClose }) {
  const { user } = useAuth();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    // Remove @ if present for the actual search
    const query = searchQuery.startsWith('@') ? searchQuery.slice(1) : searchQuery;
    
    if (query.trim().length >= 2) {
      const delayDebounce = setTimeout(() => {
        searchUsers(query);
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const searchUsers = async (query) => {
    try {
      setLoading(true);
      const results = await profilesAPI.searchUsers(query);
      setUsers(results);
      
      // Initialize following states
      const states = {};
      results.forEach(u => {
        states[u.username] = u.is_following || false;
      });
      setFollowingStates(states);
      
      setLoading(false);
    } catch (err) {
      console.error('Error searching users:', err);
      setLoading(false);
    }
  };

  const handleFollow = async (username) => {
    if (!user) {
      toast.warning('Please login to follow users');
      return;
    }

    try {
      const isFollowing = followingStates[username];
      
      if (isFollowing) {
        await profilesAPI.unfollowUser(username);
        toast.success('Unfollowed successfully');
        setFollowingStates(prev => ({ ...prev, [username]: false }));
      } else {
        await profilesAPI.followUser(username);
        toast.success('Following!');
        setFollowingStates(prev => ({ ...prev, [username]: true }));
      }
      
      // Update user in list
      setUsers(prev => prev.map(u => 
        u.username === username 
          ? { ...u, followers_count: u.followers_count + (isFollowing ? -1 : 1) }
          : u
      ));
    } catch (err) {
      console.error('Error toggling follow:', err);
      toast.error(err.response?.data?.detail || 'Failed to update follow status');
    }
  };

  return (
    <div className="user-search-overlay" onClick={onClose}>
      <div className="user-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <h2>Search Users</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              let value = e.target.value;
              // Ensure it starts with @
              if (value && !value.startsWith('@')) {
                value = '@' + value;
              }
              setSearchQuery(value);
            }}
            placeholder="@username or name..."
            className="cyber-input"
            autoFocus
          />
        </div>

        <div className="search-results">
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : searchQuery.trim().length < 3 ? (
            <div className="search-hint">Type @username to search (at least 2 characters after @)</div>
          ) : users.length === 0 ? (
            <div className="search-no-results">No users found</div>
          ) : (
            <div className="users-list">
              {users.map((searchedUser) => (
                <div key={searchedUser.id} className="user-item">
                  <Link 
                    to={`/profile/${searchedUser.username}`} 
                    className="user-info"
                    onClick={onClose}
                  >
                    <img 
                      src={searchedUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${searchedUser.username}`}
                      alt={searchedUser.username}
                      className="user-avatar"
                    />
                    <div className="user-details">
                      <h4 className="user-name">
                        {searchedUser.full_name || searchedUser.username}
                      </h4>
                      <p className="user-username">@{searchedUser.username}</p>
                      <p className="user-stats">
                        {searchedUser.followers_count} followers · {searchedUser.posts_count} posts
                      </p>
                    </div>
                  </Link>
                  
                  {user && user.username !== searchedUser.username && (
                    <button
                      className={`follow-btn ${followingStates[searchedUser.username] ? 'following' : ''}`}
                      onClick={() => handleFollow(searchedUser.username)}
                    >
                      {followingStates[searchedUser.username] ? (
                        <>
                          <FaUserCheck /> Following
                        </>
                      ) : (
                        <>
                          <FaUserPlus /> Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSearch;
