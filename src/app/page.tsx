"use client"

import { ReactNode, useRef, useState } from "react";
import { Button, Theme, Join } from "react-daisyui";
import Task from "./task";
import AddTaskPopup, {AddTaskPopupRef} from "./AddTaskPopup";
import TaskWidget from "./TaskWidget";


export default function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const modalRef = useRef<AddTaskPopupRef>(null);

	const addTask = (task:Task) => {
		setTasks([...tasks, task]);
	}

	const addTaskClick = () => {
		modalRef.current?.show();
	}

	const renderTasks = (): ReactNode[] => {
		return tasks.map((task:Task, index:number) => {
			return(
				<TaskWidget key={index} task={task}/>
			)
		});
	}

	return (
		<Theme dataTheme="coffee" className="h-screen flex">
			<AddTaskPopup addTask={addTask} ref={modalRef}/>

			<div className="w-full mx-auto max-w-96 flex flex-col">
		

				{/* Button header */}
				<div className="w-full h-12 flex flex-row mt-4">
					<div className="h-full flex-1 flex items-center">
						<Button color="primary" className="justify-self-start" onClick={addTaskClick}>+ Add Task</Button>
					</div>
					<div className="h-full flex-1 flex items-center">
						<Join>
							<input className="join-item btn flex-1" type="radio" name="options" aria-label="TODO" defaultChecked/>
							<input className="join-item btn flex-1" type="radio" name="options" aria-label="DONE" />
							<input className="join-item btn flex-1" type="radio" name="options" aria-label="ALL" />
						</Join>
					</div>
				</div>

				{/* Main task list */}
				<div className="w-full h-full bg-base-200 rounded rounded-3xl my-4 overflow-y-auto" style={{scrollbarWidth:"thin"}}>
					{renderTasks()}
				</div>

			</div>
		</Theme>
	);
}
