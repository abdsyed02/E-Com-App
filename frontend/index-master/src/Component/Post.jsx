import React from 'react'
import '../App.css'
import defaultImage from './images/defaultPost.jpg'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
/* This will render a single post, with all of the options like comments, delete, tags, etc.  In the harness, it's only called from PostingList, but you could
  also have it appear in a popup where they edit a post, etc. */

const options = [
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
export default class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      comments: this.props.post.commentCount,
      showTags: this.props.post.reactions.length > 0,
      editView: false,
      purchasedView: false,
      buyer:'',
      name: '',
      select: '',
      cat: '',
      price: 0.00,
      condition: '',
      description: '',
      type: 'product',
      photoId: this.props.post.attributes.photoId || -1,
      image: {},
    }
    this.post = React.createRef()
  }

  showModal = (e) => {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  componentDidMount() {
    const postId = this.props.post.attributes.photoId
    if (postId && postId !== -1) {
      console.log(postId)
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
            image: 'https://webdev.cse.buffalo.edu' + val.path,
            postId: val.id,
          })
        })
    } else {
      this.setState({
        image: defaultImage,
      })
    }
  }

  visting = () => {
    sessionStorage.setItem('visit', this.props.post.author.id)
  }

  deleteDraft = () => {
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts/' +
        this.props.post.id,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      }
    ).then(
      (result) => {
        this.setState({
          postmessage: result.Status,
        })
        window.location.reload()
      },
      (error) => {
        //alert('error!')
      },
      
    )

  }

  sendPost = () => {
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
          this.editPost(photoId)
        })
    } else {
      this.editPost(-1)
    }
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

  editPost = (photoId) => {
    if(this.state.name === ''){
      //alert("Product name cannot be empty.\nPlease enter a name.")
    }
    else if(this.state.price === ''){
      //alert("Product price cannot be empty.\nPlease enter a price.")
    }
    else if(this.state.condition === ''){
      //alert("Product condition cannot be empty.\nPlease enter a condition.")
    }
    else if(this.state.description === ''){
      //alert("Product description cannot be empty.\nPlease enter a description.")
    }
    else if(isNaN(this.state.price)){
      //alert("Product price must be a number.")
    }
    else{
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts/' +
          this.props.post.id,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            email: this.state.email,
            attributes: {
              name: this.state.name,
              select: this.state.select,
              price: this.state.price,
              con: this.state.condition,
              desc: this.state.description,
              cat: this.state.cat,
              photoId:
                photoId === -1 ? this.props.post.attributes.photoId : photoId,
            },
          }),
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              responseMessage: result.Status,
            }).then(
            window.location.reload())
          },
          (error) => {
            alert('error!')
          }
        )  
    }
    
  }


  publishThenDelete = (e) => {
    e.preventDefault()

    if(this.props.post.attributes.name === ''){
      //alert("Product name cannot be empty.\nPlease enter a name.")
    }
    else if(this.props.post.attributes.price === ''){
      //alert("Product price cannot be empty.\nPlease enter a price.")
    }
    else if(this.props.post.attributes.con === ''){
      //alert("Product condition cannot be empty.\nPlease enter a condition.")
    }
    else if(this.props.post.attributes.desc === ''){
      //alert("Product description cannot be empty.\nPlease enter a description.")
    }
    else if(isNaN(this.props.post.attributes.price)){
      //alert("Product price must be a number.")
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
          //**product** is to  work around content name no longer having "product" to filter out between drafts and products
          content:
            this.props.post.attributes.name +
            ' ' +
            this.props.post.attributes.cat +
            '**p**',
          attributes: {
            name: this.props.post.attributes.name,
            select: this.props.post.attributes.select,
            cat: this.props.post.attributes.cat,
            price: this.props.post.attributes.price,
            con: this.props.post.attributes.con,
            desc: this.props.post.attributes.desc,
            photoId: this.state.photoId,
            type: 'product',
          },
        }),
      })
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              postmessage: result.Status,
            })
            //alert('Post was successful')

            // once a post is complete, reload the feed (does not work yet)
            //this.postListing.current.loadPosts();
          },
          (error) => {
            //alert('error!')
          }
        )
      fetch(
        'https://webdev.cse.buffalo.edu/hci/api/api/index/posts/' +
          this.props.post.id,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        }
      ).then(
        (result) => {
          this.setState({
            postmessage: result.Status,
          })
          window.location.reload()
        },
        (error) => {
          //alert('error!')
        }
      )
    }
  }

  publishAfterDelete = (e) => {
    
    e.preventDefault()
    fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/posts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem('user'),
        //**product** is to  work around content name no longer having "product" to filter out between drafts and products
        content:
        "closedListing",
        attributes: {
          name: this.props.post.attributes.name,
          select: this.props.post.attributes.select,
          cat: this.props.post.attributes.cat,
          price: this.props.post.attributes.price,
          con: this.props.post.attributes.con,
          desc: this.props.post.attributes.desc,
          photoId: this.state.photoId,
          type: 'closedListing',
        },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            postmessage: result.Status,
          })
          alert('Close Listing was successful')

          // once a post is complete, reload the feed (does not work yet)
          //this.postListing.current.loadPosts();
        },
        (error) => {
          alert('error!')
        }
      )
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts/' +
        this.props.post.id,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      }
    ).then(
      (result) => {
        this.setState({
          postmessage: result.Status,
        })
        window.location.reload()
      },
      (error) => {
        alert('error!')
      }
    ) 
  }

  addBuyer = (e) => {
    fetch('https://webdev.cse.buffalo.edu/hci/api/api/index/posts', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        authorID: sessionStorage.getItem('user'),
        //**product** is to  work around content name no longer having "product" to filter out between drafts and products
        content:
         "closedListing",
        attributes: {
          name: this.props.post.attributes.name,
          select: this.props.post.attributes.select,
          cat: this.props.post.attributes.cat,
          price: this.props.post.attributes.price,
          con: this.props.post.attributes.con,
          desc: this.props.post.attributes.desc,
          photoId: this.state.photoId,
          buyer:this.state.buyer,
          type: 'closedListing',
        },
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            postmessage: result.Status,
          })
          alert('Adding Buyer was successful')

          // once a post is complete, reload the feed (does not work yet)
          //this.postListing.current.loadPosts();
        },
        (error) => {
          alert('error!')
        }
      )
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/posts/' +
        this.props.post.id,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      }
    ).then(
      (result) => {
        this.setState({
          postmessage: result.Status,
        })
        window.location.reload()
      },
      (error) => {
        alert('error!')
      }
    )
  }

  details = () => {
    sessionStorage.setItem('DetailName', this.props.post.attributes.name)
    sessionStorage.setItem('DetailAuthorID', this.props.post.author.id)
    sessionStorage.setItem('DetailPhotoID', this.props.post.attributes.photoId)
    sessionStorage.setItem('DetailSelect', this.props.post.attributes.select)
    sessionStorage.setItem('DetailCategory', this.props.post.attributes.cat)
    sessionStorage.setItem('DetailPrice', this.props.post.attributes.price)
    sessionStorage.setItem('DetailDescription', this.props.post.attributes.desc)
    sessionStorage.setItem('DetailCondition', this.props.post.attributes.con)
    sessionStorage.setItem(
      'DetailMessage',
      this.props.post.attributes.postmessage
    )
    sessionStorage.setItem('DetailAuthor', this.props.post.author.email)
    sessionStorage.setItem('visit', this.props.post.author.id)
  }

  checkval() {
    if (this.state.name === '') {
      this.state.name = this.props.post.attributes.name
    }
    if (this.state.select === '') {
      this.state.select = this.props.post.attributes.select
    }
    if (this.state.condition === '') {
      this.state.condition = this.props.post.attributes.con
    }
    if (this.state.description === '') {
      this.state.description = this.props.post.attributes.desc
    }
    if (this.state.price === '') {
      this.state.price = this.props.post.attributes.price
    }
    if (this.state.cat === '') {
      this.state.cat = this.props.post.attributes.cat
    }
    if (this.state.buyer===''){
      this.state.buyer = this.props.post.attributes.buyer
    }
  }

  render() {
    if (this.props.post.content == 'productDraft') {
      if (this.props.post.authorID == sessionStorage.getItem('user')) {
        return (
          <div className='draftThing'>
              {this.state.editView ? (
                <>
                <div className='productEDIT'>
                <div className='prodcontainer' key={this.props.post.id}>
                  <p class='itemname'>
                    Name:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.name}
                      onChange={(e) => {
                        this.setState({ name: e.target.value })
                      }}
                      value={this.state.name}
                    />
                  </p>
                  <p class='itemname'>
                    Rent/Buy/Sell:
                    <select
                      value={this.state.select}
                      onChange={(e) => {
                        this.setState({ select: e.target.value })
                      }}
                    >
                      {options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </p>
                  <p class='itemname'>
                    Category:
                    <select
                      value={this.state.cat}
                      onChange={(e) => {
                        this.setState({ select: e.target.value })
                      }}
                    >
                      {Catoptions.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </p>
                  <p class='itemname'>
                    Price:
                    <input
                      type='text'
                      id='productprice'
                      name='price'
                      placeholder={this.props.post.attributes.price}
                      onChange={this.priceHandlerChange}
                      value={this.state.price}
                    />
                  </p>
                  <p class='itemname'>
                    Condition:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.con}
                      onChange={(e) => {
                        this.setState({ condition: e.target.value })
                      }}
                      value={this.state.condition}
                    />
                  </p>
                  <p class='itemname'>
                    Description:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.desc}
                      onChange={(e) => {
                        this.setState({ description: e.target.value })
                      }}
                      value={this.state.description}
                    />
                  </p>
                  <center>
                    <label for='standard-select'>Upload picture</label>
                  </center>
                  <center>
                    <input type='file' id='fileid' name='myfile'></input>
                  </center>
                  <button
                    onClick={() => {
                      this.setState({ editView: false })
                      this.checkval()
                      this.sendPost()
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      this.setState({ editView: false })
                    }}
                  >
                    Cancel
                  </button>
                     </div>
                  </div>
                </>
              ) : (
                <>
                <div className='product'>
                <div className='prodcontainer' key={this.props.post.id}>
                  <img class='detailsImage' src={this.state.image} alt={this.props.post.attributes.name} />
                  <p class='itemname'>
                    Name:<br/>{this.props.post.attributes.name}
                  </p>
                  <p class='itemname'>
                    Posted by:<br/> {this.props.post.author.email}
                  </p>
                  <Link to='/home' onClick={this.publishThenDelete}>
                    <button>Publish</button>
                  </Link>
                  <button onClick={this.deleteDraft}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      this.setState({
                        editView: true,
                      })
                    }}
                  >
                    Edit
                  </button>
                  <Link to='/Details'>
                    <button type='submit' onClick={this.details}>
                      Details
                    </button>
                  </Link>
                  </div>
                  </div>
                </>
              )}
          </div>
        )
      } else {
        return ''
      }
    }     if (this.props.post.content == 'closedListing') {
      if (this.props.post.authorID == sessionStorage.getItem('user')) {
        return (
          <div className='product'>
            <div className='prodcontainer' key={this.props.post.id}>
              {this.state.editView ? (
                <>
                  <p class='itemname'>
                    Name:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.name}
                      onChange={(e) => {
                        this.setState({ name: e.target.value })
                      }}
                      value={this.state.name}
                    />
                  </p>
                  <p class='itemname'>
                    Rent/Buy/Sell:
                    <select
                      value={this.state.select}
                      onChange={(e) => {
                        this.setState({ select: e.target.value })
                      }}
                    >
                      {options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </p>
                  <p class='itemname'>
                    Category:
                    <select
                      value={this.state.cat}
                      onChange={(e) => {
                        this.setState({ select: e.target.value })
                      }}
                    >
                      {Catoptions.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </p>
                  <p class='itemname'>
                    Price:
                    <input
                      type='text'
                      id='productprice'
                      name='price'
                      placeholder={this.props.post.attributes.price}
                      onChange={(e) => {
                        this.setState({ price: e.target.value })
                      }}
                      value={this.state.price}
                    />
                  </p>
                  <p class='itemname'>
                    Condition:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.con}
                      onChange={(e) => {
                        this.setState({ condition: e.target.value })
                      }}
                      value={this.state.condition}
                    />
                  </p>
                  <p class='itemname'>
                    Description:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.desc}
                      onChange={(e) => {
                        this.setState({ description: e.target.value })
                      }}
                      value={this.state.description}
                    />
                  </p>
                  <center>
                    <label for='standard-select'>Upload picture</label>
                  </center>
                  <center>
                    <input type='file' id='fileid' name='myfile'></input>
                  </center>
                  <button
                    onClick={() => {
                      this.setState({ editView: false })
                      this.checkval()
                      this.sendPost()
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      this.setState({ editView: false })
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : this.state.purchasedView ? (
                <>
                  <p class='itemname'>
                    Enter Buyer's Email:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.buyer}
                      onChange={(e) => {
                        this.setState({ buyer: e.target.value })
                      }}
                      value={this.state.buyer}
                    />
                  </p>
                  <button
                    onClick={() => {
                      this.setState({ purcahsedView: false })
                      this.checkval()
                      this.addBuyer()
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      this.setState({ purchasedView: false })
                    }}
                  >
                    Cancel
                  </button>

                </>
              ) : (
                <>
                  <img class='detailsImage' src={this.state.image} alt={this.props.post.attributes.name} />
                  <p class='itemname'>
                    Name:<br/>{this.props.post.attributes.name}
                  </p>
                  <p class='itemname'>
                    Sold to:<br/> {this.props.post.attributes.buyer}
                  </p>
                  <Link to='/home' onClick={this.publishThenDelete}>
                    <button>Publish</button>
                  </Link>
                  <button onClick={this.deleteDraft}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      this.setState({
                        purchasedView: true,
                      })
                    }}
                  >
                    Purchased
                  </button>
                  <Link to='/Details'>
                    <button type='submit' onClick={this.details}>
                      Details
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )
      } else {
        return ''
      }
    } else if (this.props.post.attributes.type == 'product') {
      if (this.props.post.authorID != sessionStorage.getItem('user')) {
        return (
          <div className='product'>
            <div className='prodcontainer' key={this.props.post.id}>
              <img class='detailsImage' src={this.state.image} alt={this.props.post.attributes.name} />
              <p class='itemname'>Name:<br/>{this.props.post.attributes.name}</p>
              <p class='itemname'>Posted by:<br/> {this.props.post.author.email}</p>
              <Link to='/prof' onClick={this.visting}>
                <button>Profile</button>
              </Link>
              <Link to='/Details'>
                <button type='submit' onClick={this.details}>
                  Details
                </button>
              </Link>
            </div>
          </div>
        )
      } else {
        return (
          <div className='product'>
            <div className='prodcontainer' key={this.props.post.id}>
              {this.state.editView ? (
                <>
                  <p class='itemname'>
                    Name:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.name}
                      onChange={(e) => {
                        this.setState({ name: e.target.value })
                      }}
                      value={this.state.name}
                    />
                  </p>
                  <p class='itemname'>
                    Rent/Buy/Sell:
                    <select
                      value={this.state.select}
                      onChange={(e) => {
                        this.setState({ select: e.target.value })
                      }}
                    >
                      {options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </p>
                  <p class='itemname'>
                    Category:
                    <select
                      value={this.state.cat}
                      onChange={(e) => {
                        this.setState({ select: e.target.value })
                      }}
                    >
                      {Catoptions.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </p>
                  <p class='itemname'>
                    Price:
                    <input
                      type='text'
                      id='productprice'
                      name='price'
                      placeholder={this.props.post.attributes.price}
                      onChange={(e) => {
                        this.setState({ price: e.target.value })
                      }}
                      value={this.state.price}
                    />
                  </p>
                  <p class='itemname'>
                    Condition:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.con}
                      onChange={(e) => {
                        this.setState({ condition: e.target.value })
                      }}
                      value={this.state.condition}
                    />
                  </p>
                  <p class='itemname'>
                    Description:
                    <input
                      type='text'
                      id='productprice'
                      name='prodprice'
                      placeholder={this.props.post.attributes.desc}
                      onChange={(e) => {
                        this.setState({ description: e.target.value })
                      }}
                      value={this.state.description}
                    />
                  </p>
                  <center>
                    <label for='standard-select'>Upload picture</label>
                  </center>
                  <center>
                    <input type='file' id='fileid' name='myfile'></input>
                  </center>
                  <button
                    onClick={() => {
                      this.setState({ editView: false })
                      this.checkval()
                      this.sendPost()
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      this.setState({ editView: false })
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <img class='detailsImage' src={this.state.image} alt={this.props.post.attributes.name} />
                  <p class='itemname'>
                    Name:<br/> {this.props.post.attributes.name}
                  </p>
                  <p class='itemname'>
                    Posted by:<br/> {this.props.post.author.email}
                  </p>
                  <Link to='/myClosed' onClick={this.publishAfterDelete}>
                    <button>Close</button>
                  </Link>

                  <Link to='/Details'>
                    <button type='submit' onClick={this.details}>
                      Details
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )
      }
    } else {
      return ''
    }
  }
}
