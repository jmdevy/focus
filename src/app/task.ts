export default class Task{
    name: string;          // The name of the task
    seconds: number;       // How many seconds the task will last
    daysOfWeek: number[];  // Each element is 0 ~ 6

    constructor(name:string, seconds:number, daysOfWeek:number[]){
        this.name = name;
        this.seconds = seconds;
        this.daysOfWeek = daysOfWeek;
    }
}