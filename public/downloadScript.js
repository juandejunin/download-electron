function clearUrlInput () {
  document.getElementById('urlInput').value = ''
}

function showMessage (message) {
  alert(message)
}

function sendRequest () {
  const form = document.getElementById('downloadForm')
  const formData = new FormData(form)

  fetch('http://localhost:3000/download', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.errors ? data.errors[0].msg : 'Error en la red')
        })
      }
    })
    .then(data => {
      showMessage('¡Descarga completa!')
      clearUrlInput()
    })
    .catch(error => {
      console.error('Error:', error)
      showMessage(error.message)
    })
}
