import react,{ChangeEvent, MouseEventHandler, ReactEventHandler, SyntheticEvent, useState} from "react";
import { Button, TextField } from "@mui/material";
import {useNavigate} from "react-router-dom";

const URL:string = "";

interface TokenRequest{
    room: string;
    user: string;
}

const Prepare = () =>{
    const [pressed,setPressed] = useState<boolean>(false);
    const [room,setRoom] = useState<string>("");
    const [username,setUserName] = useState<string>("");

    const navigate = useNavigate();
    
    const handleRoom:ReactEventHandler<Element> = (e: ChangeEvent<HTMLInputElement>)=>{
        setRoom(e.target.value);
    }

    const handleUserName:ReactEventHandler<Element> = (e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }

    const clickJoinButton: MouseEventHandler = async () =>{
        setPressed(p=>!p);
        const req:TokenRequest = {
            room,
            user:username,
        } ;
        const res = await fetch(URL,{
            body: JSON.stringify(req)
        }).then(res=>{
            const tmp: any = res.json();
            return {
                token: tmp.token,
                errors: tmp.errors
            }
        })
        if(res.errors.length!==0||res.token===""){
            console.error("failed",res.errors);
        }else{
            navigate("/room",{
                state:{
                    token: res.token
                }
            });
        }
        setPressed(p=>!p);
    }

    return (
        <div>
            <TextField value={room} onChange={handleRoom}/>
            <TextField value={username} onChange={handleUserName}/>
            <Button 
                disabled={pressed||room.length===0||username.length===0}
                onClick={clickJoinButton}
            >
                JOIN
            </Button>
        </div>
    )
}

export default Prepare;