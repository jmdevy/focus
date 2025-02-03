"use client"

import React, { useEffect, useState } from "react";
import Task from "../ts/utils/task";
import { Button, RadialProgress } from "react-daisyui";

interface TaskWidgetProps{
    task:Task;
    updateTaskCount:(taskName:string) => void;
    delTask:(task:Task) => void;
    saveAllTasks:() => void;
}

const TaskWidget: React.FC<TaskWidgetProps> = ({task, updateTaskCount, delTask, saveAllTasks}) => {

    const [complete, setComplete] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    const [duration, setDuration] = useState<string>("");
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const handleMouseEnter = ():void => {
        setShowOptions(true);
    }

    const handleMouseLeave = ():void => {
        setShowOptions(false);
    }

    const taskTick = () => {
        setComplete(false);
        setStarted(true);
        setDuration(task.durationToStr(task.info.currentDuration));
    }

    const taskComplete = () => {
        updateTaskCount(task.info.name);
        setComplete(true);
        setStarted(false);
    }

    const getButtonSymbol = () => {
        if(started){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
                </svg>
            );
        }else if(!started){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                </svg>
            );
        }else{
            return(
                <>?</>
            )
        }
    }

    const start = () => {
        if(started){
            setStarted(false);
            task.toggle(taskTick, taskComplete);
        }else{
            setStarted(true);
            setComplete(false);
            task.toggle(taskTick, taskComplete);
        }
    }

    useEffect(() => {
        setComplete(task.info.completed);
        setStarted(false);
    }, [task])

    useEffect(() => {
        setDuration(task.durationToStr(task.info.currentDuration));
    }, [task])

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="grid grid-rows-8 grid-cols-8 bg-base-300 aspect-square m-10 p-4 rounded-3xl outline outline-1 outline-base-100 hover:outline-secondary ease-linear transition-all duration-75">
            <div className=""></div>
            <div className="col-span-6 m-auto font-bold text-xl select-none">{task.info.name}</div>
            <div className={"aspect-square w-6 h-6 rounded rounded-full m-auto outline outline-1 outline-gray-700 " + (complete ? "bg-success" : "")}></div>


            <div className="relative row-span-6 col-span-8 col-span-2 flex items-center justify-center">
                <RadialProgress value={100} color="secondary" size="12rem" thickness="0.5rem" className="font-bold text-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                </RadialProgress>

                {
                    task.progress() > 0 ?
                    <RadialProgress value={task.progress()} size="12rem" thickness="0.5rem" className="flex flex-row font-bold text-lg items-center flex-wrap absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                    </RadialProgress>
                                 :
                    <></>
                }
                

                <div className="w-min h-min flex flex-wrap justify-center">
                    <span className="select-none">{duration}</span>
                    <div className="basis-full h-0"></div>
                    <Button size="md" shape="square" className="z-[1000]" onClick={start} disabled={complete}>
                        {getButtonSymbol()}
                    </Button>
                </div>
            </div>


            <div onClick={() => {delTask(task)}} className={"ease-linear transition-all duration-75 flex items-center justify-center " + (showOptions ? "opacity-100" : "opacity-0")}>
                <Button size="sm" shape="square">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                    </svg>
                </Button>
            </div>

            <div className="col-span-6 m-auto font-bold tracking-wider select-none">
                {task.daysStr()}
            </div>

            
        </div>
    );
}

export default TaskWidget;