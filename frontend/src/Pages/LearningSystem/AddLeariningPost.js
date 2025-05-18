import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    PlusCircle, 
    Type, 
    Link, 
    Tag, 
    X, 
    Plus, 
    FileText,
    Send,
    AlertCircle
} from 'lucide-react';
import './AddLearningPost.css';
import NavBar from '../../Components/NavBar/NavBar';



function AddLeariningPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');
    
    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/'); 
      return;
    }

    const isValid = tags.length >= 2; 
    if (!isValid) {
      alert("Please add at least two tags.");
      return;
    }

    const newPost = { title, description, contentURL, tags, postOwnerID, postOwnerName }; 
    console.log('Data being sent:', newPost); 
    
    try {
      await axios.post('http://localhost:8080/learningSystem', newPost);
      alert('Post added successfully!');
      setTitle('');
      setDescription('');
      setContentURL('');
      setTags([]);
      window.location.href = '/learningSystem/allLearningPost';
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    }
  };

  return (
    <div className="add-learning-container">
      <NavBar />
      <div className="add-learning-content">
        <div className="form-container">
          <h1 className="form-title">
            <PlusCircle size={24} />
            Add Learning Post
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Type size={16} />
                Title
              </label>
              <input
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter post title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Link size={16} />
                Content URL
              </label>
              <input
                className="form-input"
                type="url"
                value={contentURL}
                onChange={(e) => setContentURL(e.target.value)}
                required
                placeholder="Enter content URL"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Tag size={16} />
                Tags
              </label>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="tag-input-container">
                <input
                  className="form-input tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  className="add-tag-button"
                  onClick={handleAddTag}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              <div className={`tag-requirement ${tags.length >= 2 ? 'success' : 'error'}`}>
                <AlertCircle size={14} />
                {tags.length >= 2 
                  ? 'Minimum tag requirement met' 
                  : 'Please add at least 2 tags'}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Description
              </label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Write your post description..."
              />
            </div>

            <button type="submit" className="submit-button">
              <Send size={18} />
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLeariningPost;
