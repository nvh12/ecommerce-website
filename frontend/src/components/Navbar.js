import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const NavbarComponent = ({ onCategoryChange, activeCategory }) => {
  const navigate = useNavigate();

  // Main categories for the compact navbar
  const mainCategories = [
    { id: 1, name: 'Điện thoại', path: '/category/phone', value: 'phone' },
    { id: 2, name: 'Laptop', path: '/category/laptop', value: 'laptop' },
    { id: 3, name: 'Phụ kiện', value: 'accessories', isDropdown: true, items: [
      { name: 'Chuột', path: '/category/mouse',value:'mouse' },
      { name: 'Bàn phím', path: '/category/keyboard' ,value:'keyboard'}
    ]},
    { id: 4, name: 'Smartwatch', path: '/category/smartwatch', value: 'smartwatch' },
    { id: 5, name: 'Đồng hồ', path: '/category/watch', value: 'watch' },
    { id: 6, name: 'Tablet', path: '/category/tablet', value: 'tablet' },
    { id: 7, name: 'Màn hình, Máy in', value: 'peripherals', isDropdown: true, items: [
      { name: 'Màn hình', path: '/category/screen' },
      { name: 'Máy in', path: '/category/printer' }
    ]},
  ];

  // Handle category change without full page reload
  const handleCategoryClick = (category, event) => {
    if (onCategoryChange && !category.isDropdown) {
      event.preventDefault();
      onCategoryChange(category.value);
      
      // Update URL without page reload
      navigate(`/category/${category.value}`, { replace: true });
    }
  };

  // Handle dropdown item click
  const handleDropdownItemClick = (path, event) => {
    // Allow normal link navigation for dropdown items
    navigate(path);
  };

  return (
    <Navbar bg="warning" expand="lg" className="compact-navbar py-0">
      <Container fluid className="d-flex justify-content-center px-2">
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="compact-nav">
            {mainCategories.map(category => 
              category.isDropdown ? (
                <NavDropdown 
                  key={category.id} 
                  title={category.name} 
                  id={`nav-dropdown-${category.id}`}
                  className="compact-dropdown"
                  align="start"
                >
                  {category.items.map((item, index) => (
                    <NavDropdown.Item 
                      key={index} 
                      as={Link} 
                      to={item.path}
                      onClick={(e) => handleDropdownItemClick(item.path, e)}
                      active={false}
                    >
                      {item.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              ) : (
                <Nav.Link 
                  key={category.id} 
                  as={Link} 
                  to={category.path}
                  className={activeCategory === category.value ? 'active' : ''}
                  onClick={(e) => handleCategoryClick(category, e)}
                >
                  {category.name}
                </Nav.Link>
              )
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent; 