import {useState } from 'react'
import './App.css'

function DisplayTodos({todos,handleUpdate, handleDelete}) {

  let todoDiv  = Object.values(todos).map(item => 
    <div key={item.id} data-todo-id={item.id}>
        <div>{item.title}</div>
        <div>{item.description}</div>
        <button onClick={handleUpdate}>Update Todo</button>
        <button onClick={handleDelete}>Delete Todo</button>
        <br></br>
    </div>
    )
    return <> {todoDiv} </>
}

function App() {
  let [globalId, setGlobalId] = useState(0);
  let [formData, setFormData] = useState({"title": "","description": ""});
  let [todoData, setTodoData] = useState([])

  const handleUpdate =  (event) => {
    let updateTodoId = event.target.parentElement.getAttribute("data-todo-id")
    setTodoData((prevTodoData) => {
      return prevTodoData.map((todo) => {
        if (todo.id === parseInt(updateTodoId)) {
          // Update the specific todo item
          return {
            ...todo,
            title: formData.title,
            description: formData.description,
          };
        }
        return todo;
      });
  })}

  const handleDelete = (event) => {
    let deleteTodoId = event.target.parentElement.getAttribute("data-todo-id")
    setTodoData((prevTodoData) => {
      return prevTodoData.filter((todo) => todo.id !== parseInt(deleteTodoId));
  })
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      setTodoData((prevTodoData) => [ ...prevTodoData, {"id": globalId, "title": formData["title"], "description": formData["description"]}])

      setFormData({ "title": "", "description": "" });
      setGlobalId((prevId) => prevId +1)
      console.log(globalId)
  };

  return (
    <>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <label>Title: </label>
        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}/>
        <br></br>
        <label>Description:</label>
        <input type="description" id="description" name="description" value={formData.description} onChange={handleChange}/>
        <br></br>
        <button type="submit">Submit</button>
      </form>
      <DisplayTodos todos={todoData} handleUpdate={handleUpdate} handleDelete={handleDelete}></DisplayTodos>
      
    </>
  )
}

export default App
