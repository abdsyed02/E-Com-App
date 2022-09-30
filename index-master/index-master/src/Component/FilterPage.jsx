import React from 'react'
import '../App.css'
import logo from '../UBLends/images/logo.png'
//import sarthak from '../UBLends/images/sarthak.jpeg'
import UploadProfilePic from './UploadProfilePic.jsx'
import Post from './Post.jsx'
//import Avatar from '../UBLends/images/what.jpeg'
import { BrowserRouter as Routes, Link } from 'react-router-dom'

export default class FilterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: false,
      image: '',
      posts: [],
      listType: props.listType,
      search: '',
      isBlocked: false,
    }
    this.postingList = React.createRef()
    this.loadPosts = this.loadPosts.bind(this)
  }

  componentDidMount() {
    this.loadPosts()

    this.setState({
      search: sessionStorage.getItem('Filter'),
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

  loadPosts() {
    //Searchbar = (none) Categories = (selected) Bull/Loan/Rent = (none)
    if (
      sessionStorage.getItem('Filter') === '' &&
      sessionStorage.getItem('FilterCat') != '' &&
      sessionStorage.getItem('FilterSelect') === ''
    ) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?sort=newest&contentEndsWith=' +
          sessionStorage.getItem('FilterCat') +
          '**p**',
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
              result[0].forEach((element) => {
                // get request to get connection between two users to check if author is blocked from posting on user's home page
                // get request to get connection between two users to check if author is blocked from posting on user's home page
              var myHeaders = new Headers();
              myHeaders.append("accept", "*/*");
              myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=" + sessionStorage.getItem('user') + "&toUserID=" + element.authorID, requestOptions)
                .then(response => response.json())
                .then(resul => {
                  // push element to the home page
                  this.state.posts.push(element)

                  console.log(this.state.posts)
                  resul[0].forEach(e => {
                    // get request to get connection between two users to check if author is blocked from posting on user's home page
                    var headers = new Headers();
                    headers.append("accept", "*/*");
                    headers.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    this.setState({
                      isBlocked: e.attributes.isBlocked
                    })
                    if (this.state.isBlocked) {
                      // remove the most recently added post
                      this.state.posts.pop(element)
                    }
                  })
                  // state needs to get reset at the end of the loop
                  this.setState({
                    isBlocked: false
                  })

                  
                })
                .catch(error => console.log('error', error));
            });
            this.setState({
              isLoaded: true,
            });
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
    //Searchbar = (selected) Categories = (none) Bull/Loan/Rent = (none)
    else if (
      sessionStorage.getItem('Filter') != '' &&
      sessionStorage.getItem('FilterCat') === '' &&
      sessionStorage.getItem('FilterSelect') === ''
    ) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?sort=newest&contentContains=' +
          sessionStorage.getItem('Filter'),
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
              result[0].forEach((element) => {
                // get request to get connection between two users to check if author is blocked from posting on user's home page
                // get request to get connection between two users to check if author is blocked from posting on user's home page
              var myHeaders = new Headers();
              myHeaders.append("accept", "*/*");
              myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=" + sessionStorage.getItem('user') + "&toUserID=" + element.authorID, requestOptions)
                .then(response => response.json())
                .then(resul => {
                  // push element to the home page
                  this.state.posts.push(element)

                  console.log(this.state.posts)
                  resul[0].forEach(e => {
                    // get request to get connection between two users to check if author is blocked from posting on user's home page
                    var headers = new Headers();
                    headers.append("accept", "*/*");
                    headers.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    this.setState({
                      isBlocked: e.attributes.isBlocked
                    })
                    if (this.state.isBlocked) {
                      // remove the most recently added post
                      this.state.posts.pop(element)
                    }
                  })
                  // state needs to get reset at the end of the loop
                  this.setState({
                    isBlocked: false
                  })

                  
                })
                .catch(error => console.log('error', error));
            });
            this.setState({
              isLoaded: true,
            });
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
    //Searchbar = (selected) Categories = (selected) Bull/Loan/Rent = (none)
    else if (
      sessionStorage.getItem('Filter') != '' &&
      sessionStorage.getItem('FilterCat') != '' &&
      sessionStorage.getItem('FilterSelect') === ''
    ) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?sort=newest&contentContains=' +
          sessionStorage.getItem('Filter') +
          '&contentEndsWith=' +
          sessionStorage.getItem('FilterCat') +
          '**p**',
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
              result[0].forEach((element) => {
                // get request to get connection between two users to check if author is blocked from posting on user's home page
              var myHeaders = new Headers();
              myHeaders.append("accept", "*/*");
              myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=" + sessionStorage.getItem('user') + "&toUserID=" + element.authorID, requestOptions)
                .then(response => response.json())
                .then(resul => {
                  // push element to the home page
                  this.state.posts.push(element)

                  console.log(this.state.posts)
                  resul[0].forEach(e => {
                    // get request to get connection between two users to check if author is blocked from posting on user's home page
                    var headers = new Headers();
                    headers.append("accept", "*/*");
                    headers.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    this.setState({
                      isBlocked: e.attributes.isBlocked
                    })
                    if (this.state.isBlocked) {
                      // remove the most recently added post
                      this.state.posts.pop(element)
                    }
                  })
                  // state needs to get reset at the end of the loop
                  this.setState({
                    isBlocked: false
                  })

                  
                })
                .catch(error => console.log('error', error));
            });
            this.setState({
              isLoaded: true,
            });
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
    //Searchbar = (none) Categories = (selected) Bull/Loan/Rent = (selected)
    else if (
      sessionStorage.getItem('Filter') === '' &&
      sessionStorage.getItem('FilterCat') != '' &&
      sessionStorage.getItem('FilterSelect') != ''
    ) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?attributes=%7B%0A%20%20%22path%22%3A%20%22select%22%2C%0A%20%20%22equals%22%3A%20%22' +
          sessionStorage.getItem('FilterSelect') +
          '%22%0A%20%20%0A%7D&sort=newest&contentEndsWith=' +
          sessionStorage.getItem('FilterCat') +
          '**p**',
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
              result[0].forEach((element) => {
                // get request to get connection between two users to check if author is blocked from posting on user's home page
              var myHeaders = new Headers();
              myHeaders.append("accept", "*/*");
              myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=" + sessionStorage.getItem('user') + "&toUserID=" + element.authorID, requestOptions)
                .then(response => response.json())
                .then(resul => {
                  // push element to the home page
                  this.state.posts.push(element)

                  console.log(this.state.posts)
                  resul[0].forEach(e => {
                    // get request to get connection between two users to check if author is blocked from posting on user's home page
                    var headers = new Headers();
                    headers.append("accept", "*/*");
                    headers.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    this.setState({
                      isBlocked: e.attributes.isBlocked
                    })
                    if (this.state.isBlocked) {
                      // remove the most recently added post
                      this.state.posts.pop(element)
                    }
                  })
                  // state needs to get reset at the end of the loop
                  this.setState({
                    isBlocked: false
                  })

                  
                })
                .catch(error => console.log('error', error));
            });
            this.setState({
              isLoaded: true,
            });
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
    //Searchbar = (selected) Categories = (none) Bull/Loan/Rent = (selected)
    else if (
      sessionStorage.getItem('Filter') != '' &&
      sessionStorage.getItem('FilterCat') === '' &&
      sessionStorage.getItem('FilterSelect') != ''
    ) {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?attributes=%7B%0A%20%20%22path%22%3A%20%22select%22%2C%0A%20%20%22equals%22%3A%20%22' +
          sessionStorage.getItem('FilterSelect') +
          '%22%0A%20%20%0A%7D&sort=newest&contentContains=' +
          sessionStorage.getItem('Filter'),
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
              result[0].forEach((element) => {
                // get request to get connection between two users to check if author is blocked from posting on user's home page
              var myHeaders = new Headers();
              myHeaders.append("accept", "*/*");
              myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=" + sessionStorage.getItem('user') + "&toUserID=" + element.authorID, requestOptions)
                .then(response => response.json())
                .then(resul => {
                  // push element to the home page
                  this.state.posts.push(element)

                  console.log(this.state.posts)
                  resul[0].forEach(e => {
                    // get request to get connection between two users to check if author is blocked from posting on user's home page
                    var headers = new Headers();
                    headers.append("accept", "*/*");
                    headers.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    this.setState({
                      isBlocked: e.attributes.isBlocked
                    })
                    if (this.state.isBlocked) {
                      // remove the most recently added post
                      this.state.posts.pop(element)
                    }
                  })
                  // state needs to get reset at the end of the loop
                  this.setState({
                    isBlocked: false
                  })

                  
                })
                .catch(error => console.log('error', error));
            });
            this.setState({
              isLoaded: true,
            });
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
    //Searchbar = (selected) Categories = (selected) Bull/Loan/Rent = (selected)
    else {
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts?attributes=%7B%0A%20%20%22path%22%3A%20%22select%22%2C%0A%20%20%22equals%22%3A%20%22' +
          sessionStorage.getItem('FilterSelect') +
          '%22%0A%20%20%0A%7D&sort=newest&contentContains=' +
          sessionStorage.getItem('Filter') +
          '&contentEndsWith=' +
          sessionStorage.getItem('FilterCat') +
          '**p**',
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
              result[0].forEach((element) => {
                // get request to get connection between two users to check if author is blocked from posting on user's home page
                // get request to get connection between two users to check if author is blocked from posting on user's home page
              var myHeaders = new Headers();
              myHeaders.append("accept", "*/*");
              myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

              var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=" + sessionStorage.getItem('user') + "&toUserID=" + element.authorID, requestOptions)
                .then(response => response.json())
                .then(resul => {
                  // push element to the home page
                  this.state.posts.push(element)

                  console.log(this.state.posts)
                  resul[0].forEach(e => {
                    // get request to get connection between two users to check if author is blocked from posting on user's home page
                    var headers = new Headers();
                    headers.append("accept", "*/*");
                    headers.append("Authorization", "Bearer " + sessionStorage.getItem("token"));

                    var requestOptions = {
                      method: 'GET',
                      headers: myHeaders,
                      redirect: 'follow'
                    };
                    this.setState({
                      isBlocked: e.attributes.isBlocked
                    })
                    if (this.state.isBlocked) {
                      // remove the most recently added post
                      this.state.posts.pop(element)
                    }
                  })
                  // state needs to get reset at the end of the loop
                  this.setState({
                    isBlocked: false
                  })

                  
                })
                .catch(error => console.log('error', error));
            });
            this.setState({
              isLoaded: true,
            });
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
  }

  onLogout = () => {
    this.props.logout()
  }

  filterTextbooks = () => {
    sessionStorage.setItem('FilterCat', 'Textbooks')
    sessionStorage.setItem('FilterOption', 'Textbooks')
    window.location.reload(false)
  }

  filterElectronics = () => {
    sessionStorage.setItem('FilterCat', 'Electronics')
    sessionStorage.setItem('FilterOption', 'Electronics')
    window.location.reload(false)
  }

  filterStationary = () => {
    sessionStorage.setItem('FilterCat', 'Stationary')
    sessionStorage.setItem('FilterOption', 'Stationary')
    window.location.reload(false)
  }

  filterClothes = () => {
    sessionStorage.setItem('FilterCat', 'Clothes')
    sessionStorage.setItem('FilterOption', 'Clothes')
    window.location.reload(false)
  }

  filterEntertainment = () => {
    sessionStorage.setItem('FilterCat', 'Entertainment')
    sessionStorage.setItem('FilterOption', 'Entertainment')
    window.location.reload(false)
  }

  filterOther = () => {
    sessionStorage.setItem('FilterCat', 'Other')
    sessionStorage.setItem('FilterOption', 'Other')
    window.location.reload(false)
  }

  filterBuy = () => {
    sessionStorage.setItem('FilterSelect', 'sell')
    window.location.reload(false)
  }

  filterLoan = () => {
    sessionStorage.setItem('FilterSelect', 'lend')
    window.location.reload(false)
  }

  filterRent = () => {
    sessionStorage.setItem('FilterSelect', 'rent')
    window.location.reload(false)
  }

  filterSearch = (event) => {
    sessionStorage.setItem('FilterOption', 'Search')
    this.setState({
      search: event.target.value,
    })
  }

  searchRefresh = () => {
    sessionStorage.setItem('Filter', this.state.search)
    window.location.reload(false)
  }

  render() {
    const { posts } = this.state
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
        <ol class='navbar'>
          <li id='categroies dropdown' class='navitemdrop'>
            <div class='dropbtn'>{sessionStorage.getItem('FilterOption')}</div>
            <div class='dropdown-content'>
                <Link id='all' to='/home'>All</Link>
                <Link id='textbooks' to='/FilterPage' onClick={this.filterTextbooks}>
                  Textbooks
                </Link>
                <Link id='electronics' to='/FilterPage' onClick={this.filterElectronics}>
                  Electronics
                </Link>
                <Link id='stationary' to='/FilterPage' onClick={this.filterStationary}>
                  Stationary
                </Link>
                <Link id='clothes' to='/FilterPage' onClick={this.filterClothes}>
                  Clothes
                </Link>
                <Link id='entertainment' to='/FilterPage' onClick={this.filterEntertainment}>
                  Entertainment
                </Link>
                <Link id='other' to='/FilterPage' onClick={this.filterOther}>
                  Other
                </Link>
            </div>
          </li>

          <div id='search bar'class='search-container'>
            <form action='#'>
              <input
                id='search'
                type='text'
                placeholder='Search..'
                name='search'
                onChange={this.filterSearch}
                value={this.state.search}
              />
              <label for='search'>
              <button id='search submit' type='submit' onClick={this.searchRefresh}>
                Submit
              </button>
              </label>
            </form>
          </div>
          <li class='navitemsell'>
            <Link id='Create Post' to='/createPost'>
              <a class='navitemsella'>Create a Post</a>
            </Link>
          </li>
          <div class='search-container'>
            You searched for: {sessionStorage.getItem('Filter')}, with the
            category: {sessionStorage.getItem('FilterCat')}, with Buy/Loan/Rent
            option: {sessionStorage.getItem('FilterSelect')}
          </div>
        </ol>
        <ol class='Buynavbar'>
          <div id='selling type'class='search-container'>
            <Link id='Buy' to='/FilterPage' onClick={this.filterBuy}>
              <button>Buy</button>
            </Link>
            <Link id='Loan'to='/FilterPage' onClick={this.filterLoan}>
              <button>Loan</button>
            </Link>
            <Link id='Rent'to='/FilterPage' onClick={this.filterRent}>
              <button>Rent</button>
            </Link>
          </div>
        </ol>
        {posts.map((post) => (
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
