import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';

function AllLearningPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showingMyPosts, setShowingMyPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningSystem');
        setPosts(response.data);
        setFilteredPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
      }
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningSystem/${id}`);
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
        setPosts(posts.filter((post) => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleLike = async (postId) => {
    if (!userId) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/learningSystem/${postId}/like`, null, {
        params: { userID: userId },
      });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts(prevFilteredPosts =>
        prevFilteredPosts.map(post =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const filterMyPosts = () => {
    if (!showingMyPosts) {
      const myPosts = posts.filter((post) => post.postOwnerID === userId);
      setFilteredPosts(myPosts);
      setShowingMyPosts(true);
    } else {
      setFilteredPosts(posts);
      setShowingMyPosts(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="learning-posts-container">
      <NavBar />
      <div className="posts-header">  
        <h1 style={{ color: "#102E50" }}>AutoEdu</h1>
      </div>    
      <div className="posts-controls">
        <button
          className={`filter-button ${showingMyPosts ? 'active' : ''}`}
          onClick={filterMyPosts}
        >
          {showingMyPosts ? 'All Posts' : 'My Posts'}
        </button>
        <button
          className="create-button"
          onClick={() => (window.location.href = '/learningSystem/addLeariningPost')}
        >
          <IoMdAdd /> Create Post
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>{showingMyPosts ? 'You haven\'t created any posts yet' : 'No posts available'}</p>
          {/* <button
            className="create-button"
            onClick={() => (window.location.href = '/learningSystem/addLeariningPost')}
          >
            <IoMdAdd /> Create New Post
          </button> */}
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-info">
                  <div className="avatar">
                    {post.postOwnerName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4>{post.postOwnerName || 'Unknown User'}</h4>
                    <span className="post-time">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                
                {post.postOwnerID === userId && (
                  <div className="post-actions">
                    <button 
                      className="icon-button edit"
                      onClick={() => (window.location.href = `/learningSystem/updateLearningPost/${post.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="icon-button delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-description">{post.description}</p>
                
                {post.tags?.length > 0 && (
                  <div className="tags-container">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
                
                {post.contentURL && (
                  <div className="video-container">
                    <iframe
                      src={getEmbedURL(post.contentURL)}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
              
              <div className="post-footer">
                <button 
                  className={`like-button ${post.likes?.[userId] ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  {post.likes?.[userId] ? <BiSolidLike /> : <BiLike />}
                  <span>{Object.values(post.likes || {}).filter(Boolean).length}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllLearningPost;