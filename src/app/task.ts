export interface TaskDuration {
    hours:number,
    minutes:number,
    seconds:number
}

export interface TaskDays {
    sun:boolean,
    mon:boolean,
    tue:boolean,
    wed:boolean,
    thu:boolean,
    fri:boolean,
    sat:boolean
}

export type TaskDurationKeys = keyof TaskDuration;
export type TaskDaysKeys = keyof TaskDays;

export default class Task{
    name:string;                    // The name of the task
    totalDuration:TaskDuration;     // How many seconds the task will last
    currentDuration:TaskDuration;   // 
    days:TaskDays;                  // Each element is 0 ~ 6
    started:boolean;
    lastTickTimerID:number;
    completed:boolean;
    tickCB:() => void;
    completeCB:() => void;

    constructor(name:string, totalDuration:TaskDuration, days:TaskDays){
        this.name = name;
        this.totalDuration = totalDuration;
        this.currentDuration = {hours:this.totalDuration.hours, minutes:this.totalDuration.minutes, seconds:this.totalDuration.seconds};
        this.days = days;
        this.started = false;
        this.lastTickTimerID = 0;
        this.completed = false;
        this.tickCB = () => {};
        this.completeCB = () => {};
    }

    // Returns duration as a string
    durationToStr(duration:TaskDuration):string{
        let formatted = duration.hours.toString().padStart(2, "0");
        formatted += ":";
        formatted += duration.minutes.toString().padStart(2, "0");
        formatted += ":";
        formatted += duration.seconds.toString().padStart(2, "0");

        return formatted;
    }

    // Returns days to do task as a string
    daysStr():string{
        let formatted = "";

        for(const [key, value] of Object.entries(this.days)){
            if(key && value){
                formatted += key[0].toUpperCase() + "/";
            }
        }

        // Remove last '/'
        formatted = formatted.slice(0, formatted.length-1);

        return formatted;
    }

    #durationToSec(duration:TaskDuration):number{
        return duration.hours*3600 + duration.minutes*60 + duration.seconds;
    }

    progress():number{
        const total:number = this.#durationToSec(this.totalDuration);
        const current:number = this.#durationToSec(this.currentDuration);
        return (1.0 - (current / total)) * 100.0;
    }

    tick():void{
        if(this.currentDuration.seconds != 0){
            this.currentDuration.seconds -= 1;
        }else if(this.currentDuration.minutes != 0){
            this.currentDuration.seconds = 59;
            this.currentDuration.minutes -= 1;
        }else if(this.currentDuration.hours != 0){
            this.currentDuration.minutes = 59;
            this.currentDuration.hours -= 1;
        }

        if(this.currentDuration.seconds == 0 &&
           this.currentDuration.minutes == 0 &&
           this.currentDuration.hours == 0){
            this.completed = true;
            this.completeCB();
            this.stop();
        }

        // Invoke tick callback and call parent function again
        this.tickCB();
    }

    // Starts timer countdown and tick CB
    start(tickCB:() => void, completeCB:() => void):void{
        this.tickCB = tickCB;
        this.completeCB = completeCB;

        // Call the tickCB right away to give a response right away
        this.started = true;
        this.tickCB();

        this.lastTickTimerID = window.setInterval(() => {
            this.tick();
        }, 1000);
    }

    // Stops timer countdown and tick CB
    stop():void{
        if(this.started){
            // Stop tick and reset some state
            window.clearTimeout(this.lastTickTimerID);
            this.started = false;
            this.tickCB = () => {};
            this.completeCB = () => {};
        }
    }

    toggle(tickCB:() => void, completeCB:() => void):void{
        if(this.started){
            this.stop();
        }else{
            this.start(tickCB, completeCB);
        }
    }
}