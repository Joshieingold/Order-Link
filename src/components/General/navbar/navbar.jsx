import { useState } from 'react';
import './navbar.css'; // Make sure this CSS is present
import Logo from "../../../assets/logo.png"; // Adjust the path to your logo image
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="logo-container" onClick={toggleMenu}>
                <img src={Logo} alt="Logo" className="logo" />
            </div>
            <div className={`nav-links ${isOpen ? 'show' : ''}`}>
                <Link to="/Home" className="nav-link">Home</Link>
                <Link to="/Orders" className="nav-link">Orders</Link>
                <Link to="/prod" className='nav-link'>Production</Link>
                <Link to="/Contractors" className="nav-link">Contractors</Link>
                <Link to="/Storage" className="nav-link">Storage</Link>
                <Link to="/" className='nav-link'>Logout</Link>
            </div>
        </div>
    );
};
