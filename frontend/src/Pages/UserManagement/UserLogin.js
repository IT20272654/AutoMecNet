import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import GoogalLogo from './img/glogo.png';
import { Mail, Lock, LogIn } from 'lucide-react';

function UserLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userID', data.id);
                navigate('/learningSystem/allLearningPost');
            } else if (response.status === 401) {
                setError('Invalid email or password');
            } else {
                setError('Failed to login. Please try again.');
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
                        <h1 className="auth-heading">Welcome Back!</h1>
                        <p className="auth-subheading">
                            Unlock a world of education with a single click! Please login to your account.
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-form-group">
                            <label className="auth-label">
                                <Mail size={20} />
                                Email Address
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
                                <Lock size={20} />
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

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                            {!loading && <LogIn size={20} />}
                        </button>

                        <button
                            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                            className="auth-google-button"
                        >
                            <img src={GoogalLogo} alt="Google logo" />
                            Sign in with Google
                        </button>

                        <p className="auth-signup-prompt">
                            Don't have an account?{' '}
                            <span onClick={() => navigate('/register')} className="auth-signup-link">
                                Sign up for free
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
