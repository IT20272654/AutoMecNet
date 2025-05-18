import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
    Edit2, 
    Type, 
    Link, 
    Tag, 
    X, 
    Plus, 
    FileText,
    Send
} from 'lucide-react';
import './UpdateLearningPost.css';
import SideBar from '../../Components/SideBar/SideBar';

function UpdateLearningPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learningSystem/${id}`);
        const { title, description, contentURL, tags } = response.data;
        setTitle(title);
        setDescription(description);
        setContentURL(contentURL);
        setTags(tags);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPost = { title, description, contentURL, tags };
    try {
      await axios.put(`http://localhost:8080/learningSystem/${id}`, updatedPost);
      alert('Post updated successfully!');
      window.location.href = '/learningSystem/allLearningPost';
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  return (
    <div className="update-learning-container">
      <SideBar />
      <div className="update-learning-content">
        <div className="form-container">
          <h1 className="form-title">
            <Edit2 size={24} />
            Update Learning Post
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
                      onClick={() => handleDeleteTag(index)}
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
              />
            </div>

            <button type="submit" className="submit-button">
              <Send size={18} />
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateLearningPost;
