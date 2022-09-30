import React from "react";
import { BrowserRouter as Routes,Link} from "react-router-dom";
import "../App.css";
import "../UBLends/style.css"
import logo from '../UBLends/images/logo.png'
import indexImage from "../UBLends/images/indexImage.png"

// the login form will display if there is no session token stored.  This will display
// the login form, and call the API to authenticate the user and store the token in
// the session.

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      alanmessage: "",
      sessiontoken: ""
    };
    this.refreshPostsFromLogin = this.refreshPostsFromLogin.bind(this);
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
      username: event.target.value
    });
  };

  passwordChangeHandler = event => {
    this.setState({
      password: event.target.value
    });
  };

  // when the user hits submit, process the login through the API
  submitHandler = event => {
    //keep the form from actually submitting
    event.preventDefault();

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
              confirmmessage: result.message
            });
          }
        },
        error => {
          alert("error!");
        }
      );
  };
  render(){
    if(!sessionStorage.getItem("token")){
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
            <h1 id='Site name'>UBLends</h1>
            <div class="highlight">
            <center><h2>A Place Where UB:</h2></center>
            </div>
            <h3>Lends, Rents, Buys & Sells</h3>
           <div className="more">
           <div class="btn-group">
              <Link id='signin' to="/home" ><button class="button">Sign In</button></Link>
              <Link id='signup' to="/signup"><button class="button">Sign Up</button></Link>
            </div>
           </div>
          </div>
          <div className="login-box column">
            <img UBL class = "indexImage" alt="phone logo" src={indexImage}/>      
          </div>
        </div>
        </body>
      )
    }
    }
  }
/*                         
    <div class="col-7">
        <h1 class="title">UBLends</h1>

        <div class="highlight3">
                
                    <center></center>     
            </div>
    </div>
    <div class="col-4">
        <br/><br/><br/>
        <img class="indexImage" src={indexImage}/>
    </div>

</body>
      );
    }
    else{
      console.log("Returning welcome message");
      if (this.state.username) {
        return <p>Welcome, {this.state.username}</p>;
      } else {
        return <p>{this.state.alanmessage}</p>;
      }
    }
  }*/
