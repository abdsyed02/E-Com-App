import React from 'react'
import '../App.css'
import logo from '../UBLends/images/logo.png'
import UploadProfilePic from './UploadProfilePic.jsx'
import Post from './Post.jsx'
import Avatar from '../UBLends/images/what.jpeg'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
import defaultImage from './images/defaultPost.jpg'

// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      select: '',
      cat: '',
      price: '',
      con: '',
      desc: '',
      postmessage: '',
      image: '',
      productimage: {},
      author: '',
      route:'/prof',
    }
  }

  componentDidMount() {
    const postId = sessionStorage.getItem('DetailPhotoID')
    if (parseInt(postId) && parseInt(postId) !== -1) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads/' +
        postId,
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
          this.setState({
            productimage: 'https://webdev.cse.buffalo.edu' + val.path,
            postId: val.id,
          })
        })
    } else {
      this.setState({
        productimage: defaultImage,
      })
    }

    this.setState({
      name: sessionStorage.getItem('DetailName'),
      select: sessionStorage.getItem('DetailSelect'),
      cat: sessionStorage.getItem('DetailCategory'),
      price: "$"+sessionStorage.getItem('DetailPrice')+".00",
      con: sessionStorage.getItem('DetailCondition'),
      desc: sessionStorage.getItem('DetailDescription'),
      postmessage: sessionStorage.getItem('DetailMessage'),
      author: sessionStorage.getItem('DetailAuthor'),
    })
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

  onLogout = () => {
    this.props.logout()
  }

  visting = () => {
    sessionStorage.setItem('visit', sessionStorage.getItem('DetailAuthorID'))
  }



  render() {
    const { error, isLoaded, posts } = this.state
    if (sessionStorage.getItem('visit') === sessionStorage.getItem('user')) {
      this.state.route = '/profile'
    }
    return this.state.showPopup ? (
      <UploadProfilePic />
    ) : (
      <body background='../UBLends/images/background.png'>
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
        <ol id='Local Nav' class='descnavbar'>
          <li class='descsell'>
            <Link id='Create Post' to='/createPost'>
              <a class='descitemsella'>Create a Post</a>
            </Link>
          </li>
          <li class='descdiv'>
            <div id='item title' class='desctitle'>Item description: {this.state.name}</div>
          </li>
        </ol>
        <div class="detailscol">
          <div class='detailscol left'>
            <div class='center'>
              <img id='item image' class='imageDetail' src={this.state.productimage} alt='' />
            </div>
          </div>
          <div class='detailscol right'>
            <div class='DetailsDeskBoxDiv'>
              <div id='detail box' class='DetailsDescBox'>           
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsText'>
                      Name of product:{' '}
                    </label>
                  </div>
                  <div id='name' class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextLeft'>
                      {this.state.name}
                    </label>
                  </div>
                </div>
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsTextb'>
                      Rent/Lend/Sell:{' '}
                    </label>
                  </div>
                  <div id='selling type'class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextbLeft'>
                      {this.state.select}
                    </label>
                  </div>
                </div>
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsText'>
                      Category:{' '}
                    </label>
                  </div>
                  <div id='category' class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextLeft'>
                      {this.state.cat}
                    </label>
                  </div>
                </div>
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsTextb'>
                      Price:{' '}
                    </label>
                  </div>
                  <div id='price'class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextbLeft'>
                      {this.state.price}
                    </label>
                  </div>
                </div>
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsText'>
                      Condition:{' '}
                    </label>
                  </div>
                  <div id='conditon' class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextLeft'>
                      {this.state.con}
                    </label>
                  </div>
                </div>
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsTextb'>
                      Posted by:{' '}
                    </label>
                  </div>
                  <div id='author' class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextbLeft'>
                      {this.state.author}
                    </label>
                  </div>
                </div>
                <div class='DetailsInfo'>
                  <div class='detailsinfocol left'>
                    <label for='standard-select' class='DetailsText'>
                      Description:{' '}
                    </label>
                  </div>
                  <div id='description'class='detailsinfocol right'>
                    <label for='standard-select' class='DetailsTextDesc'>
                      {this.state.desc}
                    </label>
                  </div>
                </div>
              </div>
              <div class='contactDiv2'>
                <a id='Contact seller'href={`mailto:${this.state.author}`}>
                  <button class='contactButton'>Contact Seller</button>
                </a>
                <Link id='View Seller Info'to={this.state.route} onClick={this.visting}>
                  <button class='contactButton'>View Seller Information</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    )
  }
}
