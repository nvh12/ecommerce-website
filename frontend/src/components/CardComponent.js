import { Card } from "react-bootstrap";
import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";

function CardComponent(props) {
    return (
        <Card className='card' style={{width: "18rem"}}>
            <Card.Img className="card-img-top" src={props.image} alt='' height='200' style={{ objectFit: "cover" }}/>
            <Card.Body className='card-body'>
                <Card.Title className='card-title'>{props.title}</Card.Title>  
                <Card.Text className='card-text'>{props.description}</Card.Text>
                <Button className='btn btn-primary'>{props.button}</Button>
            </Card.Body>
        </Card>
    );
}

export default CardComponent;