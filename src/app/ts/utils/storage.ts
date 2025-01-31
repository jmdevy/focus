import Task, {TaskInfo} from "./task";


function saveTasks(tasks:Task[]):void{
    const tasksInfo:TaskInfo[] = [];

    // Distill the tasks into components that can be stringified
    tasks.forEach(task => {
        tasksInfo.push(task.info);
    });

    localStorage.setItem("tasksInfo", JSON.stringify(tasksInfo));
}


function restoreTasks(setTasks:(tasks:Task[]) => void):void{
    const tasksInfoStr:string|null = localStorage.getItem("tasksInfo");

    // Don't do anything if tasks haven't been stored before
    if(tasksInfoStr == null){
        return;
    }

    const tasksInfo:TaskInfo[] = JSON.parse(tasksInfoStr);
    const tasks:Task[] = [];

    tasksInfo.forEach(info => {
        tasks.push(new Task(info));
    });

    setTasks(tasks);
}

export {saveTasks, restoreTasks};