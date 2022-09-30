import React from 'react'
import '../App.css'
import logo from '../UBLends/images/logo.png'
//import sarthak from '../UBLends/images/sarthak.jpeg'
import UploadProfilePic from './UploadProfilePic.jsx'
import Post from './Rate.jsx'
//import Avatar from '../UBLends/images/what.jpeg'
import { BrowserRouter as Routes, Link } from 'react-router-dom'

export default class DraftsPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: false,
      image: '',
      posts: [],
      listType: props.listType,
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
    
      window.location.reload(false);
  }

  uploadProfilePic = () => {
    console.log(sessionStorage.getItem('user'), sessionStorage.getItem('token'))
  }


  loadDrafts() {
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?authorID=' +
        sessionStorage.getItem('user') +
        '&sort=newest&contentEndsWith=ratings',
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
            console.log('Got Reviews')
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
          alert('ERROR loading Reviews')
        }
      )
  }

  onLogout = () => {
    this.props.logout()
  }

  render() {
    const { error, isLoaded, posts } = this.state
    return this.state.showPopup ? (
      <UploadProfilePic />
    ) : (
      <body background='../UBLends/images/background.png'>
        <link
          href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
          rel='stylesheet'
        ></link>
        <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>

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
          <div class='search-container'>
            <Link id='My Posts' to='/myPosts'>
              <button>My Posts</button>
            </Link>
            <Link id='My Drafts'to='/myDrafts'>
              <button>My Drafts</button>
            </Link>
            <button id='My Reviews'>
              <u>My Reviews</u>
            </button>
            <h1>These are your Reviews!</h1>
          </div>

          <li class='navitemsell'>
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
