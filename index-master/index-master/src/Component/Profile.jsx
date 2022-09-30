import React from 'react'
import '../App.css'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
import logo from '../UBLends/images/logo.png'
import sarthak from '../UBLends/images/sarthak.jpeg'
//import newprofilepic from "../UBLends/images/new profile picture.jpg"

// The Profile component shows data from the user table.  This is set up fairly generically to allow for you to customize
// user data by adding it to the attributes for each user, which is just a set of name value pairs that you can add things to
// in order to support your group specific functionality.  In this example, we store basic profile information for the user

export default class Profile extends React.Component {
  // The constructor will hold the default values for the state.  This is also where any props that are passed
  // in when the component is instantiated will be read and managed.
  constructor(props) {
    super(props)
    this.state = {
      firstname: '',
      lastname: '',
      responseMessage: '',
      oldfirst: false,
      oldlast: false,
      image: '',
      responseID: '',
      imgpath: sarthak,
      fileID: '',
      visit: 0,
      isPressed: false,
      // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
    }
    this.fieldChangeHandler.bind(this)
  }

  // This is the function that will get called every time we change one of the fields tied to the user data source.
  // it keeps the state current so that when we submit the form, we can pull the value to update from the state.  Note that
  // we manage multiple fields with one function and no conditional logic, because we are passing in the name of the state
  // object as an argument to this method.
  fieldChangeHandler(field, e) {
    console.log('field change')
    this.setState({
      [field]: e.target.value,
    })
  }

