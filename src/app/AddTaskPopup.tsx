import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Task from "./task";
import { Button, Checkbox, Input, Join } from "react-daisyui";

interface AddTaskPopupProps{
    addTask:(task:Task) => void;
}

export interface AddTaskPopupRef{
    show:() => void,
    hide:() => void
}

const AddTaskPopup = forwardRef<AddTaskPopupRef, AddTaskPopupProps>(({addTask}, ref) => {
    const [visible, setVisible] = useState<Boolean>(false);
    
    const overlayCloseClick = (event:React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        
        if(target.id == "overlay"){
            setVisible(false);
        }
    }

    useImperativeHandle(ref, () => ({
        show(){
            setVisible(true);
        },
        hide(){
            setVisible(false);
        }
    }));

    return(
        <div id="overlay" className={"absolute ease-linear w-full h-full flex justify-center items-center transition-all duration-150 " + (visible ? "visible bg-base-300" : "invisible opacity-0")} onClick={overlayCloseClick} style={{backgroundColor:"rgba(1.0, 1.0, 1.0, 0.65)"}}>
            <div className="w-[32rem] h-96 bg-base-300 rounded-3xl flex flex-col items-center">
                {/* Header */}
                <div className="w-full h-16 flex items-center ml-6">
                    <p className="font-bold text-lg">Add Task</p>
                </div>

                {/* Body */}
                <div className="w-min h-full flex flex-col items-center">
                    <div className="w-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <Input className="w-full"/>
                    </div>
                    
                    <div>
                        <label className="label">
                            <span className="label-text">Days</span>
                        </label>
                        <Join className="w-min h-min flex bg-error">
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="S"></input>
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="M"></input>
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="T"></input>
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="W"></input>
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="T"></input>
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="F"></input>
                            <input type="checkbox" className="join-item btn w-full rounded-none flex-1" aria-label="S"></input>
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

                        <Input type="number" className="mx-1"/>
                        <Input type="number" className="mx-1"/>
                        <Input type="number" className="mx-1"/>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full h-24 flex justify-center items-center">
                    <Button color="primary" className="mx-4" onClick={() => {setVisible(false)}}>Add</Button>
                    <Button color="primary" className="mx-4" onClick={() => {setVisible(false)}}>Cancel</Button>
                </div>
            </div>
        </div>
    );
});

export default AddTaskPopup;