import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Navbar.css';

const NavbarComponent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       // Replace with your actual API endpoint
  //       const response = await axios.get('https://api.example.com/categories');
  //       setCategories(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Failed to fetch categories');
  //       setLoading(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // Static categories for demonstration
  const staticCategories = {
    tabs: [
      { id: 1, name: 'Phone', path: '/phone' },
      { id: 2, name: 'Laptop', path: '/laptop' },
      { id: 3, name: 'Tablet', path: '/tablet' },
      { id: 4, name: 'Smartwatch', path: '/smartwatch' },
      { id: 5, name: 'Watch', path: '/watch' }
    ],
    dropdowns: [
      {
        id: 1,
        title: 'Accessories',
        items: ['Smartphones', 'Laptops', 'Tablets', 'Accessories']
      },
      {
        id: 2,
        title: 'Old Items',
        items: ['Men', 'Women', 'Kids', 'Accessories']
      },
      {
        id: 3,
        title: 'Screens & Printers',
        items: ['Furniture', 'Decor', 'Kitchen', 'Bath']
      },
      {
        id: 4,
        title: 'Services',
        items: ['Fitness', 'Outdoor', 'Team Sports', 'Equipment']
      },
      {
        id: 5,
        title: 'Cards',
        items: ['Fiction', 'Non-Fiction', 'Educational', 'Magazines']
      }
    ]
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        {/* <Navbar.Brand as={Link} to="/">Your Store</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Tabs */}
            {staticCategories.tabs.map(tab => (
              <Nav.Link key={tab.id} as={Link} to={tab.path}>
                {tab.name}
              </Nav.Link>
            ))}

            {/* Dropdowns */}
            {staticCategories.dropdowns.map(dropdown => (
              <NavDropdown 
                key={dropdown.id} 
                title={dropdown.title} 
                id={`nav-dropdown-${dropdown.id}`}
                className="nav-dropdown"
              >
                {dropdown.items.map((item, index) => (
                  <NavDropdown.Item 
                    key={index} 
                    as={Link} 
                    to={`/category/${dropdown.title.toLowerCase()}/${item.toLowerCase()}`}
                  >
                    {item}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            ))}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent; 