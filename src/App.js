import React, { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
// use nanoid to prevent each task from having the same id ( This is bad for accessibility, and makes it impossible for React to tell future tasks apart with the key prop.)
import Form from "./components/Form"
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current
}

//Defined consts below outside of App() function to avoid rerendering this info

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [filter, setFilter] = useState('All');
  const [tasks, setTasks] = useState(props.tasks);
  function addTask(name) {
    /*  const newTask = { id: 'id', name, completed: false }; */
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask])
    /*   alert(name); */
  }
  // toggling a checkbox doesn't change the state in our React application. 
  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      //if this task has the same ID as the edited task
      if (id === task.id) {
        //use object spread to make a new object
        //whose `completed` prop has been inverted
        return { ...task, completed: !task.completed }
      }
      return task;
    })
    setTasks(updatedTasks);
    /*  console.log(tasks[0]) */
  }
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName }
      }
      return task;
    })
    setTasks(editedTaskList);
  }
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks)
    /*   console.log(id) */
  }
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));
  const filterList = FILTER_NAMES.map((name) => {
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  });

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task'; // if we have only one task we want it to say task instead of tasks!
  const headingText = `${taskList.length} ${tasksNoun} remaining`; //const to dynamically update header with correct ammount of tasks remaining

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      {/*      Heading elements like our <h2> are not usually focusable.  
          -can make any element programmatically focusable by adding the attribute tabindex="-1"
          -This means only focusable with JavaScript. 
          -Good for accessibility edge-cases, but don't overuse it as it can have a negative impact on keyboard/screen-reader users
          -Only apply a tabindex on an element when you're absolutely sure that making it focusable will benefit the user -> try to utilize elements that can naturally take focus ex: buttons, anchors, and inputs
 */}
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
        {/*         <Todo name="Code" completed={true} id="todo-0" />
        <Todo name="Eat" completed={false} id="todo-1" />
        <Todo name="Sleep" completed={false} id="todo-2" />
        <Todo name="Repeat" completed={false} id="todo-3" /> */}
      </ul>
    </div>
  );
}

export default App;
