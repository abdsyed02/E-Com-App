import React from 'react'
import '../UBLends/style.css'
import '../App.css'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
import logo from '../UBLends/images/logo.png'
import UploadProfilePic from './UploadProfilePic.jsx'

const options = [
  {
    label: 'Click and chose user rating.',
    value: 'notSpecified',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
]

export default class CreateListing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: '',
      select: 'Click and chose user rating.',
      price: '',
      con: '',
      desc: '',
      postmessage: '',
      image: '',
    }
  }

  componentDidMount() {
    fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads/', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((val) => {
        var profile = 0
        val[0].forEach((value) => {
          if (value.uploaderID === parseInt(sessionStorage.getItem('user'))) {
            if (value.attributes?.profilePicture === true) {
              this.setState({
                image: `https://webdev.cse.buffalo.edu${value.path}`,
                fileID: `/${value.id}`,
              })
            }
          }
        })
      })
      .catch((error) => console.log('error', error))
  }

  uploadProfilePic = () => {
    console.log(sessionStorage.getItem('user'), sessionStorage.getItem('token'))
  }

  itemHandlerChange = (event) => {
    this.setState({
      item: event.target.value,
    })
  }

  selectHandlerChange = (event) => {
    this.setState({
      select: event.target.value,
    })
  }

  conditionHandlerChange = (event) => {
    this.setState({
      con: event.target.value,
    })
  }

  descHandlerChange = (event) => {
    this.setState({
      desc: event.target.value,
    })
  }

  posting = (e) => {
    e.preventDefault()
  
    fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/posts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem('user'),
        /*parentID: sessionStorage.getItem("visit"),*/
        content: this.state.select + '**ratings',
        recipientUserID: sessionStorage.getItem('visit'),
        attributes: {
          item: '',
          select: this.state.select,
          con: '',
          desc: this.state.desc,
        },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            postmessage: result.Status,
          })
          alert('Comment post was successful')
          window.location = sessionStorage.getItem('backPath')
          // once a post is complete, reload the feed (does not work yet)
          //this.postListing.current.loadPosts();
        },
        (error) => {
          alert('ERROR idk' + error)
        }
      )
  }
  onLogout = () => {
    this.props.logout()
  }

  render() {
    const { error, isLoaded } = this.state
    return this.state.showPopup ? (
      <UploadProfilePic />
    ) : (
      <body background='images/background.png'>
        <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>
        <link rel="stylesheet" href="style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@800&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@400&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&display=swap" rel="stylesheet" /> 
        
        <link
          href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
          rel='stylesheet'
        ></link>
                <link rel="stylesheet" href="style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@800&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@400&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&display=swap" rel="stylesheet" /> 
          <div id='Navbar' class='imgnavbar'>
            <div class='rightnavimg'>
              <a>
                <li id='Drop down Nav' class='navitemdrop'>
                  <img
                    class='rightimgresize'
                    src={this.state.image}
                    alt='Profile dropdown'
                  ></img>
                  <div class='dropdown-content'>
                      <Link id='Profile' to='/profile'>Profile</Link>
                      <Link id='My Posts' to='/myPosts'>My Posts</Link>
                      <Link id='Logout' to='/' onClick={this.onLogout}>Logout</Link>
                  </div>
                </li>
              </a>
            </div>
          </div>
          <div className="container">
          <div className="text-box column">
            <h1>UBLends</h1>
            <div class="highlight">
              <center><h2>A Place Where UB:</h2></center>
            </div>
            <h3>Lends, Rents, Buys & Sells</h3>
          </div>
          <div className="login-box column">
          <div class='signInBox'>
            <br></br>
            <center>
              <h4>Leave a Review</h4>
            </center>
            <br></br>
            <center>
            <label id='rating 1-5'>Rate 1-5
              <div class='select'>
                <select
                  value={this.state.select}
                  onChange={this.selectHandlerChange}
                >
                  {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span class='focus'></span>
              </div>
              </label>
            </center>
            <br></br>
            <center>
              <label>Description
              <textarea
                id='ratingdesc'
                name='ratedesc'
                placeholder='Enter Description of the User or Transaction'
                onChange={this.descHandlerChange}
                value={this.state.desc}
              ></textarea>
              </label>
            </center>
            <br></br>
            <center>
              <button id='submit button' type='submit' onClick={this.posting}>
                Submit
              </button><br/><br/>
            </center>
          </div>
            </div>
          </div>
      </body>
    )
  }
}
