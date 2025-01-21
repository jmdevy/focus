import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Task, {TaskDuration, TaskDays, TaskDaysKeys, TaskDurationKeys} from "./task";
import { Button, Checkbox, Input, Join } from "react-daisyui";

interface AddTaskPopupProps{
    addTask:(task:Task) => void;
}

export interface AddTaskPopupRef{
    show:() => void,
    hide:() => void
}

const AddTaskPopup = forwardRef<AddTaskPopupRef, AddTaskPopupProps>(({addTask}, ref) => {
    const nameDefault = ""
    const daysDefault:TaskDays = {sun:false, mon:false, tue:false, wed:false, thu:false, fri:false, sat:false};
    const durationDefault:TaskDuration = {hours:0, minutes:0, seconds:0};

    const [visible, setVisible] = useState<Boolean>(false);
    const [name, setName] = useState<string>(nameDefault);
    const [days, setDays] = useState<TaskDays>(daysDefault);
    const [duration, setDuration] = useState<TaskDuration>(durationDefault);
    
    // Called to show this modal. Resets all inputs
    const handleShow = () => {
        setVisible(true);
        setName(nameDefault);
        setDays(daysDefault);
        setDuration(durationDefault);
    }

    // Called to hide this modal
    const handleHide = () => {
        setVisible(false);
    }

    const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleDayChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const id = target.id as TaskDaysKeys;
        const day:TaskDaysKeys = id;

        days[day] = target.checked;
        setDays({...days});
    }

    const handleDurationChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const id = target.id as TaskDurationKeys;
        const time:TaskDurationKeys = id;

        duration[time] = target.value;
        setDuration({...duration});
    }

    const handleAddTaskClick = (event:React.MouseEvent<HTMLButtonElement>) => {
        addTask(new Task(name, duration, days, false));
        handleHide();
    }

    const overlayCloseClick = (event:React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        
        if(target.id == "overlay"){
            handleHide()
        }
    }

    useImperativeHandle(ref, () => ({
        show(){
            handleShow();
        },
        hide(){
            handleHide();
        }
    }));

    return(
        <div id="overlay" className={"absolute ease-linear w-full h-full flex justify-center items-center transition-all duration-150 " + (visible ? "visible bg-base-300" : "invisible opacity-0")} onClick={overlayCloseClick} style={{backgroundColor:"rgba(1.0, 1.0, 1.0, 0.65)"}}>
            <div className="w-[32rem] h-96 bg-base-300 rounded-3xl flex flex-col items-center">
                {/* Header */}
                <div className="w-full h-16 flex items-center ml-8">
                    <p className="font-bold text-lg">Add Task</p>
                </div>

                {/* Body */}
                <div className="w-min h-full flex flex-col items-center">
                    <div className="w-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <Input type="text" placeholder="Task Name" value={name} className="w-full" onChange={handleNameChange}/>
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Days</span>
                        </label>
                        <Join className="w-min h-min flex bg-error">
                            <input id="sun" checked={days.sun} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="S" onChange={handleDayChange}></input>
                            <input id="mon" checked={days.mon} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="M" onChange={handleDayChange}></input>
                            <input id="tue" checked={days.tue} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="T" onChange={handleDayChange}></input>
                            <input id="wed" checked={days.wed} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="W" onChange={handleDayChange}></input>
                            <input id="thu" checked={days.thu} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="T" onChange={handleDayChange}></input>
                            <input id="fri" checked={days.fri} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="F" onChange={handleDayChange}></input>
                            <input id="sat" checked={days.sat} type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="S" onChange={handleDayChange}></input>
                        </Join>
                    </div>
                    

                    <div className="grid grid-rows-2 grid-cols-3 w-full h-min">

                        <label className="label">
                            <span className="label-text m-auto">Hours</span>
                        </label>

                        <label className="label">
                            <span className="label-text m-auto">Minutes</span>
                        </label>

                        <label className="label">
                            <span className="label-text m-auto">Seconds</span>
                        </label>

                        <Input id="hours"   value={duration["hours"]}   type="number" min="0" max="24" step="1" className="mx-1" onChange={handleDurationChange}/>
                        <Input id="minutes" value={duration["minutes"]} type="number" min="0" max="59" step="1" className="mx-1" onChange={handleDurationChange}/>
                        <Input id="seconds" value={duration["seconds"]} type="number" min="0" max="59" step="1" className="mx-1" onChange={handleDurationChange}/>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full h-24 flex justify-center items-center">
                    <Button color="primary" className="mx-4" onClick={handleAddTaskClick}>Add</Button>
                    <Button color="primary" className="mx-4" onClick={handleHide}>Cancel</Button>
                </div>
            </div>
        </div>
    );
});

export default AddTaskPopup;