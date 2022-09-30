import React from "react";
import "../UBLends/style.css"
//import logo from './logo.svg';
import logo from '../UBLends/images/logo.png'
import '../App.css';
import { BrowserRouter as Routes,Link} from "react-router-dom";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        isPressed: false,
    };

  }
  
  firstNameHandlerChange = event => {
    this.setState({
        firstname: event.target.value
    })
  }

   lastnameHandlerChange = event => {
     this.setState({
       lastname: event.target.value
     })
   }

   emailHandlerChange = event => {
    this.setState({
      email: event.target.value
    })
  }

  passwordHandlerChange = event => {
    this.setState({
      password: event.target.value
    })
  }

  confirmPasswordHandlerChange = event => {
    this.setState({
      confirmPassword: event.target.value
    })
  }

  isFirstName(){
    if(this.state.firstname === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*First name cannot be empty</span>
    }
  }

  isLastName(){
    if(this.state.lastname === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Last name cannot be empty</span>
    }
  }

  isEmail(){
    var emailList = this.state.email.split("@")
   
    let buffalo = "buffalo.edu"

    if(this.state.email === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*You must use your UB email</span>
    }
    
    if(emailList.length !== 2 && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*You must use your UB email</span>
    }

    if(emailList[1] !== buffalo && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*You must use your UB email</span>
    }
  }

  isPassword(){
    
    if(this.state.password.length < 8 && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Password must be at least 8 characters</span>
    }
  }

  isSamePass(){
    
    if(this.state.password !== this.state.confirmPassword){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Passwords must match</span>
    }
  }

  validateForm = () => {
    var emailList = this.state.email.split("@")
   
    let buffalo = "buffalo.edu"
    //console.log("d" === "buffalo.edu")
    // if(!emailList) {
    //   alert("Please use your UB email.");
    //   return 0;
    // }
    console.log(emailList);
    if(!emailList) {
      //alert("Please use your UB email.");
      return 0;
    }
    if(emailList.length !== 2){
      //alert("Please use your UB email.");
      return 0;
    }
    if(emailList[1] !== buffalo){
      //alert("Please use your UB email.");
      return 0;
    }
    if(this.state.password.length < 8) {
      //alert("Please enter in a valid password.");
      return 0;
    }

    if(this.state.confirmPassword != this.state.password) {
      //alert("Passwords do not match.");
      return 0;
    }

    if(this.state.firstname === ""){
      //alert("Please enter your first name");
      return 0;
    }

    if(this.state.lastname === ""){
      //alert("Please enter your last name");
      return 0;
    }

    return 1;
  }
  signup = (e) => {
    this.setState({
      isPressed: true
    })

    if(this.validateForm()) {
      alert("Successfully Signed up")
      fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/auth/signup", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.state.email, 
            password: this.state.password, 
            attributes: {
              firstname: this.state.firstname, 
              lastname: this.state.lastname,
              ratings: {"1":[],"2":[],"3":[],"4":[],"5":[]}
            }
          })
      })
      .then(response => response.text())
      .then(result => {

        
       }
        )
      .catch(error => console.log('error', error))
    }
    else {
      e.preventDefault();
    }
  }
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
            <h1>UBLends</h1>
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
            <div className ="signInBox"> 
            <br/>
              <center><h4>Sign Up Here</h4></center><br />
                <form>
                  <label class = "signUpLabel">Enter First Name
                  <center> <input type="text" id="firstname" placeholder="First name" name="firstname" onChange={this.firstNameHandlerChange} value={this.state.firstname}/> </center>
                  </label>
                  {this.isFirstName()}
                  <label class = "signUpLabel">Enter Last Name
                  <center> <input type="text" id="lastname" placeholder="Last name" name="lastname" onChange={this.lastnameHandlerChange} value={this.state.lastname}/> </center>
                  </label>
                  {this.isLastName()}
                  <label class = "signUpLabel">Enter UB Email
                  <center><input type="email" id="Email" placeholder="Enter UB email" name="email" onChange={this.emailHandlerChange} value={this.state.email} /></center>
                  </label>
                  {this.isEmail()}
                  <label class = "signUpLabelPassword">Enter Password: Must 8 characters
                  <center><input type="password" id="password" placeholder="Enter password" name="password" onChange={this.passwordHandlerChange} value={this.state.password} /></center>
                  </label>
                  {this.isPassword()}
                  <label class = "signUpLabel">Confirm Password
                  <center><input type="password" id="confirmpassword" placeholder="Confirm Password" onChange={this.confirmPasswordHandlerChange} value={this.confirmPassword}/></center>
                  </label>
                  {this.isSamePass()}
                  <div className="btn-group">
                  <center><Link id='submit'to="/home"><button className="button" onClick={this.signup}> Sign Up</button></Link></center>
                  </div>
                </form>
              </div>      
            </div>
          </div>
        </body>
      )
    }
    else{
      console.log("Returning welcome message");
      if (this.state.username) {
        return <p>Welcome, {this.state.username}</p>;
      } else {
        return <p>{this.state.alanmessage}</p>;
      }
    }
  }

}