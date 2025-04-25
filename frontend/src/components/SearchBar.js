import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './SearchBar.css';

const SearchBar = () => {
    const { productItems } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchInputRef = useRef(null);
    const suggestionRef = useRef(null);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim().length > 1) {
            // Generate suggestions from product names
            const productNameMatches = productItems
                .filter(p => p.productName.toLowerCase().includes(value.toLowerCase()))
                .map(p => ({ text: p.productName }))
                .slice(0, 6); // Limit to 6 suggestions
            
            setSuggestions(productNameMatches);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion.text);
        setShowSuggestions(false);
        handleSearch();
    };

    // Handle search submission
    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target) && 
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="tgdd-search-container">
            <div className="search-input-wrapper" ref={searchInputRef}>
                <InputGroup className="tgdd-search-input-group">
                    <Form.Control
                        placeholder="Bạn tìm gì..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="tgdd-search-input"
                    />
                    <div className="search-icon-wrapper" onClick={handleSearch}>
                        <FaSearch className="search-icon" />
                    </div>
                </InputGroup>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="tgdd-suggestions-container" ref={suggestionRef}>
                        {suggestions.map((suggestion, index) => (
                            <div 
                                key={index} 
                                className="tgdd-suggestion-item"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                <FaSearch className="suggestion-icon" />
                                <span className="suggestion-text">
                                    {suggestion.text}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar; 