  // This is the function that will get called the first time that the component gets rendered.  This is where we load the current
  // values from the database via the API, and put them in the state so that they can be rendered to the screen.
  componentDidMount() {
    // fetch the user data, and extract out the attributes to load and display
    console.log(sessionStorage.getItem('user'))
    //prevents re render if state exists

    if (!this.state.oldfirst) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/users/' +
          sessionStorage.getItem('user'),
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            if (result && result.attributes) {
              console.log(result.attributes?.firstname ?? '')
              this.setState({
                // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                // try and make the form component uncontrolled, which plays havoc with react
                oldfirst: result.attributes?.firstname ?? '',
                oldlast: result.attributes?.lastname ?? '',
              })
            }
          },
          (error) => {
            console.log('error')
          }
        )
    }
    if (!this.state.fileID) {
      fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      })
        .then((response) => response.json())
        .then((val) => {
          val[0].forEach((value) => {
            if (value.uploaderID === parseInt(sessionStorage.getItem('user'))) {
              if (value.attributes?.profilePicture === true) {
                this.setState({
                  img: `https://webdev.cse.buffalo.edu${value.path}`,
                  fileID: `/${value.id}`,
                })
              }
            }
          })
        })
        .catch((error) => console.log('error', error))
    }
  }

  handleDelete = () => {
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'text/plain')
    myHeaders.append(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    )

    var raw = 'relatedObjectsAction: "DELETE"'

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/users/' +
        sessionStorage.getItem('user') +
        '?relatedObjectsAction=delete',
      requestOptions
    )
      .then((result) => {
        if (result.status === 204) {
          console.log('success')
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        } else {
          console.log(result)
        }
      })
      .catch((err) => console.log(err))
  }
  // This is the function that will get called when the submit button is clicked, and it stores
  // the current values to the database via the api calls to the user and user_preferences endpoints
  submitHandler = (event) => {
    this.setState({
      isPressed: true
    })
    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault()
    if(this.state.firstname === '' || this.state.lastname === ''){
      //alert("First name and last name cannot be empty.")
    }
    else{
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/users/' +
          sessionStorage.getItem('user'),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            attributes: {
              firstname: this.state.firstname,
              lastname: this.state.lastname,
            },
          }),
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              responseMessage: result.Status,
            })
          },
          (error) => {
            alert('Error, Please fill out all fields')
          }
        ) .then(window.location.reload())//make the api call to the user controller, and update the user fields (username, firstname, lastname)
    }
  }

  isFirstName(){
    if(this.state.firstname === '' && this.state.isPressed){
      return <span className='errorFont'>*First name cannot be empty</span>
    }
  }

  isLastName(){
    if(this.state.lastname === '' && this.state.isPressed){
      return <span className='errorFont'>*Last name cannot be empty</span>
    }
  }

  togglePressed(){
    this.setState({
      isPressed: true
    })
  }

  onLogout = () => {
    this.props.logout()
  }
  updatePicture = async (e) => {
    // call getFileID function to retrieve info for fileid and file path

    var myHeaders = new Headers()
    myHeaders.append('accept', '*/*')
    // replace Bearer with sessionStorage.getItem('token')
    myHeaders.append(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    )

    var requestOptions1 = {
      method: 'DELETE',
      headers: myHeaders,
    }
    if (this.state.fileID) {
      await fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads' +
          this.state.fileID,
        requestOptions1
      )
    }

    var formdata = new FormData()
    // 66 needs to be replaced with getID
    formdata.append('uploaderID', sessionStorage.getItem('user'))
    formdata.append('attributes', '{"profilePicture": true}')
    // props will have to be fileInput / replace state.image uploaded via form
    formdata.append('file', document.getElementById('fileid').files[0])

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    }

    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads',
      requestOptions
    )
      .then((response) => console.log(response.json()))
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
      .then(
        this.setState({ imgpath: document.getElementById('fileid').files[0] })
      ).then(window.location.reload())
  }

  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.

  visting = () => {
    this.state.visit = sessionStorage.getItem('user')
    sessionStorage.setItem('visit', this.state.visit)
  }

  render() {
    return (
      <body background='images/background.png'>
        <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>
        <link
          href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
          rel='stylesheet'
        ></link>
        <link
          rel='stylesheet'
          type='text/css'
          href='//fonts.googleapis.com/css?family=Signika+Negative'
        />
          <div id='Navbar' class='imgnavbar'>
            <div id='top right nav'class='rightnavimg'>
              <a id='Nav drop down'>
                <li id='Drop down Nav' class='navitemdrop'>
                  <img
                    id='profile img'
                    class='rightimgresize'
                    src={this.state.img}
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
        <ol id='Local Nav' class='navbar'>
          <div class='search-container-buy'>
            <Link id='Reviews' to='/reviews' onClick={this.visting}>
              <button>Reviews</button>
            </Link>
            <button id='Profile'>
              <u>Profile</u>
            </button>
            <a>Manage Profile</a>
          </div>
          <li class='navitemsell-profile'>
          <Link id='Create Post' to='/createPost'>
              <a class='navitemsella'>Create a Post</a>
            </Link>
          </li>
        </ol>
        <ol id='filter nav'class='Buynavbar'>
          <div id='connectins'class='search-container-buy'>
            <Link id='blocked' to='/blockedUsers'>
              <button>Blocked</button>
            </Link>
            <Link id='followings'to='/following'>
              <button>Following</button>
            </Link>
            <Link id='follower'to='/followers'>
              <button>Followers</button>
            </Link>
          </div>
        </ol>
        <div className="container">
          <div className="text-box column">
            <img id='your profile pic'src={this.state.img} className='credphoto' alt='pfp'></img>
            <br/><br/><label> Select Photo<input class='uploadphoto' type='file' id='fileid' name='upload' /></label><br/>
          <button id='select photo'class='selphoto' onClick={this.updatePicture}>
            Update Photo
          </button>
          <div>
        </div>
          </div>
          <div className="login-box column">
            <div className ="signInBox"> 
            <br/>
              <center><h4>Your Information</h4></center><br />
              
              <center><form onSubmit={this.submitHandler} className='profileform'>
              <label>
                New First name
                <input id='first name'
                  type='text'
                  onChange={(e) => this.fieldChangeHandler('firstname', e)}
                  value={this.state.firstname}
                />
              </label>
              {this.isFirstName()}
              <br></br>
              <br></br>
              <label>
                New Last name
                <input id='last name'
                  type='text'
                  onChange={(e) => this.fieldChangeHandler('lastname', e)}
                  value={this.state.lastname}
                />
              </label>
              {this.isLastName()}
              <br></br>
              <br></br>
              <font id='current names'class='names' size='large'>
                Firstname is : {this.state.oldfirst}
                <br />
                Lastname is : {this.state.oldlast}
              </font>
              {this.state.responseMessage}
              <div className="btn-group">
                  <center><button id='modify info button' type='submit' value='Modify Info'className="button"> Modify Info.</button></center>
                  <Link id='reset password'to='/forgotpassword'><br/>
                    <button class='button' type='button' value='Reset Password' > Reset Pass.</button>
                  </Link><br/>
                  <Link id='delete account' to='/signup' onClick={this.handleDelete}>
                    <button class='button' type='button' value='Delete Account'> Delete Acc.</button>
                  </Link><br/><br/>
              </div>
            </form></center>

              </div>      
            </div>
          </div>
        
        <div class='imgnavbar'></div>
      </body>
    )
  }
}
