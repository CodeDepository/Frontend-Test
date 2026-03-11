'use client'
import React, { useState } from 'react';
import styles from './test.module.css';

// Your Test Starts Here

// A task Structure
type Task = {
    id : string,
    title : string,
    completed : boolean,
    priority : "Low" | "Medium" | "High"
};

// Filter options the user can switch between
type Filter = "All" | "In-Progress" | "Completed"

export default function TaskManager(): JSX.Element {
    const [title,setTitle] = useState("");
    const [tasks,setTask] = useState<Task[]>([]);
    const [error, setError] = useState("");
    const [priority,setPriority] = useState<"Low" | "Medium" | "High">("Medium"); // Setting "Medium" as default on load
    const [filter,setFilter] = useState<Filter>("All");

    // Here we are sorting the a copy of our task list which will make the completed ones always appear below the active ones. 
    // We compares two tasks at a time, if both have the same completion status, we keep their current order.
    // If task x is completed, return 1 so it moves after y
    // Otherwise return -1 so unfished tasks stay before completed ones. 
    const sortedTasks = [...tasks].sort((x, y) => {
        if (x.completed === y.completed) {return 0;}
        if (x.completed) {return 1;}
        return -1;
    });


    // Applying the active filter on top of the sorted list
    const visibleTask = sortedTasks.filter((task) => {
        if(filter === "In-Progress"){
            return task.completed === false;
        }
        if (filter === "Completed"){
            return task.completed === true;
        }
        return true;
    })

    let emptyMessage;
    if (tasks.length === 0) {
        emptyMessage = "No tasks yet. Add your first task above.";
    } else if (visibleTask.length === 0) {
        emptyMessage = "No tasks found for this filter.";
    } else {
        emptyMessage = null;
    }

    function addTask() {
        const trimmedTitle = title.trim();

        if (!trimmedTitle){
            setError("Task title cannot be empty")
            return;
        }

        // Building new Task object 
        const newTask : Task = {
            id : crypto.randomUUID(), 
            title : trimmedTitle,
            completed : false,
            priority:priority,
        }

        setTask([newTask,...tasks]); //Newest task appears at the top of the list.
        setTitle(""); 
        setPriority("Medium");
    }

    // It toggles the boolean of "completed" of task, with given task ID.
    function toggleTask(id: string) {
        const updatedTask = tasks.map((task) => {
            if (task.id === id) {
                return {
                    ...task,
                    completed : !task.completed,
                };
            }
            return task;
        });
        setTask(updatedTask);
    }

    // Remove the task with the given task id.
    function deleteTask(id: string) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTask(updatedTasks);
    }

    // Event Handler to add Task on pressing "Enter" key.
    function handleKeyDown(event:React.KeyboardEvent<HTMLInputElement>){
        if(event.key === "Enter"){
            addTask();
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Task Manager</h1>
            {/* Input Area */}
            <div className={styles.inputSection}>
                <div className={styles.inputRow}>
                    <div>
                    <label htmlFor="task-input">Task title</label>
                    <input id="task-input" className={styles.input} type="text" placeholder="Enter a task" value={title}  
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (error) {
                                setError("");
                            }
                        }}
                       onKeyDown={handleKeyDown}
                    />
                    </div>
                    {/* Priority dropdown */}
                    <div>
                        <label htmlFor="priority-select">Priority</label>
                        <select id="priority-select" className={styles.select} value={priority}
                            onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <button className={styles.button} onClick={addTask}>Add Task</button>
                </div>                
            </div>
            {/*Filter Tabs and aria-pressed which tells screen readers whether this filter is active */}            
            <div className={styles.filterRow}>
                <button
                    className={filter === "All" ? styles.activeFilter : styles.filterButton}
                    onClick={() => setFilter("All")}
                    aria-pressed={filter === "All"}
                >
                    All
                </button>

                <button
                    className={filter === "In-Progress" ? styles.activeFilter : styles.filterButton}
                    onClick={() => setFilter("In-Progress")}
                    aria-pressed={filter === "In-Progress"}
                >
                    In-Progress
                </button>

                <button
                    className={filter === "Completed" ? styles.activeFilter : styles.filterButton}
                    onClick={() => setFilter("Completed")}
                    aria-pressed={filter === "Completed"}
                >
                    Completed
                </button>   
            </div>
           
            {emptyMessage ? (<p className={styles.emptyMessage}>{emptyMessage}</p>) : (
                <ul className={styles.list}>
                    {visibleTask.map((task) => (
                        <li key={task.id} className={styles.listItem}>
                            <div className={styles.taskLeft}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id)}
                                    aria-label={`Mark task ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                                />
                                <div className={styles.taskInfo}>
                                    <span className={task.completed ? styles.completedText : styles.taskText}>{task.title}</span>
                                    <span className={styles.priorityText}>{task.priority}</span>
                                </div>
                            </div>
                            <button className={styles.deleteButton} onClick={() => deleteTask(task.id)} aria-label={`Delete task ${task.title}`}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );           
};