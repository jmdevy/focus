import { forwardRef, useImperativeHandle, useState } from "react";
import { Toast, Alert } from "react-daisyui";


export interface AlertRef{
    show:(message:string) => void,
}

const AlertPopup = forwardRef<AlertRef>((_, ref) => {
    
    const [message, setMessage] = useState<string>("");

    useImperativeHandle(ref, () => ({
        show(message:string){
            setMessage(message);

            // After some time, remove the message so the alert disappears
            setTimeout(() => {
                setMessage("");
            }, 4000);
        },
    }));

    return(
        <Toast vertical="bottom" horizontal="center" className={"z-[10000] " + (message == "" ? "invisible" : "visible")}>
            <Alert status="success" className="flex items-center justify-center mb-4">{message}</Alert>
        </Toast>
    );
});
AlertPopup.displayName = "AlertPopup";

export default AlertPopup;