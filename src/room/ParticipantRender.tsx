import react, { useEffect } from "react";
import { ParticipantState, useParticipant, useRoom, VideoRenderer} from "livekit-react";
// Roomをコンポーネントとして定義しているので別の名前(RoomClass)に置き換えている
import { Participant } from "livekit-client";
import {css} from "@emotion/css"


interface ParticipantRenderProps {
    participant:Participant;
}

const ParticipantRender = ({participant}:ParticipantRenderProps) =>{
    const {isLocal,cameraPublication,isSpeaking}:ParticipantState = useParticipant(participant);
    if(cameraPublication?.track){
        // NOTE: divで囲わないとなぜか表示されない
        return (
            <div>
                <VideoRenderer className={css`
                    border-radius: 10px;
                    border: ${isSpeaking?"solid 5px #00ff7f":"none"};
                `}
                // NOTE: cssに関しては、これしか思いつかなかった
                track={cameraPublication.track} isLocal={isLocal} width="500px"/>
            </div>
        );
    }
    return <div>No Image</div>
}

export default ParticipantRender;