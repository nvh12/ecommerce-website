import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, InputGroup, Button, Dropdown, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
    const { productItems, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const searchInputRef = useRef(null);
    const suggestionRef = useRef(null);
    const filterRef = useRef(null);
    
    // Filter states
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    
    // State for categories and brands from backend
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories and brands from backend
    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            setLoading(true);
            try {
                // Fetch brands
                const brandResponse = await axios.get(`${backendUrl}/product/brand`);
                if (brandResponse.data && brandResponse.data.message === "Success") {
                    setBrands(brandResponse.data.brandFound || []);
                    console.log(brandResponse.data.brandFound);
                }
                //Fetch categories
                const categoryResponse = await axios.get(`${backendUrl}/product/category`);
                if (categoryResponse.data && categoryResponse.data.message === "Success") {
                    setCategories(categoryResponse.data.categoryFound || []);

                }
                
            } catch (error) {
                console.error('Error fetching categories and brands:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategoriesAndBrands();
    }, [backendUrl]);

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

    // Handle input focus to show filters
    const handleInputFocus = () => {
        setShowFilters(true);
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion.text);
        setShowSuggestions(false);
        handleSearch();
    };

    // Handle search submission
    const handleSearch = () => {
        if (searchTerm.trim() || category || brand || priceMin || priceMax) {
            let searchParams = new URLSearchParams();
            
            if (searchTerm.trim()) {
                searchParams.append('search', searchTerm.trim());
            }
            
            if (category) {
                searchParams.append('category', category);
            }
            
            if (brand) {
                searchParams.append('brand', brand);
            }
            
            if (priceMin) {
                searchParams.append('priceMin', priceMin);
            }
            
            if (priceMax) {
                searchParams.append('priceMax', priceMax);
            }
            
            navigate(`/search?${searchParams.toString()}`);
            setShowFilters(false);
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close suggestions when clicking outside
            if (suggestionRef.current && !suggestionRef.current.contains(event.target) && 
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            
            // Close filters when clicking outside
            if (filterRef.current && !filterRef.current.contains(event.target) && 
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowFilters(false);
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
        <div className="search-bar">
            <Form onSubmit={(e) => e.preventDefault()}>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={handleInputFocus}
                    />
                    <Button variant="primary" type="button" onClick={handleSearch}>
                        <i className="bi bi-search"></i>
                    </Button>
                </InputGroup>
            </Form>

            {showSuggestions && searchTerm && (
                <div className="search-suggestions">
                    {loading ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" size="sm" />
                            <span className="ms-2">Đang tìm kiếm...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            <div className="suggestion-header">
                                <small className="text-muted">Gợi ý tìm kiếm</small>
                            </div>
                            {suggestions.map((product, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSelectSuggestion(product)}
                                >
                                    <div className="suggestion-details">
                                        <div className="suggestion-name">
                                            {product.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="suggestion-footer">
                                <Button
                                    variant="link"
                                    className="w-100"
                                    onClick={handleSearch}
                                >
                                    Xem tất cả kết quả
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="no-suggestions">
                            Không tìm thấy sản phẩm nào phù hợp
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;