import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, Button, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './SearchBar.css';

const SearchBar = () => {
    const { productItems, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const suggestionRef = useRef(null);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortOrder, setSortOrder] = useState({ field: 'price', direction: 'desc' });

    // Extract unique categories, brands, and features from products
    const categories = [...new Set(productItems.flatMap(p => p.category || []))];
    const brands = [...new Set(productItems.map(p => p.brand).filter(Boolean))];
    const features = [...new Set(productItems.flatMap(p => p.features || []))];

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim().length > 1) {
            // Generate suggestions from product names, brands, and categories
            const productNameMatches = productItems
                .filter(p => p.productName.toLowerCase().includes(value.toLowerCase()))
                .map(p => ({ type: 'productName', text: p.productName }));
            
            const brandMatches = brands
                .filter(b => b.toLowerCase().includes(value.toLowerCase()))
                .map(b => ({ type: 'brand', text: b }));
            
            const categoryMatches = categories
                .filter(c => c.toLowerCase().includes(value.toLowerCase()))
                .map(c => ({ type: 'category', text: c }));
            
            const allSuggestions = [
                ...productNameMatches,
                ...brandMatches,
                ...categoryMatches
            ].slice(0, 6); // Limit to 6 suggestions
            
            setSuggestions(allSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        if (suggestion.type === 'brand') {
            setSelectedBrand(suggestion.text);
            setSearchTerm('');
        } else if (suggestion.type === 'category') {
            setSelectedCategory(suggestion.text);
            setSearchTerm('');
        } else {
            setSearchTerm(suggestion.text);
        }
        setShowSuggestions(false);
    };

    // Handle search submission
    const handleSearch = () => {
        let queryParams = new URLSearchParams();
        
        // Add search term if provided
        if (searchTerm.trim()) {
            queryParams.append('search', searchTerm.trim());
        }
        
        // Add category if selected
        if (selectedCategory) {
            queryParams.append('category', selectedCategory);
        }
        
        // Add brand if selected
        if (selectedBrand) {
            queryParams.append('brand', selectedBrand);
        }
        
        // Add features if selected
        if (selectedFeatures.length > 0) {
            selectedFeatures.forEach(feature => {
                queryParams.append('features', feature);
            });
        }
        
        // Add price range if provided
        if (priceRange.min) {
            queryParams.append('priceMin', priceRange.min);
        }
        if (priceRange.max) {
            queryParams.append('priceMax', priceRange.max);
        }
        
        // Add sort order
        if (sortOrder.field) {
            queryParams.append('order', sortOrder.field);
            queryParams.append('dir', sortOrder.direction);
        }
        
        // Navigate to search results page
        navigate(`/search?${queryParams.toString()}`);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
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

    // Toggle feature selection
    const toggleFeature = (feature) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setSelectedFeatures([]);
        setPriceRange({ min: '', max: '' });
        setSortOrder({ field: 'price', direction: 'desc' });
    };

    return (
        <div className="search-bar-container">
            <div className="search-input-container">
                <InputGroup>
                    <Form.Control
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                    />
                    <Button 
                        variant="primary" 
                        onClick={handleSearch}
                    >
                        <FaSearch />
                    </Button>
                    <Button 
                        variant={showFilters ? "success" : "outline-secondary"}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                    </Button>
                </InputGroup>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-container" ref={suggestionRef}>
                        {suggestions.map((suggestion, index) => (
                            <div 
                                key={index} 
                                className="suggestion-item"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                <span>
                                    {suggestion.text}
                                </span>
                                <Badge 
                                    bg={
                                        suggestion.type === 'productName' ? 'primary' : 
                                        suggestion.type === 'brand' ? 'info' : 
                                        'secondary'
                                    }
                                    className="ms-2"
                                >
                                    {suggestion.type === 'productName' ? 'Sản phẩm' : 
                                     suggestion.type === 'brand' ? 'Thương hiệu' : 
                                     'Danh mục'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Advanced filters */}
            {showFilters && (
                <div className="filters-container mt-3">
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="m-0">Bộ lọc tìm kiếm</h5>
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={clearFilters}
                        >
                            <FaTimes className="me-1" /> Xóa bộ lọc
                        </Button>
                    </div>
                    
                    <div className="row">
                        {/* Categories */}
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Select 
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        
                        {/* Brands */}
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Thương hiệu</Form.Label>
                                <Form.Select 
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                >
                                    <option value="">Tất cả thương hiệu</option>
                                    {brands.map((brand, index) => (
                                        <option key={index} value={brand}>
                                            {brand}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        
                        {/* Price range */}
                        <div className="col-md-6 mb-3">
                            <Form.Label>Khoảng giá</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    type="number"
                                    placeholder="Tối thiểu"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                    className="me-2"
                                />
                                <Form.Control
                                    type="number"
                                    placeholder="Tối đa"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-3">
                        <Form.Label>Tính năng</Form.Label>
                        <div className="features-list">
                            {features.map((feature, index) => (
                                <Badge 
                                    key={index}
                                    bg={selectedFeatures.includes(feature) ? "primary" : "light"}
                                    text={selectedFeatures.includes(feature) ? "white" : "dark"}
                                    className="me-2 mb-2 p-2 feature-badge"
                                    onClick={() => toggleFeature(feature)}
                                >
                                    {feature}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    
                    {/* Sorting options */}
                    <div className="mb-3">
                        <Form.Label>Sắp xếp theo</Form.Label>
                        <div className="d-flex">
                            <Form.Select 
                                value={sortOrder.field}
                                onChange={(e) => setSortOrder({...sortOrder, field: e.target.value})}
                                className="me-2"
                            >
                                <option value="price">Giá</option>
                                <option value="ratingsAvg">Đánh giá</option>
                                <option value="ratingsCount">Lượt đánh giá</option>
                                <option value="createdAt">Mới nhất</option>
                            </Form.Select>
                            <Button 
                                variant="outline-secondary"
                                onClick={() => setSortOrder({
                                    ...sortOrder, 
                                    direction: sortOrder.direction === 'asc' ? 'desc' : 'asc'
                                })}
                            >
                                {sortOrder.direction === 'asc' ? (
                                    <FaSortAmountUp />
                                ) : (
                                    <FaSortAmountDown />
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Apply filters button */}
                    <Button 
                        variant="primary" 
                        className="mt-2"
                        onClick={handleSearch}
                    >
                        <FaSearch className="me-2" /> Tìm kiếm
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SearchBar; 