import react from "react";
import { useLocation } from "react-router-dom";
import { LiveKitRoom} from "livekit-react";
// Roomをコンポーネントとして定義しているので別の名前(RoomClass)に置き換えている
import { Room as RoomClass} from "livekit-client";

// Livekit-serverのurl(ws)
const LiveKitServerURL: string = "ws://localhost:7880";

const Room = ()=>{
    // tokenを取得している
    // NOTE: もっと綺麗なやり方があったら教えて欲しい
    const location = useLocation();
    const state: any= location.state;
    const token: string = state.token;

    const handleConnected = async (room: RoomClass) =>{
        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);
    }

    return (
        <div>
            <LiveKitRoom url={LiveKitServerURL} token={token}
                onConnected={handleConnected}
            /> 
        </div>
    )
}

export default Room;