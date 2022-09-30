import React from 'react'
import '../App.css'
import logo from '../UBLends/images/logo.png'
//import sarthak from '../UBLends/images/sarthak.jpeg'
import UploadProfilePic from './UploadProfilePic.jsx'
import Post from './Post.jsx'
//import Avatar from '../UBLends/images/what.jpeg'
import { BrowserRouter as Routes, Link } from 'react-router-dom'

export default class ClosedPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: false,
      image: '',
      posts: [],
      listType: props.listType,
      route: '/prof'
    }
    this.postingList = React.createRef()
    this.loadDrafts = this.loadDrafts.bind(this)
  }

  componentDidMount() {
    this.loadDrafts()

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
  }

  uploadProfilePic = () => {
    console.log(sessionStorage.getItem('user'), sessionStorage.getItem('token'))
  }

  loadDrafts() {
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?content=closedListing&sort=newest',
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
            console.log(sessionStorage.getItem('user'))
            this.setState({
              isLoaded: true,
              posts: result[0],
            })
            console.log('Got Posts')
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
          alert('ERROR loading Posts')
        }
      )
  }

  onLogout = () => {
    this.props.logout()
  }

  render() {
    if (sessionStorage.getItem('visit') === sessionStorage.getItem('user')) {
      this.state.route = '/profile'
    }
    const { error, isLoaded, posts } = this.state
    return this.state.showPopup ? (
      <UploadProfilePic />
    ) : (
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
            <Link id='Active Posts' to='/myPosts'>
              <button>Active Posts</button>
            </Link>
            <Link id='Drafted Posts' to='/myDrafts'>
              <button>Drafted Posts</button>
            </Link>
            <button>
            <u>Closed Posts</u>
            </button>
            <a>Your Closed Posts!</a>
          </div>
          <li class='navitemsell-profile'>
            <Link id='Create Post' to='/createPost'>
              <a class='navitemsella'>Create a Post</a>
            </Link>
          </li>
        </ol>

        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            type={this.props.type}
            loadDrafts={this.loadDrafts}
          />
        ))}
      </body>
    )
  }
}
