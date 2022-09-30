import React from "react";
import { BrowserRouter as Routes,Link} from "react-router-dom";
import "../App.css";
import "../UBLends/style.css"
import logo from '../UBLends/images/logo.png'
import Modal from './Modal.jsx'
// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal,
  })
}

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      alanmessage: "",
      sessiontoken: "",
      users: [],
      openModal: false,
      showPassError: false,
      showUsernameError: false,
    };
    this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
  }

  

  componentDidMount(){
    var myHeaders = new Headers();
    myHeaders.append("accept", "*/*");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/users", requestOptions)
    .then(response => response.json())
    .then((result) => {
        result[0].forEach((val) => {
            this.state.users.push(val.email)
        })
    })
    .catch(error => console.log('error', error));
  }

  // once a user has successfully logged in, we want to refresh the post
  // listing that is displayed.  To do that, we'll call the callback passed in
  // from the parent.
  refreshPostsFromLogin(){
    console.log("CALLING LOGIN IN LOGINFORM");
    this.props.login();
  }

  // change handlers keep the state current with the values as you type them, so
  // the submit handler can read from the state to hit the API layer
  myChangeHandler = event => {
    this.setState({
      username: event.target.value,
      showUsernameError: false
    });
  };

  passwordChangeHandler = event => {
    this.setState({
      password: event.target.value,
      showPassError: false
    });
  };

  isPass(){
    if(this.state.showPassError){
      return <span className="errorFont">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Password is incorrect</span>
    }
  }

  isUser(){
    console.log(sessionStorage.getItem("token"))
    if(this.state.users.includes(this.state.email)){
      return <span></span>
    }
    else if(sessionStorage.getItem("token") === null){
      if(this.state.showUsernameError){
        if(!this.state.users.includes(this.state.email) || this.state.email === ''){
          return <span className="errorFont">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*That username does not exist</span>
        }
      }
    }
    
  }

  // when the user hits submit, process the login through the API
  submitHandler = event => {
    
    //keep the form from actually submitting
    //event.preventDefault();
    
    //make the api call to the authentication page
    fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/auth/login", {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.username,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(
        result => {
          console.log("Testing");
          if (result.userID) {

            // set the auth token and user ID in the session state
            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("user", result.userID);

            this.setState({
              sessiontoken: result.token,
              confirmmessage: result.token
            });

            // call refresh on the posting list
            this.refreshPostsFromLogin();
          } else {

            // if the login failed, remove any infomation from the session state
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            this.setState({
              sessiontoken: "",
              confirmmessage: result.message,
              showUsernameError: true
            });
          }
        })
        .catch(error => {
          this.setState({
            showPassError: true
          })
          //alert("Password is incorrect.");
        })
  };
  render() {
    window.addEventListener('keydown', (event) => {
      if(event.key==='Enter'){
      this.submitHandler()
      }
    });
    if (!sessionStorage.getItem("token")){
    return(
      <body>
      <link rel="stylesheet" href="style.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@800&display=swap" rel="stylesheet" /> 
      <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@400&display=swap" rel="stylesheet" /> 
      <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&display=swap" rel="stylesheet" /> 
      <Link to="/"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link>
          <div className="container">
            <div className="text-box column">
              <h1 id='Site Name'>UBLends</h1>
            <div class="highlight">
              <center><h2>A Place Where UB:</h2></center>
            </div>
            <h3>Lends, Rents, Buys & Sells</h3>
            <div className="more">
              <div class="btn-group">
                <Link id='sign in'to="/home" ><button class="button">Sign In</button></Link>
                <Link id='signup'to="/signup"><button class="button">Sign Up</button></Link>
              </div>
            </div>
          </div>
          <div id='login box'class="login-box column">
            <div class ="signInBox">
                <br></br>
                <center><h4>Sign In</h4></center>
                <br></br><label class = "signUpLabel">Enter Your Email
                <center><input type="text" id="email" name="email" placeholder = "Email" onChange={this.myChangeHandler}></input></center>
                </label>
                {this.isUser()}
                <br></br><label class = "signUpLabel">Enter Your Password
                <center><input type="password" id="password" name="password" placeholder = "Password" onChange={this.passwordChangeHandler}></input></center>
                </label>
                {this.isPass()}
                <br></br>
                <h5><Link id='forgot password'to="/forgotpassword"> Forgot Password! </Link></h5>
                <br></br>
                <div id='Login'class="btn-group">
                    <center><button class="button" onClick={this.submitHandler}>Sign In</button></center>
                </div>
            </div>
          </div>
          </div>
      </body>
    );
    }
    else{
      window.location.reload()
      console.log("Returning welcome message");
      if (this.state.username) {
        return (
        <p>Welcome, {this.state.username}</p>
        )
      } else {
        return <p>{this.state.alanmessage}</p>;
      }
    }
  }
}