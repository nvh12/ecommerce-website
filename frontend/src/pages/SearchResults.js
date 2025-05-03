import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner, Card, Button } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/NavigationButtons.css';

const SearchResults = () => {
    const { backendUrl } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                // Convert search params to query string
                const queryString = searchParams.toString();
                const { data } = await axios.get(`${backendUrl}/product?${queryString}`);

                if (data.message === "Success") {
                    setSearchResults(data.product || []);
                } else {
                    setError('Không tìm thấy kết quả phù hợp');
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('Đã xảy ra lỗi khi tìm kiếm');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchParams, backendUrl]);

    // Build search description
    const getSearchDescription = () => {
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        
        let desc = 'Kết quả tìm kiếm cho ';
        
        if (search) {
            desc += `"${search}" `;
        }
        
        if (category) {
            desc += `trong danh mục "${category}" `;
        }
        
        if (brand) {
            desc += `của thương hiệu "${brand}" `;
        }
        
        if (priceMin && priceMax) {
            desc += `với giá từ ${Number(priceMin).toLocaleString()}₫ đến ${Number(priceMax).toLocaleString()}₫`;
        } else if (priceMin) {
            desc += `với giá từ ${Number(priceMin).toLocaleString()}₫`;
        } else if (priceMax) {
            desc += `với giá đến ${Number(priceMax).toLocaleString()}₫`;
        }
        
        return desc;
    };

    return (
        <div>
            <Header />
            <Container className="py-4">
                
                <h3 className="mb-4">{getSearchDescription()}</h3>
                
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Đang tìm kiếm...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <Card className="text-center py-5">
                        <Card.Body>
                            <Card.Title>{error}</Card.Title>
                            <Button 
                                className="nav-button home-button mx-auto"
                                onClick={() => navigate('/')}
                            >
                                <i className="bi bi-house-door"></i>
                                Quay về trang chủ
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <>
                        <p className="text-muted mb-4">
                            Tìm thấy {searchResults.length} kết quả
                        </p>
                        
                        <Row xs={2} md={3} lg={4} className="g-4">
                            {searchResults.map((product) => (
                                <Col key={product._id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default SearchResults; 