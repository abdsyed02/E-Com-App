import React from 'react'
import '../App.css'
import logo from '../UBLends/images/logo.png'
import { BrowserRouter as Routes, Link } from 'react-router-dom'

export default class FriendForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      friendname: '',
      friendid: '',
      responseMessage: '',
      users: [],
      following: '',
      userids: [],
      img: '',
      dic:[]
    }
    this.fieldChangeHandler.bind(this)
  }

  fieldChangeHandler(field, e) {
    console.log('field change')
    this.setState({
      [field]: e.target.value,
    })
  }

  onLogout = () => {
    this.props.logout()
  }

  selectAutocomplete(friendID) {
    this.setState({
      friendid: friendID,
    })
    console.log('Set Friend ID to ' + friendID)
  }

  componentDidMount() {
    //make the api call to the user API to get the user with all of their attached preferences
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=' +
        sessionStorage.getItem('user'),
      {
        method: 'GET',
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
            let names = []
            let ids = []
            let dic= []

            result[0].forEach((element) => {
              if (!element.attributes.isBlocked) {
                names.push({
                  name:
                    element.toUser.attributes.firstname +
                    ' ' +
                    element.toUser.attributes.lastname,
                })
                ids.push({
                  id: element.toUser.id.toString(),
                })
                dic.push({
                  name:
                  element.toUser.attributes.firstname +
                  ' ' +
                  element.toUser.attributes.lastname,
                  id: element.toUser.id,
                  ret: <Link to='/prof' onClick={()=>{ sessionStorage.setItem('visit',element.toUser.id ); }}><button>{element.toUser.attributes.firstname +' ' +element.toUser.attributes.lastname}</button></Link>
                })
                
                // this body check to see 
                fetch(
                  'https://webdev.cse.buffalo.edu/hci/api/api/index/connections?fromUserID=' +
                    element.toUser.id +
                    '&toUserID=' +
                    sessionStorage.getItem('user'),
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization:
                        'Bearer ' + sessionStorage.getItem('token'),
                    },
                  }
                )
                  .then((res) => res.json())
                  .then(
                    (result) => {
                      if (result) {
                        result[0].forEach((el) => {
                          if (el.attributes.isBlocked) {
                            names.pop()
                            dic.pop()
                          }
                        })

                        this.setState({
                          users: names,
                          dic:dic,
                          following: names.length,
                        })
                        console.log(names)
                        console.log(this.state.users)
                      }
                    },
                    (error) => {
                      alert('error!: ' + error)
                    }
                  )
              }
            })

            this.setState({
              users: names,
              dic:dic,
              following: names.length,
            })
            console.log(names)
            console.log(this.state.users)
          }
        },
        (error) => {
          alert('error!: ' + error)
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
  }
  visting = () => {
    this.state.visit = sessionStorage.getItem('user')
    sessionStorage.setItem('visit', this.state.visit)
  }

  setVisit = (e) => {
    sessionStorage.setItem('visit', e)
  }
  visit = (e) => {
    // console.log(e)
    let i=e.id
    let n=e.name
    sessionStorage.setItem('visit', i)
    return <Link to='/prof'><button>{i}</button></Link>
  }
  render() {
    return (
      <body background='../UBLends/images/background.png'>
      <link rel="stylesheet" href="style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@800&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@400&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&display=swap" rel="stylesheet" /> 
      <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>
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
                    <a href='#'>
                      <Link id='Profile' to='/settings'>Profile</Link>
                    </a>
                    <a href='#'>
                      <Link id='My Posts' to='/myPosts'>My Posts</Link>
                    </a>
                    <a href='#'>
                      <Link id='Logout' to='/' onClick={this.onLogout}>
                        Logout
                      </Link>
                    </a>
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
            <Link id='Profile' to='/profile'>
              <button>Profile</button>
            </Link>
            <a>Users Following You</a>
          </div>
          <li class='navitemsell-profile'>
          <Link id='Create Post' to='/createPost'>
              <a class='navitemsella'>Create a Post</a>
            </Link>
          </li>
        </ol>
        <ol id='filter nav'class='Buynavbar'>
          <div class='search-container-buy'>
            <Link id='buy' to='/blockedUsers'>
              <button>Blocked</button>
            </Link>
            <Link id='loan'to='/following'>
              <button><u>Following</u></button>
            </Link>
            <Link id='rent'to='/followers'>
              <button>Followers</button>
            </Link>
          </div>
        </ol>
      <div className="container">
          <div className="text-box column">
            <h1>UBLends</h1>
            <div class="highlight">
              <center><h2>A Place Where UB:</h2></center>
            </div>
            <h3>Lends, Rents, Buys & Sells</h3>
          </div>
          <div className="login-box column">
            <div className ="signInBox"> 
            <br/>
              <center><h4>People You Follow:</h4></center><br />
              <center><div> Number of Followers: {this.state.following}</div></center><br/>
              <div id='Blocked Users' className='autocomplete'>
            <tbody className='navitemsella'>
            <font color = "black">Click the links to see the profile:</font>  
                {this.state.dic.map((r) => (
                  <tr key={r}>
                    {r.ret}
                  </tr>
                ))}
            </tbody>
          </div>
            </div>      
          </div>
      <form className='profileform'>
          <link
            href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
            rel='stylesheet'
          ></link>
      </form>
      </div>
      </body>
    )
  }

  /*render() {
    return (
      <form className='profileform'>
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
          <ol class='navbar'>
            <li class='navitemdrop'>
              <div>Following: {this.state.following}</div>
            </li>
          </ol>
          <br />
          <div className='autocomplete'>
          <tbody className='navitemsella'>
              {this.state.users.map((r) => (
                <tr key={r}>
                  <td>{this.visit(r.name)}</td>
                </tr>
              ))}
            </tbody>
          </div>
        </body>
      </form>
    )
  }*/
}
