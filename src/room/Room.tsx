import react, { MouseEventHandler, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AudioRenderer, LiveKitRoom, ParticipantState, useParticipant, useRoom, VideoRenderer,ControlsProps} from "livekit-react";
// Roomをコンポーネントとして定義しているので別の名前(RoomClass)に置き換えている
import { Room as RoomClass} from "livekit-client";
import ParticipantRender from "./ParticipantRender";

// Livekit-serverのurl(ws)
const LiveKitServerURL: string = "ws://localhost:7880";


const Room = ()=>{
    // tokenを取得している
    // NOTE: もっと綺麗なやり方があったら教えて欲しい
    const location = useLocation();
    const state: any= location.state;
    const token: string = state.token;

    const {connect,isConnecting,participants,audioTracks,room} = useRoom();

    const handleConnected = async (room: RoomClass) =>{
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
        })
    },[]);

    if(isConnecting) return <div>Connecting...</div>

    return (
        <div>
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

export default Room;