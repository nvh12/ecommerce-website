import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import LoginScreen from './screens/loginScreen'

import './index.css'

const  App = () => {
  return (
    <Router>
      <Container className="py-3">
        <Route path="/login" exact component={LoginScreen} />
      </Container>
    </Router>
  )
}