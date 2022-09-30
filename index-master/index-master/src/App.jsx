/*
  App.js is the starting point for the application.   All of the components in your app should have this file as the root.
  This is the level that will handle the routing of requests, and also the one that will manage communication between
  sibling components at a lower level.  It holds the basic structural components of navigation, content, and a modal dialog.
*/

import React from 'react'
import './App.css'
import Index from './Component/Index.jsx'
import GroupList from './Component/GroupList.jsx'
import LoginForm from './Component/LoginForm.jsx'
import Profile from './Component/Profile.jsx'
import OtherProf from './Component/OthersProfile.jsx'
import FriendForm from './Component/FriendForm.jsx'
import Modal from './Component/Modal.jsx'
import Home from './Component/Home.jsx'
import RateCreate from './Component/RateCreate.jsx'
import RateList from './Component/RatingList.jsx'
//import Navbar from "./Component/Navbar.jsx";
import ForgotPassword from './Component/ForgotPassword.jsx'
import DraftsPage from './Component/DraftsPage.jsx'
import Comment from './Component/DraftsRate.jsx'
import MyPost from './Component/MyPosts'
import SignUp from './Component/SignUp.jsx'
import ResetPassword from './Component/ResetPassword.jsx'
//import Create from './Component/Home.jsx'
import ListingProductCard from './Component/ListingProductCard'
import Details from './Component/Details.jsx'
import FollowerForm from './Component/FollowerForm'
import FilterPage from './Component/FilterPage.jsx'
import Closed from './Component/ClosedPage.jsx'
import UploadProfilePic from './Component/UploadProfilePic'
import Blocked from './Component/Blocked.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// toggleModal will both show and hide the modal dialog, depending on current state.  Note that the
// contents of the modal dialog are set separately before calling toggle - this is just responsible
// for showing and hiding the component
function toggleModal(app) {
  app.setState({
    openModal: !app.state.openModal,
  })
}

// the App class defines the main rendering method and state information for the app
class App extends React.Component {
  // the only state held at the app level is whether or not the modal dialog
  // is currently displayed - it is hidden by default when the app is started.
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      refreshPosts: false,
      logout: false,
      login: false,
      loginCheck: true
    }

    // in the event we need a handle back to the parent from a child component,
    // we can create a reference to this and pass it down.
    this.mainContent = React.createRef()

    // since we are passing the doRefreshPosts method to a child component, we need to
    // bind it
    this.doRefreshPosts = this.doRefreshPosts.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.signInReload= this.signInReload.bind(this)
  }
  signInReload = ()=> {
		this.loginCheck=false
		window.location.reload();
}

  logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    this.setState({
      logout: true,
      login: false,
    })
    //window.location.href = '/'
  }

  login = () => {
    console.log('CALLING LOGIN IN APP')

    this.setState({
      login: true,
      logout: false,
      refreshPosts: true,
    })
  }

  // doRefreshPosts is called after the user logs in, to display relevant posts.
  // there are probably more elegant ways to solve this problem, but this is... a way
  doRefreshPosts = () => {
    console.log('CALLING DOREFRESHPOSTS IN APP')
    this.setState({
      refreshPosts: true,
    })
  }

  // This doesn't really do anything, but I included it as a placeholder, as you are likely to
  // want to do something when the app loads.  You can define listeners here, set state, load data, etc.
  componentDidMount() {
    window.addEventListener('click', (e) => {
      console.log('TESTING EVENT LISTENER')
    })
  }

  // As with all react files, render is in charge of determining what shows up on the screen,
  // and it gets called whenever an element in the state changes.  There are three main areas of the app,
  // the navbar, the main content area, and a modal dialog that you can use for ... you know, modal
  // stuff.  It's declared at this level so that it can overlay the entire screen.
  render() {
    return (
      // the app is wrapped in a router component, that will render the
      // appropriate content based on the URL path.  Since this is a
      // single page app, it allows some degree of direct linking via the URL
      // rather than by parameters.  Note that the "empty" route "/", which has
      // the same effect as /posts, needs to go last, because it uses regular
      // expressions, and would otherwise capture all the routes.  Ask me how I
      //<Navbar toggleModal={e => toggleModal(this, e)} logout={this.logout}/>
      // know this.

      <Router basename={process.env.PUBLIC_URL}>
        <div className='App'>
          <header>
            <div className='maincontent' id='mainContent'>
              <Routes>
                <Route
                  path='/profile'
                  element={<Settings login={this.login} logout={this.logout}/>}
                />
                <Route
                  path='/following'
                  element={<Friends login={this.login} logout={this.logout} />}
                />
                <Route
                  path='/followers'
                  element={<Follower login={this.login} logout={this.logout} />}
                />
                <Route path='/groups' element={<Groups login={this.login} logout={this.logout} />} />
                <Route
                  path='/posts'
                  element={
                    <Posts
                      doRefreshPosts={this.doRefreshPosts}
                      login={this.login}
                      apprefresh={this.state.refreshPosts}
                    />
                  }
                />
                <Route path='/' element={<Index/>} />
                <Route
                  path='/home'
                  element={<HomePage login={this.login} logout={this.logout} />}
                />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/uploadprofpic' element={<UploadProfilePic />} />
                <Route path='/signin' element={<LoginForm />} />
                <Route path='/myClosed' element={<Closed/>} />
                <Route path='/prof' element={<OtherProfile login={this.login} logout={this.logout}/>} />
                <Route path='/reviews' element={<Rating login={this.login} logout={this.logout}/>} />
                <Route path='/createReview' element={<CreateRating login={this.login} logout={this.logout}/>} />
                <Route path='/myReviews' element={<Comments login={this.login} logout={this.logout}/>} />
                <Route path='/myPosts' element={<MyPosts login={this.login} logout={this.logout}/>} />
                <Route
                  exact={true}
                  path='/forgotpassword'
                  element={<ForgotPassword />}
                />
                <Route
                  exact={true}
                  path='/resetpassword'
                  element={<ResetPassword />}
                />
                <Route
                  exact={true}
                  path='/Details'
                  element={<Detail login={this.login} logout={this.logout}/>}
                />
                <Route
                  exact={true}
                  path='/createPost'
                  element={<CreateListing login={this.login} logout={this.logout} openModal={this.openModal}/>}
                ></Route>
                <Route
                  path='/myDrafts'
                  element={<Drafts login={this.login} logout={this.logout} />}
                />
                <Route
                  path='/FilterPage'
                  element={<Filter login={this.login} logout={this.logout}/>}
                />
                <Route
                  path='/blockedUsers'
                  element={<Block login={this.login} logout={this.logout}/>}
                />
              </Routes>
            </div>
          </header>

          <Modal
            show={this.state.openModal}
            onClose={(e) => toggleModal(this, e)}
          >
            This is a modal dialog!
          </Modal>
        </div>
      </Router>
    )
  }
}

