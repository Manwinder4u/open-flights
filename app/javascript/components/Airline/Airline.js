import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Header from './Header'
import ReviewForm from './ReviewForm'
import Review from './Review'
import Navbar from '../Navbar'
import styled from 'styled-components'


const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`

const Column = styled.div`
  background: #fff; 
  max-width: 50%;
  width: 50%;
  float: left; 
  height: 100vh;
  overflow-x: scroll;
  overflow-y: scroll; 
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &:last-child {
    background: black;
    border-top: 1px solid rgba(255,255,255,0.5);
  }
`

const Main = styled.div`
  padding-left: 60px;
`

const Airline = (props) => {
  const [airline, setAirline] = useState({})
  const [review, setReview] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(()=> {
    const slug = props.match.params.slug
    const url = `/api/v1/airlines/${slug}`

    axios.get(url)
    .then(response => {
      setAirline(response.data)
      setLoaded(true)
    })
    .catch(response => console.log(response))
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    //setAirline({})
    setReview( Object.assign({}, review, {[e.target.name]: e.target.value}) )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const airline_id = airline.data.id
    axios.post('/api/v1/reviews', {...review, airline_id})
    .then( (response) => {
      const included = [...airline.included, response.data.data]
      setAirline({...airline, included})
      setReview({title: '', description:'', score:0}) // empty the fields after each post request
    })
    .catch()
  }

  const setRating = (score, e) => {
    setReview({...review, score})
  }

  let reviews
  if(loaded && airline.included) {
    reviews = airline.included.map( (item, index) => {
      return (
        <Review
          key={index}
          attributes={item.attributes}
        />
      )
    })
  }

  return (
    <Wrapper>
      {
        loaded &&
        <Fragment>
          <Column>
            <Main>
              <Header attributes={airline.data.attributes} reviews={airline.included}/>
              {reviews}
            </Main>
          </Column>
          <Column>
            <ReviewForm
              handleChange={handleChange} 
              handleSubmit={handleSubmit} 
              attributes={airline.data.attributes} 
              review={review}
              setRating={setRating}
            />
          </Column>
        </Fragment>
      }
    </Wrapper>
  )
}

export default Airline