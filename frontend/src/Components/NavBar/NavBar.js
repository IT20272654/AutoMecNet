import React, { useEffect, useState } from 'react';
import { 
  User, 
  LogOut, 
  Bell, 
  BellRing, 
  Settings, 
  UserCircle, 
  Trash2, 
  Edit2, 
  BookOpenText, 
  Car, 
  Home, 
  Info, 
  BookOpen, 
  MessageSquare 
} from 'lucide-react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar() {
    const [showCard, setShowCard] = useState(false);
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const userId = localStorage.getItem('userID');
    const location = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('userID');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={styles.navContainer}>
            <div className={styles.navContent}>
                <div className={styles.brandContainer}>
                    <Car className={styles.brandIcon} size={28} />
                    <Link to="/learningSystem/allLearningPost" className={styles.brandName}>AutoMecNet</Link>
                </div>

                <div className={styles.navLinks}>

                    <Link 
                        to="/learningSystem/allLearningPost" 
                        className={`${styles.navLink} ${isActive('/learningSystem/allLearningPost') ? styles.navLinkActive : ''}`}
                    >
                        <BookOpen size={18} className={styles.navIcon} />
                        <span>EduStream</span>
                    </Link>
                    <Link 
                        to="/allPost" 
                        className={`${styles.navLink} ${isActive('/allPost') ? styles.navLinkActive : ''}`}
                    >
                        <MessageSquare size={18} className={styles.navIcon} />
                        <span>BoostPost</span>
                    </Link>
                    <Link 
                        to="/about" 
                        className={`${styles.navLink} ${isActive('/about') ? styles.navLinkActive : ''}`}
                    >
                        <Info size={18} className={styles.navIcon} />
                        <span>About Us</span>
                    </Link>
                </div>

                <div className={styles.userControls}>
                    <Link 
                        to="/settings" 
                        className={`${styles.iconButton} ${isActive('/settings') ? styles.active : ''}`}
                        aria-label="Settings"
                    >
                        <Settings size={22} />
                    </Link>
                    <button 
                        className={`${styles.iconButton} ${showCard ? styles.active : ''}`} 
                        onClick={() => setShowCard(!showCard)}
                        aria-label="User profile"
                    >
                        <User size={22} />
                    </button>
                    <button 
                        className={styles.iconButton}
                        onClick={handleLogout}
                        aria-label="Log out"
                    >
                        <LogOut size={22} />
                    </button>
                </div>

                {showCard && userData && (
                    <div className={styles.profileCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.userAvatar}>
                                <UserCircle size={40} />
                            </div>
                            <h3>{userData.fullname}</h3>
                            <p>{userData.email}</p>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Phone:</span>
                                <p className={styles.infoValue}>{userData.phone}</p>
                            </div>
                            {userData.skills && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Skills:</span>
                                    <p className={styles.infoValue}>{userData.skills.join(', ')}</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.cardFooter}>
                            <button 
                                className={styles.primaryButton}
                                onClick={() => (window.location.href = `/updateUserProfile/${userId}`)}
                            >
                                <Edit2 size={16} style={{ marginRight: '8px' }} />
                                Update Profile
                            </button>
                            <button
                                className={styles.dangerButton}
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete your profile?')) {
                                        axios.delete(`http://localhost:8080/user/${userId}`)
                                            .then(() => {
                                                alert('Profile deleted successfully!');
                                                handleLogout();
                                            })
                                            .catch(error => console.error('Error deleting profile:', error));
                                    }
                                }}
                            >
                                <Trash2 size={16} style={{ marginRight: '8px' }} />
                                Delete Profile
                            </button>
                        </div>
                    </div>
                )}

                {showNotifications && (
                    <div className={styles.notificationsCard}>
                        <div className={styles.notificationsHeader}>
                            <h3>Notifications</h3>
                            <Settings size={18} className={styles.settingsIcon} />
                        </div>
                        {notifications.length > 0 ? (
                            <div className={styles.notificationsList}>
                                {notifications.map((notification, index) => (
                                    <div key={index} className={styles.notificationItem}>
                                        <p>{notification.message}</p>
                                        <span className={styles.notificationTime}>{notification.time}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noNotifications}>
                                <p>No new notifications</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;