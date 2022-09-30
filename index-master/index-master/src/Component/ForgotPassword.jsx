import React from "react";
//import logo from './logo.svg';
import '../App.css';
import logo from '../UBLends/images/logo.png'
import { BrowserRouter as Routes,Link} from "react-router-dom";

export default class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            redirect: true,
            users: [],
            isPressed: false,
        };
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
    
    isEmail(){
        if(this.state.email === '' && this.state.isPressed){
            return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Please enter your email</span>
        }

        if(!this.state.users.includes(this.state.email) && this.state.isPressed){
            return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*We don't have that email on record</span>
        }
    }

    emailChanged = (e) => {
        this.setState({email: e.target.value});
    }

    forgotpassword = (e) => {
        this.setState({
            isPressed: true
        })
        if(!this.state.users.includes(this.state.email) || this.state.email === ''){
            //alert("Please enter an email.")
            e.preventDefault();
        }
        else{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "email": this.state.email
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://webdev.cse.buffalo.edu/hci/api/api/index/auth/request-reset", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => {
                e.preventDefault()
                //alert('error', error)
            })
        }
    }

    renderRedirect = () => {
        if(this.state.redirect){
            window.location.href = '/resetpassword';
        }
    }

    retHomepage = () => {
        window.location.href ='/';
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
    <Link to="/"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link>
    <div className="container">
        <div className="text-box column">
            <br/><br/><br/><br/>
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
    <div id='login box'class="login-box column">
    <br/><br/><br/>
        <div class ="signInBox">
            <center><h4 id='forgot password'>Forgot Password?</h4>
            <br/>
            <label>Enter Email
            <input id='enter email'className="button" type="text" onChange={this.emailChanged} value={this.state.email} placeholder="Email"/>
            </label>
            </center>
            {this.isEmail()}
            <br/>
            
            <div class="btn-group">
                <center>
                    <Link id='verify email' onClick={this.forgotpassword} to="/resetpassword"><button className="button">Verify</button></Link>
                    <Link id='cancel'to="/home"><button className="button">Cancel</button></Link>
                </center>
            </div>
        </div>
    </div>
    </div>
    </body>       
        )
    }
}