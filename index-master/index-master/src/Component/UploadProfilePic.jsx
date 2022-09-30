import React from 'react'
import ReactDOM from 'react-dom'
import '../App.css'

export default class UploadProfilePic extends React.Component {
  handleUpload = () => {
    var formdata = new FormData()
    formdata.append('uploaderID', sessionStorage.getItem('user'))
    formdata.append('attributes', '{"profilePicture": true}')
    formdata.append('file', document.getElementById('fileid').files[0])

    var requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: formdata,
    }

    // '2' at end needs to be removed with getFileID
    fetch(
      'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads/',
      requestOptions
    ).then((response) => {
      if (response.status === 201) {
        window.location.reload()
      }
    })
  }
  
  render() {
    return (

      <center>      
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <br/>
      <br/><div className='upload-profile'>
        <h4>You need to upload a profile picture before continuing</h4>
        <br />

        <input type='file' id='fileid' name='myfile'></input><br /><br /><br /><br />
        <button className='button-upload' onClick={this.handleUpload}>
          Upload File
        </button>
      </div></center>
    )
  }
}
