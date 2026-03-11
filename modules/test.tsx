'use client'
import React, { useState } from 'react';
import styles from './test.module.css';

// Your Test Starts Here
type Task = {
    id : string,
    title : string,
};

export default function TaskManager(): JSX.Element {
    const [title,setTitle] = useState("");
    const [task,setTask] = useState<Task[]>([]);

    function addTask() {
        const trimmedTitle = title.trim();

        if (!trimmedTitle){
            return;
        }

        const newTask : Task = {
            id : crypto.randomUUID(),
            title : trimmedTitle
        }

        setTask([newTask,...task]);
        setTitle("");
    }

    return <div className={styles.container}>
        
    </div>;
};