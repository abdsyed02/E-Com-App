import React from 'react'
import '../App.css'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
import logo from '../UBLends/images/logo.png'
import sarthak from '../UBLends/images/sarthak.jpeg'
//import newprofilepic from "../UBLends/images/new profile picture.jpg"
import Post from './Rate.jsx'

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
      email: '',
      responseMessage: '',
      otherfirst: '',
      otherlast: '',
      otheremail: '',
      rating: {},
      image: '',
      posts: [],
      responseID: '',
      imgpath: sarthak,
      fileID: '',
      isFollowing: false,
      connectionID: 0,
      route: '/prof',
      img: '',
      // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
    }
    this.postingList = React.createRef()
    this.loadPosts = this.loadPosts.bind(this)
    this.loadVisit = this.loadVisit.bind(this)
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
    this.loadPosts()
    this.loadVisit()
    // fetch the user data, and extract out the attributes to load and display

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
          if (value.uploaderID === parseInt(sessionStorage.getItem('visit'))) {
            this.setState({
              imgOther: `https://webdev.cse.buffalo.edu${value.path}`,
              fileID: `/${value.id}`,
            })
          }
          if (value.uploaderID === parseInt(sessionStorage.getItem('user'))) {
            console.log(value)
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

    var myHeaders = new Headers()
    myHeaders.append('accept', '*/*')
    myHeaders.append(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    )

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }

    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=' +
        sessionStorage.getItem('user') +
        '&toUserID=' +
        sessionStorage.getItem('visit'),
      requestOptions
    )
      .then((response) => response.json())
      .then((val) => {
        if (val[1] === 1) {
          val[0].forEach((value) => {
            console.log(value.id)
            this.setState({
              isFollowing: true,
              connectionID: value.id,
            })
          })
          console.log(val[1])
          console.log(val)
        }
      })
      .catch((error) => console.log('error', error))
  }

  // This is the function that will get called when the submit button is clicked, and it stores
  // the current values to the database via the api calls to the user and user_preferences endpoints
  submitHandler = (event) => {
    //keep the form from actually submitting, since we are handling the action ourselves via
    //the fetch calls to the API
    event.preventDefault()
    //make the api call to the user controller, and update the user fields (username, firstname, lastname)
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
          email: this.state.email,
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
          alert('error!')
        }
      )
  }
  loadVisit() {
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/users/' +
        sessionStorage.getItem('visit'),
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
          if (result) {
            // console.log(result)
            if (result.attributes) {
              this.setState({
                // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                // try and make the form component uncontrolled, which plays havoc with react
                otherfirst: result.attributes.firstname || '',
                otherlast: result.attributes.lastname || '',
                otheremail: result.email || '',
                rating: result.attributes.ratings || '',
              })
            }
          }
        },
        (error) => {
          console.log('error')
        }
      )
  }
  loadPosts() {
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?&recipientUserID=' +
        sessionStorage.getItem('visit') +
        '&sort=newest&contentStartsWith=' +
        sessionStorage.getItem('Filter') +
        '&contentEndsWith=ratings',
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
          if (result) {
            this.setState({
              isLoaded: true,
              posts: result[0],
            })
            console.log('Got Rate')
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
          alert('ERROR frick')
        }
      )
  }

  onLogout = () => {
    this.props.logout()
  }
  oneStars = () => {
    sessionStorage.setItem('Filter', '1')
    window.location.reload()
  }
  twoStars = () => {
    sessionStorage.setItem('Filter', '2')
    window.location.reload()
  }
  threeStars = () => {
    sessionStorage.setItem('Filter', '3')
    window.location.reload()
  }
  fourStars = () => {
    sessionStorage.setItem('Filter', '4')
    window.location.reload()
  }
  fiveStars = () => {
    sessionStorage.setItem('Filter', '5')
    window.location.reload()
  }

  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.
  render() {
    const { posts } = this.state
    if (sessionStorage.getItem('visit') === sessionStorage.getItem('user')) {
      this.state.route = '/profile'
    }
    console.log(this.state.fileID)
    return (
      <body background='../UBLends/images/background.png'>
        <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>
        <link
          href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
          rel='stylesheet'
        ></link>
          <div id='Navbar' class='imgnavbar'>
            <div class='rightnavimg'>
              <a>
                <li id='Drop down Nav' class='navitemdrop'>
                  <img
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
            <button id='Reviews'>
              <u>Reviews</u>
            </button>
            <Link id='Profile' to={this.state.route}>
              <button>Profile</button>
            </Link>
            <a>{this.state.otherfirst}'s Profile</a>
          </div>
          <li class='navitemsell-profile'>
            <Link id='Create Post' to='/createPost'>
              <a class='navitemsella'>Create a Post</a>
            </Link>
          </li>
        </ol>
        <ol id='ratingfilter' class='Buynavbar'>
          <div id='stars' class='search-container-buy'>
            <button id='star1' onClick={this.oneStars}>1 Star</button>
            <button id='star2' onClick={this.twoStars}>2 Star</button>
            <button id='star3' onClick={this.threeStars}>3 Star</button>
            <button id='star4' onClick={this.fourStars}>4 Star</button>
            <button id='star5' onClick={this.fiveStars}>5 Star</button>
          </div>
        </ol>

        {posts && posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            type={this.props.type}
            loadPosts={this.loadPosts}
          />
        ))}
      </body>
    )
  }
}
