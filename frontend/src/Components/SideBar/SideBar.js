import React from 'react';
import './SideBar.css';
import NavBar from '../NavBar/NavBar';
import { BookOpen, MessageSquare, Home, Settings, LogOut } from 'lucide-react';

function SideBar() {
    const currentPath = window.location.pathname;

    return (
        <div className="sidebar-container">
            <div className='nav_con'>
                <NavBar />
            </div>
            <div className='side_bar'>
                <div className='side_bar_nav_item_con'>
                    <div
                        className={`side_bar_nav_item ${currentPath === '/learningSystem/allLearningPost' ? 'side_bar_nav_item--active' : ''}`}
                        onClick={() => (window.location.href = '/learningSystem/allLearningPost')}
                    >
                        <BookOpen size={20} className="nav-icon" />
                        <span>Auto Edu</span>
                    </div>
                    <div
                        className={`side_bar_nav_item ${currentPath === '/allPost' ? 'side_bar_nav_item--active' : ''}`}
                        onClick={() => (window.location.href = '/allPost')}
                    >
                        <MessageSquare size={20} className="nav-icon" />
                        <span>BoostPost</span>
                    </div>
                    <div className="sidebar-divider"></div>
                    <div className="sidebar-bottom">
                        <div className="sidebar-bottom-item">
                            <Home size={20} className="nav-icon" />
                            <span>Home</span>
                        </div>
                        <div className="sidebar-bottom-item">
                            <Settings size={20} className="nav-icon" />
                            <span>Settings</span>
                        </div>
                        <div 
                            className="sidebar-bottom-item"
                            onClick={() => {
                                localStorage.removeItem('userID');
                                localStorage.removeItem('userType');
                                window.location.href = '/';
                            }}
                        >
                            <LogOut size={20} className="nav-icon" />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
