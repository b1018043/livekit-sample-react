import React, { MouseEventHandler, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AudioRenderer, useRoom, } from "livekit-react";
// Roomをコンポーネントとして定義しているので別の名前(RoomClass)に置き換えている
import ParticipantRender from "./ParticipantRender";
import { Room } from "livekit-client";

// Livekit-serverのurl(ws)
const LiveKitServerURL: string = "ws://localhost:7880";


const RoomView = ()=>{
    // tokenを取得している
    // NOTE: もっと綺麗なやり方があったら教えて欲しい
    const location = useLocation();
    const state: any= location.state;
    const token: string = state.token;

    const {connect,isConnecting,participants,audioTracks,room,error} = useRoom();

    const handleConnected = async (room: any) =>{
        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);
    }

    const handleCameraClick:MouseEventHandler = async() =>{
        const nowState:boolean = room?.localParticipant.isCameraEnabled ?? false;
        await room?.localParticipant.setCameraEnabled(!nowState);
    }

    const handleMicrophoneClick: MouseEventHandler = async()=>{
        const nowState:boolean = room?.localParticipant.isMicrophoneEnabled ?? false; 
        console.log(nowState);
        await room?.localParticipant.setMicrophoneEnabled(!nowState);
    }

    const handleScreenShareClick: MouseEventHandler = async()=>{
        await room?.localParticipant.setScreenShareEnabled(!room.localParticipant.isScreenShareEnabled);
    }

    useEffect(()=>{
        connect(LiveKitServerURL,token).then((room)=>{
            if(!room) return;
            handleConnected(room);
            return ()=> room.disconnect();
        }).catch(err=>{
            console.error(err);
        })
    },[]);

    if(isConnecting) return <div>Connecting...</div>

    return (
        <div>
            {error&&<p>{error.message}{error.name}{error.stack}</p>}
            <p>member: {participants.length}</p>
            {/* ビデオ・音声出力 */}
            {participants.map((participant)=>{
                return <ParticipantRender participant={participant} key={participant.identity}/>
            })}
            {audioTracks.map((audio)=>{
                return <AudioRenderer track={audio} isLocal={false} key={audio.sid}/>
            })}

            {/* コントロールボタン類 */}
            <button onClick={handleCameraClick}>
                Camera:{room?.localParticipant.isCameraEnabled?"Mute":"Unmute"}
            </button>
            <button onClick={handleMicrophoneClick}>
                Microphone:{room?.localParticipant.isMicrophoneEnabled?"Mute":"Unmute"}
            </button>
            <button onClick={handleScreenShareClick}>
                ScreenShare:{room?.localParticipant.isScreenShareEnabled?"off":"on"}
            </button>
        </div>
    )
}

export default RoomView;