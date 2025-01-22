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
    name:string;            // The name of the task
    duration:TaskDuration;  // How many seconds the task will last
    days:TaskDays;          // Each element is 0 ~ 6
    done:boolean;

    constructor(name:string, duration:TaskDuration, days:TaskDays, done:boolean){
        this.name = name;
        this.duration = duration;
        this.days = days;
        this.done = done;
    }
}