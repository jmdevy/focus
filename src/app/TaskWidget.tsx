"use client"

import React, { useEffect, useState } from "react";
import Task from "./task";
import { Button, RadialProgress } from "react-daisyui";

interface TaskWidgetProps{
    task:Task;
    taskCompleteUpdate:(taskName:string) => void;
}

const TaskWidget: React.FC<TaskWidgetProps> = ({task, taskCompleteUpdate}) => {

    const [duration, setDuration] = useState<string>("");
    const [complete, setComplete] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const handleMouseEnter = ():void => {
        setShowSettings(true);
    }

    const handleMouseLeave = ():void => {
        setShowSettings(false);
    }

    const taskTick = () => {
        setDuration(task.durationToStr(task.currentDuration));
    }

    const taskComplete = () => {
        setComplete(true);
        taskCompleteUpdate(task.name);
    }

    const getButtonSymbol = () => {
        if(complete){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
                </svg>
            );
        }else if(task.started){
            return(
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
                </svg>
            );
        }else{
            return(
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                </svg>
            );
        }
    }

    useEffect(() => {
        setDuration(task.durationToStr(task.currentDuration));
    }, [])

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="grid grid-rows-8 grid-cols-8 bg-base-300 aspect-square m-10 p-4 rounded-3xl outline outline-1 outline-base-100 hover:outline-secondary ease-linear transition-all duration-75">
            <div className=""></div>
            <div className="col-span-6 m-auto font-bold text-xl select-none">{task.name}</div>
            <div className="aspect-square w-6 h-6 rounded rounded-full m-auto outline outline-1 outline-gray-700"></div>


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
                    <Button size="md" shape="square" className="z-[1000]" onClick={() => {task.toggle(taskTick, taskComplete)}}>
                        {getButtonSymbol()}
                        
                    </Button>
                </div>
            </div>


            <div className={"ease-linear transition-all duration-75 " + (showSettings ? "opacity-100" : "opacity-0")}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                </svg>
            </div>

            <div className="col-span-6 m-auto font-bold tracking-wider select-none">
                {task.daysStr()}
            </div>

            <div className=""></div>
        </div>
    );
}

export default TaskWidget;