/*  BEGIN ROUTE ELEMENT DEFINITIONS */
// with the latest version of react router, you need to define the contents of the route as an element.  The following define functional components
// that will appear in the routes.

const Settings = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the Profile page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        < Index/>
      </div>
    )
  }
  return (
    <div className='Profile'>
      <Profile userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Friends = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the friends page
  if (!sessionStorage.getItem('token')) {
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div>
      <FriendForm userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Follower = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the friends page
  if (!sessionStorage.getItem('token')) {
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div>
      <FollowerForm userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Groups = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the groups form
  if (!sessionStorage.getItem('token')) {
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div>
      <p>Join a Group!</p>
      <GroupList userid={sessionStorage.getItem('user')} />
    </div>
  )
}

const Posts = (props) => {
  console.log('RENDERING POSTS')
  console.log(typeof props.doRefreshPosts)

  console.log('TEST COMPLETE')

  // if the user is not logged in, show the login form.  Otherwise, show the post form
  if (!sessionStorage.getItem('token')) {
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  } else {
    console.log('LOGGED IN')
    return (
      <div>
        <Index/>
      </div>
    )
  }
}

const HomePage = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the Home page
  if (!sessionStorage.getItem('token')) {

    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <LoginForm/>
      </div>
    )
  }
  return (
    <div className='Home'>
      <Home userid={sessionStorage.getItem('user')} logout={props.logout} />
    </div>
  )
}

const CreateListing = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the CreatePost page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='CreatePost'>
      <ListingProductCard userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const OtherProfile = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the OtherProfile page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='OtherProf'>
      <OtherProf userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Rating = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the ratings page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='Reviews'>
      <RateList userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const CreateRating = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the Create review page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='CreateReview'>
      <RateCreate userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Comments = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the comment page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='comment'>
      <Comment userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const MyPosts = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the myPost page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='myPosts'>
      <MyPost userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Detail = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the Details page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='Details'>
      <Details userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Drafts = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the myDrafts page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='myDrafts'>
      <DraftsPage userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Filter = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the filter page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='filter'>
      <FilterPage userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

const Block = (props) => {
  // if the user is not logged in, show the login form.  Otherwise, show the blocked page
  if (!sessionStorage.getItem('token')) {
    //change this back to NOT when sign in works
    console.log('LOGGED OUT')
    return (
      <div>
        <Index/>
      </div>
    )
  }
  return (
    <div className='blocked'>
      <Blocked userid={sessionStorage.getItem('user')} logout={props.logout}/>
    </div>
  )
}

/* END ROUTE ELEMENT DEFINITIONS */

// export the app for use in index.js
export default App
