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

export interface TaskInfo {
    name:string;                    // The name of the task
    totalDuration:TaskDuration;     // How many seconds the task will last
    currentDuration:TaskDuration;   // 
    days:TaskDays;                  // Each element is 0 ~ 6
    started:boolean;
    lastTickTimerID:number;
    completed:boolean;
}

export type TaskDurationKeys = keyof TaskDuration;
export type TaskDaysKeys = keyof TaskDays;

export default class Task{
    info:TaskInfo;
    tickCB:() => void;
    updateCountCB:() => void;

    constructor(info:TaskInfo){
        this.info = info;

        this.tickCB = () => {};
        this.updateCountCB = () => {};
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

        for(const [key, value] of Object.entries(this.info.days)){
            if(key && value){
                formatted += key[0].toUpperCase() + "/";
            }
        }

        // Remove last '/'
        formatted = formatted.slice(0, formatted.length-1);

        return formatted;
    }

    // Returns `true` if this task should
    // be done this day of the week
    forToday():boolean{
        const today:Date = new Date();
        const day:number = today.getDay();

        for(const [key, value] of Object.entries(this.info.days)){
            if(!value){
                continue;
            }

            if((key == "sun" && day == 0) ||
               (key == "mon" && day == 1) ||
               (key == "tue" && day == 2) ||
               (key == "wed" && day == 3) ||
               (key == "thu" && day == 4) ||
               (key == "fri" && day == 5) ||
               (key == "sat" && day == 6)){
                return true;
            }
        }

        return false;
    }

    #durationToSec(duration:TaskDuration):number{
        return duration.hours*3600 + duration.minutes*60 + duration.seconds;
    }

    progress():number{
        const total:number = this.#durationToSec(this.info.totalDuration);
        const current:number = this.#durationToSec(this.info.currentDuration);
        return (1.0 - (current / total)) * 100.0;
    }

    tick():void{
        if(this.info.currentDuration.seconds == 0 &&
            this.info.currentDuration.minutes == 0 &&
            this.info.currentDuration.hours == 0){
             this.info.completed = true;
             this.updateCountCB();
             this.stop();
             return;
        }

        this.info.currentDuration.seconds -= 1;

        if(this.info.currentDuration.seconds < 0){
            this.info.currentDuration.minutes -= 1;
            this.info.currentDuration.seconds = 59;
        }

        if(this.info.currentDuration.minutes < 0){
            this.info.currentDuration.hours -= 1;
            this.info.currentDuration.minutes = 59;
        }

        // Invoke tick callback and call parent function again
        this.tickCB();
    }

    // Starts timer countdown and tick CB
    start(tickCB:() => void, updateCountCB:() => void):void{
        this.tickCB = tickCB;
        this.updateCountCB = updateCountCB;

        // Call the tickCB right away to give a response right away
        this.info.completed = false;
        this.info.started = true;
        this.tickCB();

        this.info.lastTickTimerID = window.setInterval(() => {
            this.tick();
        }, 1000);
    }

    // Stops timer countdown and tick CB
    stop():void{
        if(this.info.started){
            // Stop tick and reset some state
            window.clearTimeout(this.info.lastTickTimerID);
            this.info.started = false;
            this.tickCB = () => {};
            this.updateCountCB = () => {};
        }
    }

    toggle(tickCB:() => void, updateCountCB:() => void):void{
        if(this.info.started){
            this.stop();
        }else if(this.info.completed){
            this.info.currentDuration = {hours:this.info.totalDuration.hours, minutes:this.info.totalDuration.minutes, seconds:this.info.totalDuration.seconds};
            this.start(tickCB, updateCountCB);
            this.updateCountCB();
        }else{
            this.start(tickCB, updateCountCB);
        }
    }
}