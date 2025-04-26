import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
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
                    setCategories(categoryResponse.data.category || []);
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
        <div className="tgdd-search-container">
            <div className="search-input-wrapper" ref={searchInputRef}>
                <InputGroup className="tgdd-search-input-group">
                    <Form.Control
                        placeholder="Bạn tìm gì..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
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
                
                {/* Filter dropdown */}
                {showFilters && (
                    <div className="tgdd-filter-container" ref={filterRef}>
                        <div className="filter-header">
                            <h6><FaFilter /> Bộ lọc tìm kiếm</h6>
                        </div>
                        <Form className="filter-form">
                            <Form.Group className="mb-3">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Thương hiệu</Form.Label>
                                <Form.Select 
                                    value={brand} 
                                    onChange={(e) => setBrand(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {brands.map((b, index) => (
                                        <option key={b._id} value={b.name}>{b.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Khoảng giá</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="number"
                                        placeholder="Từ"
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(e.target.value)}
                                    />
                                    <span className="align-self-center">-</span>
                                    <Form.Control
                                        type="number"
                                        placeholder="Đến"
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(e.target.value)}
                                    />
                                </div>
                            </Form.Group>
                            
                            <div className="d-flex justify-content-end gap-2">
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={() => {
                                        setCategory('');
                                        setBrand('');
                                        setPriceMin('');
                                        setPriceMax('');
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={handleSearch}
                                >
                                    Áp dụng
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar; 