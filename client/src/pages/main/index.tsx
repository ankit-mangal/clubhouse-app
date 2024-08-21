import { StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import { Navigate } from "react-router-dom";
import { useState } from "react";

interface NewRoom {
  name: string;
  description: string;
}

export const MainPage = () => {
  const { client, user } = useUser();
  const [newRoom, setNewRoom] = useState<NewRoom>({
    name: "",
    description: "",
  });

  const createRoom = () => {};

  if (!client) {
    return <Navigate to="/sign-in" />;
  }

  const createRoom = async () => {
    const {name, description} = newRoom

    if(!client || !user || !name || !description){
      return;
    }

    const call = client.call('audio_room', name);
    await call.join({
      create: true,
      data: {
        members: [{user_id: user.username}],
        custom:{
          title: name,
          description
        }
      }
    })
  };

  return (
    <StreamVideo client={client}>
      <div className="home">
        <h1>Welcome {user?.name}</h1>
        <div className="form">
          <h2>Create your own room</h2>
          <input
            placeholder="Room Name..."
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <input placeholder="Room Description..."  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom((prev) => ({ ...prev, description: event.target.value }))
            }/>
          <button
            onClick={createRoom}
            style={{ backgroundColor: "rgb(125,7,236)" }}
          >
            Create Room
          </button>
        </div>
      </div>
    </StreamVideo>
  );
};
