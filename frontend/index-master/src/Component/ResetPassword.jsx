import React from "react";
import logo from '../UBLends/images/logo.png'
import '../App.css';
//import { render } from "react-dom";
import { BrowserRouter as Routes,Link} from "react-router-dom";

export default class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token:"",
            password:"",
            confirmPassword:"",
            isPressed: false,
            tokenError: false,
        };
    }

    tokenChanged = (e) => {
        this.setState({token: e.target.value});
    }

    passwordChanged = (e) => {
        this.setState({password: e.target.value});
    }

    confirmChanged = (e) => {
        this.setState({confirmPassword: e.target.value});
    }

    isToken(){
        if(this.state.tokenError === '' && this.state.isPressed){
            return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Token is invalid</span>
        }
    }

    isPassword(){
        if(this.state.password === '' && this.state.isPressed){
            return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*It appears you have not entered a password</span>
        }
        if(this.state.password.length < 8 && this.state.isPressed){
            return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Password must be at least 8 characters</span>
        }
    }

    isSamePass(){
        if(this.state.password !== this.state.confirmPassword && this.state.isPressed){
            return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Password must match</span>
        }
    }

    resetpassword = (e) => {
        
        this.setState({
            isPressed: true
        })

        if(this.state.password === ''){
            //alert("Please enter a password.");
            e.preventDefault();
        }
        else if(this.state.password.length < 8){
            //alert("Please enter a password with at least 8 characters.");
            e.preventDefault();
        }
        else if(this.state.password !== this.state.confirmPassword){
            //alert("Passwords do not match");
            e.preventDefault();
        }
        else{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "token": this.state.token,
                "password": this.state.password
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/auth/reset-password", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
            .catch(error =>{
                console.log("Token is invalid.");
                this.setState({
                    tokenError: true
                })
                //e.preventDefault();
            })
        }     
                
    }

    render(){
        return(
            <body>
    <link rel="stylesheet" href="style.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@800&display=swap" rel="stylesheet" /> 
    <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@400&display=swap" rel="stylesheet" /> 
    <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&display=swap" rel="stylesheet" /> 
    <div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div>
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
            <div id='reset passowrd'className ="signInBox"> 
            <br/>
            <center><h4>Reset Password</h4></center>
                    <div className="input">
                        <center>
                        <label>Enter Token From Email
                        <input id='enter token'className="input "type="text" onChange={this.tokenChanged} value={this.state.token} placeholder="Token"/> </label>
                        </center>
                        {this.isToken()}
                        <center>
                        <label>Enter New Password
                        <input id='enter new password'className="input" type="password" onChange={this.passwordChanged} value={this.state.password} placeholder="Password"/></label>
                        </center>
                        {this.isPassword()}
                        <center>
                        <label>Confirm New Password
                        <input id='confirm new password'className="input" type="password" onChange={this.confirmChanged} value={this.state.confirmPassword} placeholder="Password"/></label>
                        </center>
                        {this.isSamePass()}
                    </div>
                    <div className="buttons">
                            <center><Link id='reset'to={"/home"} onClick={this.resetpassword}><button className="button">Reset Password </button></Link>
                            <Link id='cancel'to={"/home"}><button className="button">Cancel</button></Link></center>
                    </div>
              </div>      
            </div>
    </div>
    </body>
        )
    }
}