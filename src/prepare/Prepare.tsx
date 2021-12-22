import react,{ChangeEvent, MouseEventHandler, ReactEventHandler, useState} from "react";
import { Button, TextField } from "@mui/material";
import {useNavigate} from "react-router-dom";

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
        await fetch("/token",{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        }).then(res=>res.json()).then((body)=>{
            if(body.errors){
                throw body.errors;
            }
            navigate("/room",{
                state:{
                    token: body.token
                }
            });
        }).catch(err=>{
            console.error(err);
            setPressed(p=>!p);
        })
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