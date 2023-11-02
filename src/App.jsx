import { useState, useEffect } from 'react'
import Note from './components/note.jsx'

function App() {
  const [notes, setNotes] = useState([])

  function loadNotes()
  {
    if (localStorage.getItem("notes") == null) return // Verifica si existe alguna nota guardada para continuar

    // Convierte el texto guardado a una lista
    var loadedNotes = localStorage.getItem("notes").split("<note>") 
    
    loadedNotes = loadedNotes.filter(item => { // Filtra notas vacias
      return (item != "" || item != undefined || item != null)
    })

    loadedNotes = loadedNotes.map(item => {
      return decodeURI(item)
    })
    
    setNotes(loadedNotes) // Actualiza el estado de las notas
  }

  useEffect(() => {
    loadNotes()
  },[]);

  function saveNote(innerText)
  {
    var existingNotes = localStorage.getItem("notes") || "" // consigue las notas existentes
    
    // guarda la informacion en el local Storage
    localStorage.setItem("notes", existingNotes + "<note>"+encodeURI(innerText)) 
  }

  function submitNote()
  {
    var input = document.getElementById("noteInput")
    if (input.value.replace(/ /g,"") == "") return; // Verifica si el texto no es vacio para continuar

    saveNote(input.value)
    setNotes([...notes, input.value]) // parecido a array.push(), inserta el texto como ultimo elemento
    
    input.value = ""
  }

  function removeNote(innerText)
  {
    const noteIndex = notes.indexOf(innerText)
    if (noteIndex == -1) return // verifica si la nota existe en la lista mostrada en la pagina

    var savedNotes = localStorage.getItem("notes") || ""
    savedNotes = savedNotes.replace("<note>"+encodeURI(innerText),"")
    localStorage.setItem("notes", savedNotes) // Remueve la nota de las notas guardadas

    var newNotes = [...notes]
    newNotes.splice(noteIndex, 1)

    setNotes(newNotes)
  }

  return (
    <>
      <div>
        <input id='noteInput' type="text" placeholder='Text here' onKeyDown={(e) => {if (e.key == 'Enter') submitNote()}}/>
        <button onClick={submitNote}>Submit</button>
      </div>

      {notes.map((data, index) => (
        <Note key={index} text={data} onClick={removeNote}/>
      ))}
    </>
  )
}

export default App
