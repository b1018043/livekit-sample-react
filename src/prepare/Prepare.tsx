import react,{ChangeEvent, MouseEventHandler, ReactEventHandler, useState} from "react";
import { Button, TextField } from "@mui/material";
import {useNavigate} from "react-router-dom";

// リクエストの構造体 (正直いらない)
interface TokenRequest{
    room: string;
    user: string;
}

// 通話前の画面
const Prepare = () =>{
    // 必要なstateを宣言
    // ボタンを押しているかの管理ステート
    const [pressed,setPressed] = useState<boolean>(false);
    // room名,user名の管理用ステート
    const [room,setRoom] = useState<string>("");
    const [username,setUserName] = useState<string>("");

    // 画面遷移に必要なhookの呼び出し
    const navigate = useNavigate();
    
    // handle~~系はstateの変更を行っている
    const handleRoom:ReactEventHandler<Element> = (e: ChangeEvent<HTMLInputElement>)=>{
        setRoom(e.target.value);
    }

    const handleUserName:ReactEventHandler<Element> = (e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }

    const clickJoinButton: MouseEventHandler = async () =>{
        // buttonの無効化
        setPressed(p=>!p);
        // リクエストの定義
        const req:TokenRequest = {
            room,
            user:username,
        } ;
        // 通信処理の呼び出し
        await fetch("/token",{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            // bodyをつける際はPOSTにすること
            body: JSON.stringify(req)
        }).then(res=>res.json()).then((body)=>{
            if(body.errors){
                throw body.errors;
            }
            // ここで/room(Room.tsx)へ遷移する
            // stateでtokenを渡す
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
            {/* disabledではボタンのクリック処理中・room,userが未記入の際にtrueになる */}
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