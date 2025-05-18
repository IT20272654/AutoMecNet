import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { User, Mail, Phone, KeyRound, X, Plus, ArrowRight } from 'lucide-react';

function UserRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: '',
        skills: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSkillChange = (e) => {
        setNewSkill(e.target.value);
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else if (response.status === 409) {
                setError('Email already exists!');
            } else {
                setError('Failed to register user. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-inner-container">
                <div className="auth-image" />
                <div className="auth-content">
                <h1 className="auth-heading">AutoMecNet</h1>
                    <div className="login-content">
                        <h1 className="auth-heading">Create Your Account</h1>
                        <p className="auth-subheading">
                            Join our community and start your journey
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <X size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-form-group">
                            <label className="auth-label">
                                <User size={20} />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Enter your full name"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">
                                <Mail size={20} />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">
                                <Phone size={20} />
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={(e) => {
                                    const re = /^[0-9\b]{0,10}$/;
                                    if (re.test(e.target.value)) {
                                        handleInputChange(e);
                                    }
                                }}
                                maxLength="10"
                                pattern="[0-9]{10}"
                                title="Please enter exactly 10 digits"
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">
                                <KeyRound size={20} />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Skills</label>
                            <div className="skills-container">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="skill-tag">
                                        {skill}
                                        <X
                                            size={16}
                                            className="delete-icon"
                                            onClick={() => removeSkill(skill)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="skill-input-group">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={handleSkillChange}
                                    placeholder="Add a skill"
                                    className="auth-input"
                                />
                                <button
                                    type="button"
                                    className="add-skill-button"
                                    onClick={addSkill}
                                    disabled={!newSkill.trim()}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            {!loading && <ArrowRight size={20} />}
                        </button>

                        <p className="auth-signup-prompt">
                            Already have an account?{' '}
                            <button 
                                onClick={() => navigate('/')} 
                                className="auth-signup-link"
                            >
                                Login
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserRegister;
