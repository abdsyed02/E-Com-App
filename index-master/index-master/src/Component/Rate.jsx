import React from 'react'
import '../App.css'
import helpIcon from '../assets/delete.png'
import { BrowserRouter as Routes, Link } from 'react-router-dom'
/* This will render a single post, with all of the options like comments, delete, tags, etc.  In the harness, it's only called from PostingList, but you could
  also have it appear in a popup where they edit a post, etc. */

const options = [
  {
    label: 'not Chosen.',
    value: 'notSpecified',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
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
      item: '',
      select: '',
      condition: '',
      description: '',
      empty: '    '
    }
    this.post = React.createRef()
  }

  showModal = (e) => {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  deletePost(postID) {
    //make the api call to post
    fetch(process.env.REACT_APP_API_PATH + '/posts/' + postID, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    }).then(
      (result) => {
        this.props.loadPosts()
      },
      (error) => {
        alert('error Deleting')
      }
    )
  }


  // we only want to expose the delete post functionality if the user is
  // author of the post
  showDelete() {
    if (this.props.post.author.id === sessionStorage.getItem('user')) {
      return (
        <img
          src={helpIcon}
          className='sidenav-icon deleteIcon'
          alt='Delete Post'
          title='Delete Post'
          onClick={(e) => this.deletePost(this.props.post.id)}
        />
      )
    }
    return ''
  }
  visting = () => {
    console.log(this.props.post.author.id)
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
        alert('Deleting Review was successful')
      },
      (error) => {
        alert('error deleting Review')
      }
    )
    window.location.reload()
  }

  sendPost = () => {
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
          content: this.state.select+"**ratings",
          attributes: {
            item: this.state.item,
            select: this.state.select,
            con: this.state.condition,
            desc: this.state.description,
          },
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            responseMessage: result.Status,
          })
          window.location.reload()
        },
        (error) => {
          alert('error updating review')
        }
      )
  }

  checkval(){
    if(this.state.item===''){
      this.state.item=this.props.post.attributes.item
    }
    if(this.state.select===''){
      this.state.select=this.props.post.attributes.select
    }
    if(this.state.condition===''){
      this.state.condition=this.props.post.attributes.con
    }
    if(this.state.description===''){
      this.state.description=this.props.post.attributes.desc
    }
  }

  render() {
    if(this.props.post.authorID == sessionStorage.getItem('user')) {
      if (this.props.post.content.includes("ratings")) {
        return (
          <div className='productABTEST'>
            <div className='prodcontainerABTEST' key={this.props.post.id}>
              {this.state.editView ? (
                <>
                  <p class='rateDesc'>
                    Rate 1-5:
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
                  <p class='rateDesc'>
                    Description:
                    <input
                      type='text'
                      id='ratingprice'
                      item='rateprice'
                      placeholder={this.props.post.attributes.desc}
                      onChange={(e) => {
                        this.setState({ description: e.target.value })
                      }}
                      value={this.state.description}
                    />
                  </p>
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
                  <p class='itemname'>
                    Rating: {this.props.post.attributes.select}
                  </p>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <p class='itemname'>
                    Description: {this.props.post.attributes.desc}
                  </p>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <button onClick={this.deleteDraft}>
                  Delete Review
                  </button>
                  <button
                    onClick={() => {
                      this.setState({
                        editView: true,
                      })
                    }}
                  >
                    Edit Review
                  </button>
                </>
              )}
            </div>
          </div>
        )
      }
       else {
        return ''
      }
    } else if (this.props.post.content.includes("ratings")) {
      return (
        <div className='productABTEST'>
          <div className='prodcontainerABTEST' key={this.props.post.id}>
            <p class='itemname'>Rating: {this.props.post.attributes.select}</p>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <p class='itemname'>
              Description: {this.props.post.attributes.desc}
            </p>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <p class='itemname'>Posted by: {this.props.post.author.email}</p>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Link to='/prof' onClick={this.visting}>
              <button>Profile</button>
            </Link>
          </div>
        </div>
      )
    }
  }
}
