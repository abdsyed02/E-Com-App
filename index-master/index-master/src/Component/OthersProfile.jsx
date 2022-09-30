import React from 'react'
import '../App.css'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
import logo from '../UBLends/images/logo.png'
import sarthak from '../UBLends/images/sarthak.jpeg'
//import newprofilepic from "../UBLends/images/new profile picture.jpg"
import StarRating from './StarRating'

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
      image: '',
      responseID: '',
      imgpath: sarthak,
      fileID: '',
      isFollowing: false,
      connectionID: 0,
      isBlocked: false,
      connectionCount: 0,
      ratings: [0],
      ids: [],
      // NOTE : if you wanted to add another user attribute to the profile, you would add a corresponding state element here
    }
    this.fieldChangeHandler.bind(this)
    this.backPath = this.backPath.bind(this)
    this.loadPosts = this.loadPosts.bind(this)
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
    this.backPath()
    this.loadPosts()

    // fetch the user data, and extract out the attributes to load and display
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
              })
            }
          }
        },
        (error) => {
          console.log('error')
        }
      )

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
                image: `https://webdev.cse.buffalo.edu${value.path}`,
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
        val[0].forEach((value) => {
          console.log(value.id)
          this.setState({
            isFollowing: value.attributes.isFollowing,
            connectionID: value.id,
            isBlocked: value.attributes.isBlocked,
            connectionCount: val[1],
          })
        })
        console.log(val[1])
        console.log(val)
      })
      .catch((error) => console.log('error', error))
  }
  backPath() {
    sessionStorage.setItem('backPath', window.location.pathname)
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

  onLogout = () => {
    this.props.logout()
  }
  logAndLeave(event) {
    this.onLogout()
  }

  follow = () => {
    if (!this.state.isBlocked) {
      var myHeaders = new Headers()
      myHeaders.append('accept', '*/*')
      myHeaders.append(
        'Authorization',
        'Bearer ' + sessionStorage.getItem('token')
      )
      myHeaders.append('Content-Type', 'application/json')

      var raw = JSON.stringify({
        fromUserID: sessionStorage.getItem('user'),
        toUserID: sessionStorage.getItem('visit'),
        attributes: {
          isFollowing: true,
          isBlocked: false,
        },
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/connections',
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          console.log(result)
          alert(
            'Successfully followed ' +
              this.state.otherfirst +
              ' ' +
              this.state.otherlast
          )
          this.setState({
            isFollowing: true,
          })
        })
        .catch((error) => console.log('error', error))
    } else {
      // alert('User is currently blocked')
    }
  }

  unfollow = () => {
    var newHeaders = new Headers()
    newHeaders.append('accept', '*/*')
    newHeaders.append(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    )

    var reqOptions = {
      method: 'GET',
      headers: newHeaders,
      redirect: 'follow',
    }

    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=' +
        sessionStorage.getItem('user') +
        '&toUserID=' +
        sessionStorage.getItem('visit'),
      reqOptions
    )
      .then((response) => response.json())
      .then((val) => {
        val[0].forEach((value) => {
          console.log(value.id)
          this.setState({
            isFollowing: false,
            connectionID: value.id,
          })
        })
        console.log(val[1])
        console.log(val)
      })
      .catch((error) => console.log('error', error))

    var myHeaders = new Headers()
    myHeaders.append('accept', '*/*')
    myHeaders.append(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    )

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    }

    // replace with get connection id
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/connections/' +
        this.state.connectionID.toString(),
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        alert(
          'successfully unfollowed ' +
            this.state.firstname +
            ' ' +
            this.state.lastname
        )
        this.setState({ isFollowing: false })
      })
      .catch((error) => console.log('error', error))
  }

  block = () => {
    // unfollow user
    this.unfollow()

    var myHeaders = new Headers()
    myHeaders.append('accept', '*/*')
    myHeaders.append(
      'Authorization',
      'Bearer ' + sessionStorage.getItem('token')
    )
    myHeaders.append('Content-Type', 'application/json')

    var raw = JSON.stringify({
      fromUserID: sessionStorage.getItem('user'),
      toUserID: sessionStorage.getItem('visit'),
      attributes: {
        isFollowing: false,
        isBlocked: true,
      },
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/connections',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        alert(
          'Successfully blocked ' +
            this.state.otherfirst +
            ' ' +
            this.state.otherlast
        )
        this.setState({ isBlocked: true })
      })
      .catch((error) => console.log('error', error))
  }

  loadPosts = () => {
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?&recipientUserID=' +
        sessionStorage.getItem('visit') +
        '&sort=newest&contentEndsWith=ratings',
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      }
    )
      .then((response) => response.json())
      .then((val) => {
        val[0].forEach((value) => {
          if (!this.state.ids.includes(value.id)) {
            if (value.attributes.select == 'one') {
              value.attributes.select = 1
            }
            if (value.attributes.select == 'two') {
              value.attributes.select = 2
            }
            if (value.attributes.select == 'three') {
              value.attributes.select = 3
            }
            if (value.attributes.select == 'four') {
              value.attributes.select = 4
            }
            if (value.attributes.select == 'five') {
              value.attributes.select = 5
            }
            this.setState({
              ratings: [].concat.apply(
                [],
                [this.state.ratings, value.attributes.select]
              ),
              ids: [].concat.apply([], [this.state.ids, value.id]),
            })
          }
        })
      })
    const arr = this.state.ratings
    const map = arr.reduce(
      (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
      new Map()
    )
    sessionStorage.setItem('rating', [...map.keys()].length)
    var sum = 0
    const lit = [...map.keys()]
    for (let key of lit) {
      key = Number(key)
      sum += key
    }
    const ave = Math.ceil(sum / ([...map.keys()].length - 1))
    sessionStorage.setItem('ave', ave)
  }
  // This is the function that draws the component to the screen.  It will get called every time the
  // state changes, automatically.  This is why you see the username and firstname change on the screen
  // as you type them.
  render() {
    console.log(this.state.fileID)
    sessionStorage.setItem('Filter', '')
    return (
      <body background='images/background.png'>
        <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>
        <link
          href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
          rel='stylesheet'
        ></link>
        {this.loadPosts()}
        <link
          rel='stylesheet'
          type='text/css'
          href='//fonts.googleapis.com/css?family=Signika+Negative'
        />
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
        <ol id='Local Nav' class='navbar'>
          <div class='search-container-buy'>
            <Link id='Reviews' to='/reviews' onClick={this.visting}>
              <button>Reviews</button>
            </Link>
            <button id='Profile'>
              <u>Profile</u>
            </button>
            <a>{this.state.otherfirst}'s Profile</a>
            
          </div>
          <li class='navitemsell-profile'>
            <Link id='Create Post' to='/createPost'>
              <a class='navitemsella'>Create a Post</a>
            </Link>
          </li>
        </ol>
        <div className="container">
          <div className="text-box column">
          <img src={this.state.imgOther} className='credphoto' alt='pfp'></img>
          </div>
          <div className="login-box column">
            <div className ="signInBox"> 
            <br/>
              <center><h4>User Information</h4></center><br />
              <center>
            <font id='names'class='names'>
              Name: {this.state.otherfirst}
              {' ' + this.state.otherlast}
            </font>
            <br />
            <div id='rating'className='App'>
              <StarRating />
            </div><br/>
            <div className="btn-group">
                  <Link id='leave a review' to='/createReview'>
                    <button class='button' type='button' value='Reset Password' > Leave a Review</button>
                  </Link><br/>
                  <button id='follow/unfollow' class='button' onClick={this.state.isFollowing ? this.unfollow : this.follow}>
                  {' '}{this.state.isFollowing ? 'Unfollow' : 'Follow'}</button>
                  <button id='block/unblock'class='button' onClick={this.state.isBlocked ? this.unfollow : this.block}>
                  {' '}{this.state.isBlocked ? 'Unblock' : 'Block'}{' '}
                  </button>
              </div>
          </center>
              </div>      
            </div>
          </div>
      </body>
    )
  }
}

