import React from 'react'
import '../UBLends/style.css'
import '../App.css'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
import logo from '../UBLends/images/logo.png'
import UploadProfilePic from './UploadProfilePic.jsx'
import Modal from './Modal.jsx'

const options = [
  {
    label: 'Transaction: Click to choose.',
    value: 'notSpecified',
  },
  {
    label: 'Lend',
    value: 'lend',
  },
  {
    label: 'Sell',
    value: 'sell',
  },
  {
    label: 'Rent',
    value: 'rent',
  },
]

const Catoptions = [
  {
    label: 'Category: Click to choose.',
    value: 'notSpecified',
  },
  {
    label: 'Textbooks',
    value: 'Textbooks',
  },
  {
    label: 'Electronics',
    value: 'Electronics',
  },
  {
    label: 'Stationary',
    value: 'Stationary',
  },
  {
    label: 'Clothes',
    value: 'Clothes',
  },
  {
    label: 'Entertainment',
    value: 'Entertainment',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]

function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal,
  })
}

export default class CreateListing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      select: 'notSpecified',
      cat: 'notSpecified',
      price: '',
      con: '',
      desc: '',
      postmessage: '',
      image: '',
      type: 'draft',
      isPressed: false
    }
  }

  componentDidMount() {
    fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((val) => {
        var profile = 0
        val[0].forEach((value) => {
          if (value.uploaderID === parseInt(sessionStorage.getItem('user'))) {
            console.log(value)
            if (value.attributes?.profilePicture === true) {
              profile = 1
              this.setState({
                image: `https://webdev.cse.buffalo.edu${value.path}`,
                fileID: `/${value.id}`,
              })
            }
          }
        })
        if (profile === 0) {
          this.setState({
            showPopup: true,
          })
        }
      })
      .catch((error) => console.log('error', error))
  }

  uploadProfilePic = () => {
    console.log(sessionStorage.getItem('user'), sessionStorage.getItem('token'))
  }

  nameHandlerChange = (event) => {
    this.setState({
      name: event.target.value,
    })
  }

  selectHandlerChange = (event) => {
    this.setState({
      select: event.target.value,
    })
  }

  catHandlerChange = (event) => {
    this.setState({
      cat: event.target.value,
    })
  }

  priceHandlerChange = (event) => {
    if(!isNaN(event.target.value)){
      let p = +event.target.value
      //p = Math.round(p + Number.EPSILON *100)/100
      this.setState({
        price: p,
      })
      /*if(this.state.select === "lend"){
        this.setState({
          price: 0
        })
      }*/
    }
  }

  conditionHandlerChange = (event) => {
    this.setState({
      con: event.target.value,
    })
  }

  descHandlerChange = (event) => {
    this.setState({
      desc: event.target.value,
    })
  }

  isName() {
    if(this.state.name === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Product name required</span>
    }
  }

  isSel() {
    if(this.state.select === 'notSpecified' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Transaction type required</span>
    }
  }

  isCat() {
    if(this.state.cat === 'notSpecified' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Product category required</span>
    }
  }

  isPrice() {
    if(this.state.price === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Product price required</span>
    }
  }

  isCond() {
    if(this.state.con === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Condition required</span>
    }
  }

  isDesc() {
    if(this.state.desc === '' && this.state.isPressed){
      return <span className='errorFont'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*Description required</span>
    }
  }

  publishListing = (photoId) => {

    this.setState({
      isPressed: true
    })

    if(this.state.name === ''){
      //alert("Product name cannot be empty.\nPlease enter a name.")
      photoId.preventDefault();
    }

    else if(this.state.select === "notSpecified"){
      //alert("Please specify transaction type.")
      photoId.preventDefault();
    }

    else if(this.state.cat === "notSpecified"){
      //alert("Please specify the product's category.")
      photoId.preventDefault();
    }

    else if(this.state.price === ''){
      //alert("Product price cannot be empty.\nPlease enter a price.")
      photoId.preventDefault();
    }
    else if(this.state.con === ''){
      //alert("Product condition cannot be empty.\nPlease enter a condition.")
      photoId.preventDefault();
    }
    else if(this.state.desc === ''){
      //alert("Product description cannot be empty.\nPlease enter a description.")
      photoId.preventDefault();
    }
    else if(isNaN(this.state.price)){
      //alert("Product price must be a number.")
      photoId.preventDefault();
    }

    else{
      fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/posts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem('user'),
        content: 'productDraft',
        attributes: {
          name: this.state.name,
          select: this.state.select,
          cat: this.state.cat,
          price: this.state.price,
          con: this.state.con,
          desc: this.state.desc,
          type: this.state.type,
          photoId: photoId,
        },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            postmessage: result.Status,
          })
        },
        (error) => {
          alert('error!')
        }
      )
    }
  }

  posting = (e) => {

    this.setState({
      isPressed: true
    })

    if(this.state.name === ''){
      //alert("Product name cannot be empty.\nPlease enter a name.")
      e.preventDefault();
    }

    else if(this.state.select === "notSpecified"){
      //alert("Please specify transaction type.")
      e.preventDefault();
    }

    else if(this.state.cat === "notSpecified"){
      //alert("Please specify the product's category.")
      e.preventDefault();
    }

    else if(this.state.price === ''){
      //alert("Product price cannot be empty.\nPlease enter a price.")
      e.preventDefault();
    }
    else if(this.state.con === ''){
      //alert("Product condition cannot be empty.\nPlease enter a condition.")
      e.preventDefault();
    }
    else if(this.state.desc === ''){
      //alert("Product description cannot be empty.\nPlease enter a description.")
      e.preventDefault();
    }
    else if(isNaN(this.state.price)){
      //alert("Product price must be a number.")
      e.preventDefault();
    }

    else{
      var formdata = new FormData()
      formdata.append('uploaderID', sessionStorage.getItem('user'))
      formdata.append('attributes', '{}')
      formdata.append('file', document.getElementById('fileid').files[0])
      if (document.getElementById('fileid').files[0]) {
        var requestOptions = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: formdata,
        }
        fetch(
          'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads/',
          requestOptions
        )
          .then((response) => {
            if (response.status === 201) {
              return response.json()
            }
          })
          .then((data) => {
            const photoId = data.id
            this.publishListing(photoId)
          })
      } else {
        this.publishListing(-1)
      }
    }  
  }

  postingHome = (e) => {
    
    this.setState({
      isPressed: true
    })

    if(this.state.name === ''){
      //alert("Product name cannot be empty.\nPlease enter a name.")
      e.preventDefault();
    }

    else if(this.state.select === "notSpecified"){
      //alert("Please specify transaction type.")
      e.preventDefault();
    }

    else if(this.state.cat === "notSpecified"){
      //alert("Please specify the product's category.")
      e.preventDefault();
    }

    else if(this.state.price === ''){
      //alert("Product price cannot be empty.\nPlease enter a price.")
      e.preventDefault();
    }
    else if(this.state.con === ''){
      //alert("Product condition cannot be empty.\nPlease enter a condition.")
      e.preventDefault();
    }
    else if(this.state.desc === ''){
      //alert("Product description cannot be empty.\nPlease enter a description.")
      e.preventDefault();
    }
    else if(isNaN(this.state.price)){
      //alert("Product price must be a number.")
      e.preventDefault();
    }

    else{
      var formdata = new FormData()
      formdata.append('uploaderID', sessionStorage.getItem('user'))
      formdata.append('attributes', '{}')
      formdata.append('file', document.getElementById('fileid').files[0])
      if (document.getElementById('fileid').files[0]) {
        var requestOptions = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: formdata,
        }
        fetch(
          'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads/',
          requestOptions
        )
          .then((response) => {
            if (response.status === 201) {
              return response.json()
            }
          })
          .then((data) => {
            const photoId = data.id
            this.publishListingHome(photoId)
          })
      } else {
        this.publishListingHome(-1)
        }
    }
  }
  publishListingHome = (photoId) => {

    this.setState({
      isPressed: true
    })

    if(this.state.name === ''){
      //alert("Product name cannot be empty.\nPlease enter a name.")
      photoId.preventDefault();
    }

    else if(this.state.select === "notSpecified"){
      //alert("Please specify transaction type.")
      photoId.preventDefault();
    }

    else if(this.state.cat === "notSpecified"){
      //alert("Please specify the product's category.")
      photoId.preventDefault();
    }

    else if(this.state.price === ''){
      //alert("Product price cannot be empty.\nPlease enter a price.")
      photoId.preventDefault();
    }
    else if(this.state.con === ''){
      //alert("Product condition cannot be empty.\nPlease enter a condition.")
      photoId.preventDefault();
    }
    else if(this.state.desc === ''){
      //alert("Product description cannot be empty.\nPlease enter a description.")
      photoId.preventDefault();
    }
    else if(isNaN(this.state.price)){
      //alert("Product price must be a number.")
      photoId.preventDefault();
    }

    else{
      fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/posts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem('user'),
        content: this.state.name + ' ' + this.state.cat + '**p**',
        attributes: {
          name: this.state.name,
          select: this.state.select,
          cat: this.state.cat,
          price: this.state.price,
          con: this.state.con,
          desc: this.state.desc,
          type: 'product',
          photoId: photoId,
        },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            postmessage: result.Status,
          })
        },
        (error) => {
          alert('error!')
        }
      )
    }
  }
      
  

  onLogout = () => {
    this.props.logout()
  }
    
  render() {
    const { error, isLoaded } = this.state
    return this.state.showPopup ? (
      <UploadProfilePic />
    ) : (
      <body background='images/background.png'>
      <Link to="/home"><div id = "logo"><img class= "logoImage" alt='Home Logo' src={logo} /></div></Link><br/>
        <link
          href='https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400&display=swap'
          rel='stylesheet'
        ></link>
        <link rel="stylesheet" href="style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Stick+No+Bills:wght@800&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@400&display=swap" rel="stylesheet" /> 
        <link href="https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&display=swap" rel="stylesheet" /> 
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
        <div className="container">
          <div className="text-box column">
            <h1>UBLends</h1>
            <div class="highlight">
            <center><h2>A Place Where UB:</h2></center>
            </div>
            <h3>Lends, Rents, Buys & Sells</h3>
          </div>
          <div class='login-box column'>
          <div class='signInBox'>
            <br></br>
            <center>
              <h4>Post a product</h4>
            </center>
            <br></br>
            <center>
            <label>Item Name 
              <input
                type='text'
                id='productname'
                name='prodname'
                placeholder='Enter Item Name'
                onChange={this.nameHandlerChange}
                value={this.state.name}
              />
              </label>
            </center>
            {this.isName()}
            <br></br>
            <center>
              <label>Transaction Type
              <div class='select'>
                <select
                  value={this.state.select}
                  onChange={this.selectHandlerChange}
                >
                  {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span class='focus'></span>
              </div>
              </label>
            </center>
            {this.isSel()}
            <br></br>
            <center>
              <label>Category
              <div class='select'>
                <select value={this.state.cat} onChange={this.catHandlerChange}>
                  {Catoptions.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span class='focus'></span>
              </div>
              </label>
            </center>
            {this.isCat()}
            <br></br>
            <center>
              <label>Price in $
              <input
                type='text'
                id='productprice'
                name='prodprice'
                placeholder='$0.00'
                onChange={this.priceHandlerChange}
                value={this.state.price}
              />
              </label>
            </center>
            {this.isPrice()}
            <br></br>
            <center>
              <label>Condition
              <input
                type='text'
                id='productcon'
                name='prodcon'
                placeholder='Enter Condition'
                onChange={this.conditionHandlerChange}
                value={this.state.con}
              />
              </label>
            </center>
            {this.isCond()}
            <br></br>
            <center>
              <label>Description
              <input
                type='text'
                class = "description"
                id='productdesc'
                name='proddesc'
                placeholder='Enter Description'
                onChange={this.descHandlerChange}
                value={this.state.desc}
              />
              </label>
            </center>
            {this.isDesc()}
            <br></br>
            <center>
              <label for='fileid'>Upload picture</label>
              <input type='file' id='fileid' name='myfile'></input>
            </center>
            <br></br>
            <center>
              <Link to='/myDrafts' onClick={this.posting}>
                <button type='submit'>Send to Drafts</button>
              </Link>
            </center>
            <br></br>
            <center>
              <Link to='/home' onClick={this.postingHome}>
                <button type='submit'>Publish to Home</button>
              </Link>
            </center>
            <br/>
          </div>
        </div>
          </div>
      </body>
    )
  }
}
