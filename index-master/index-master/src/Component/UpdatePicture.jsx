import React from 'react'
import ReactDOM from 'react-dom'

var myHeaders = new Headers()
myHeaders.append('accept', '*/*')
myHeaders.append('Authorization', sessionStorage.getItem('token'))

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
}

fetch(
  'https://webdev.cse.buffalo.edu/hci/api/api/index/file-uploads?uploaderID=' +
    sessionStorage.getItem('id'),
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log('error', error))

function updatePicture(props) {
  var formdata = new FormData()
  formdata.append('uploaderID', sessionStorage.getItem('user'))
  formdata.append('attributes', '{}')

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

ReactDOM.render(<input type='file' />)
