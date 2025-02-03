"use client"

import { ReactNode, useEffect, useRef, useState } from "react";
import { Button, Theme, Join } from "react-daisyui";
import Task from "./ts/utils/task";
import AddTaskPopup, {AddTaskPopupRef} from "./components/AddTaskPopup";
import TaskWidget from "./components/TaskWidget";
import AlertPopup, {AlertRef} from "./components/AlertPopup";
import { saveTasks, restoreTasks } from "./ts/utils/storage";

enum Filter {
	TODO=0,
	DONE=1,
	ALL=2
}

export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filter, setFilter] = useState<Filter>(Filter.TODO);
	const [count, setCount] = useState<number>(0);
	const addTaskRef = useRef<AddTaskPopupRef>(null);
	const alertRef = useRef<AlertRef>(null);

	// Add task to task list
	const addTask = (task:Task) => {
		setTasks([...tasks, task]);
	}

	// Remove a task
	const delTask = (task:Task) => {
		const nonDeletedTasks = [];

		for(let i=0; i<tasks.length; i++){
			if(tasks[i].info.name != task.info.name){
				nonDeletedTasks.push(tasks[i]);
			}
		}

		setTasks(nonDeletedTasks);
	}

	// Search to see if a task already exists
	const searchTask = (name:string):boolean => {
		for(let i=0; i<tasks.length; i++){
			if(tasks[i].info.name == name){
				return true;
			}
		}
		return false;
	}

	const getTaskCount = (filter:Filter):number => {
		let count:number = 0;

		for(let i=0; i<tasks.length; i++){
			if(filter == Filter.TODO && !tasks[i].info.completed && tasks[i].forToday()){
				count++;
			}else if(filter == Filter.DONE && (tasks[i].info.completed || !tasks[i].forToday())){
				count++
			}else if(filter == Filter.ALL){
				count++;
			}
		}

		return count;
	}

	const addTaskClick = ():void => {
		addTaskRef.current?.show();
	}

	const saveAllTasks = ():void => {
		saveTasks(tasks);
	}

	// Called by any task that completes so that count can be updated
	const updateTaskCount = (taskName:string):void => {
		setCount(getTaskCount(filter));
		alertRef.current?.show("Great job! Task '" + taskName + "' complete!");
		saveAllTasks();
	}

	const renderTasks = ():ReactNode[] => {
		return tasks.map((task:Task, index:number) => {
			if((!task.info.completed && (filter == Filter.TODO || filter == Filter.ALL) && task.forToday()) ||
				((task.info.completed || !task.forToday()) && (filter == Filter.DONE || filter == Filter.ALL))){
				return(
					<TaskWidget key={index} task={task} updateTaskCount={updateTaskCount} delTask={delTask}/>
				)
			}
		});
	}

	// On component startup, restore tasks if
	// saved in browser local storage/cookie
	useEffect(() => {
		restoreTasks(setTasks);
	}, []);

	// Update when `tasks` or `filter` changes
	useEffect(() => {
		setCount(getTaskCount(filter));
		saveAllTasks();
	}, [tasks, filter]);

	return (
		<Theme dataTheme="coffee" className="absolute top-0 bottom-0 left-0 right-0 flex overflow-hidden">
			<AddTaskPopup addTask={addTask} searchTask={searchTask} ref={addTaskRef}/>
			<AlertPopup ref={alertRef}/>

			<div className="w-full mx-auto max-w-96 flex flex-col">
		

				{/* Button header */}
				<div className="w-full h-12 flex flex-row mt-4">
					<div className="h-full flex-1 flex items-center">
						<Button color="primary" className="justify-self-start" onClick={addTaskClick}>+ Add Task</Button>
					</div>
					<div className="h-full flex-1 flex items-center">
						<Join>
							<input onClick={() => {setFilter(Filter.TODO)}} className="join-item btn flex-1" type="radio" name="options" aria-label="TODO" defaultChecked/>
							<input onClick={() => {setFilter(Filter.DONE)}} className="join-item btn flex-1" type="radio" name="options" aria-label="DONE" />
							<input onClick={() => {setFilter(Filter.ALL)}}  className="join-item btn flex-1" type="radio" name="options" aria-label="ALL" />
						</Join>
					</div>
				</div>

				{/* Main task list */}
				<div className="relative w-full h-full bg-base-200 rounded rounded-3xl my-4 overflow-y-auto" style={{scrollbarWidth:"thin"}}>
					<span className="absolute left-6 top-5 opacity-25">{count}</span>
					{renderTasks()}
				</div>

			</div>
		</Theme>
	);
}
