import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('innerwhispers_token');
    if (token) {
      console.log('[API DEBUG] Sending request with token:', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API DEBUG] No token found in localStorage!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem('innerwhispers_token');
      localStorage.removeItem('innerwhispers_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================

export const authAPI = {
  signup: async (email, password, username, full_name = '') => {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      username,
      full_name,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// ==================== Blogs API ====================

export const blogsAPI = {
  getBlogs: async (params = {}) => {
    const response = await apiClient.get('/blogs/', { params });
    return response.data;
  },

  getBlog: async (blogId) => {
    const response = await apiClient.get(`/blogs/${blogId}`);
    return response.data;
  },

  createBlog: async (blogData) => {
    const response = await apiClient.post('/blogs/', blogData);
    return response.data;
  },

  updateBlog: async (blogId, blogData) => {
    const response = await apiClient.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },

  deleteBlog: async (blogId) => {
    const response = await apiClient.delete(`/blogs/${blogId}`);
    return response.data;
  },

  recordView: async (blogId) => {
    const response = await apiClient.post(`/blogs/${blogId}/view`);
    return response.data;
  },

  likeBlog: async (blogId) => {
    const response = await apiClient.post(`/blogs/${blogId}/like`);
    return response.data;
  },

  unlikeBlog: async (blogId) => {
    const response = await apiClient.delete(`/blogs/${blogId}/like`);
    return response.data;
  },
};

// ==================== Profiles API ====================

export const profilesAPI = {
  searchUsers: async (query, params = {}) => {
    const response = await apiClient.get('/profiles/search/users', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  getProfile: async (username) => {
    const response = await apiClient.get(`/profiles/${username}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profiles/me', profileData);
    return response.data;
  },

  getUserBlogs: async (username, params = {}) => {
    const response = await apiClient.get(`/profiles/${username}/blogs`, { params });
    return response.data;
  },

  followUser: async (username) => {
    const response = await apiClient.post(`/profiles/${username}/follow`);
    return response.data;
  },

  unfollowUser: async (username) => {
    const response = await apiClient.delete(`/profiles/${username}/follow`);
    return response.data;
  },

  getFollowers: async (username, params = {}) => {
    const response = await apiClient.get(`/profiles/${username}/followers`, { params });
    return response.data;
  },

  getFollowing: async (username, params = {}) => {
    const response = await apiClient.get(`/profiles/${username}/following`, { params });
    return response.data;
  },

  checkIsFollowing: async (username) => {
    const response = await apiClient.get(`/profiles/${username}/is-following`);
    return response.data;
  },
};

// ==================== Comments API ====================

export const commentsAPI = {
  getComments: async (blogId, params = {}) => {
    const response = await apiClient.get(`/comments/blog/${blogId}`, { params });
    return response.data;
  },

  getComment: async (commentId) => {
    const response = await apiClient.get(`/comments/${commentId}`);
    return response.data;
  },

  createComment: async (blogId, content, parentCommentId = null) => {
    const response = await apiClient.post(`/comments/?blog_id=${blogId}`, {
      content,
      parent_comment_id: parentCommentId,
    });
    return response.data;
  },

  updateComment: async (commentId, content) => {
    const response = await apiClient.put(`/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default apiClient;
