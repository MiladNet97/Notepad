// variables
let noteForm = document.querySelector('#note__form');
let notes = localStorage.getItem('notes')


if (notes == null) notes = [];
else notes = JSON.parse(notes);

// everything related to html ui
function showMessage(message, className) {
  let div = document.createElement('div');
  div.className = `alert alert-${className} text-center`
  div.appendChild(document.createTextNode(message))
  let messageBox = document.querySelector('.message-box');
  messageBox.prepend(div)

  // remove message after 3second
  if (className) {
    Array.from(messageBox.children).forEach(alert => {
      setTimeout(() => {
        alert.classList.add('remove')
        setTimeout(() => alert.remove(), 100);
      }, 3000);
    })
  }
}

noteForm.addEventListener('submit', e => {
  e.preventDefault()
  if (noteForm.title.value.trim() !== '' && noteForm.text.value.trim() !== '') {
    let color = document.querySelector('.swatches').querySelector('.active').classList[0];
    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
      date = new Date(),
      nowDate = date.toLocaleDateString("en-US", options);
    let myObj = {
      title: noteForm.title.value,
      text: noteForm.text.value,
      color: color,
      date: nowDate,
    }

    notes.push(myObj)
    localStorage.setItem('notes', JSON.stringify(notes))
    noteForm.title.value = ''
    noteForm.text.value = ''

    showNotes(notes)
    showMessage('note added', 'success')

  } else {
    showMessage('Please fill in all fields', 'danger')
  }

})

function showNotes(notesArray) {
  let html = "";
  notesArray.forEach((note, index) => {
    html += `
    <div class="card col-lg-6 border-0  mb-3 px-1 bg-transparent">
        <div class="card-header bg-secondary d-flex justify-content-between align-items-center border-white">
            <span>Note #${index + 1}</span>
            <h5 class="text-white mb-0">${note.title}</h5>
            <span class="d-flex align-items-center">
              <i id="${index}" onclick="editNote(this.id)" class="fas fa-pencil-alt note-edit text-white"></i>
              <i id="${index}" onclick="deleteNote(this.id)" class="fas fa-trash-alt note-remove text-white ml-3"></i>
            </span>
        </div>
        <div class="card-body ${note.color} ${note.color=='bg-light'?'text-dark':''} p-0">
            <p class="card-text p-3 mb-0">${note.text}</p>
            <small class="${note.color} ${note.color=='bg-light'?'text-dark':''} border-top border-dark d-block px-3 py-1">${note.date}</small>
        </div>
    </div>
    `
  });
  let noteList = document.querySelector('#note-list')
  if (notesArray.length !== 0) {
    noteList.innerHTML = html;
  } else {
    noteList.innerHTML = 'No Notes Yet!';
  }
}

// delete Note
function deleteNote(index) {
  showMessage('note deleted!', 'danger')
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes))
  showNotes(notes)
}

// edit Note
function editNote(index) {
  notes.findIndex((note, i) => {
    if (index == i) {
      noteForm.title.value = note.title;
      noteForm.text.value = note.text;
      let swatches = document.querySelector('.swatches').children,
        i = swatches.length;
      while (i--) {
        swatches[i].classList.remove('active');
      }
      document.querySelector(`.${note.color}`).classList.add('active');
    }

  })
  notes.splice(index, 1);

  localStorage.setItem('notes', JSON.stringify(notes))
}

// choose color
document.querySelector('.swatches').addEventListener('click', e => {
  if (e.target.classList.contains('swatch')) {
    let swatches = document.querySelector('.swatches').children;
    let i = swatches.length;
    while (i--) swatches[i].classList.remove('active');
    e.target.classList.add('active');
  }
})

// search in notes
let search = document.querySelector('#search');
search.addEventListener('keyup', () => {
  if (search.search.value) {
    let filter = notes.filter(note => note.text.toLowerCase().includes(search.search.value.toLowerCase()))
    showNotes(filter)
    if (filter == '') {
      let noteList = document.querySelector('#note-list')
      noteList.innerHTML = 'Not Found';
    }
  } else {
    showNotes(notes)
  }
})

showNotes(notes)