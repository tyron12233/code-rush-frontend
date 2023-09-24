import { connect, Socket as SocketIOSocket } from "socketio-latest";
import { useUserStore } from "../state/user-store";

export default class SocketLatest {
  socket: SocketIOSocket;

  constructor(serverUrl: string) {
    this.socket = connect(serverUrl, {
      withCredentials: true,
      reconnection: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      },
      query: {
        userId: useUserStore.getState().id
      },
    });
    this.socket.on("disconnect", (err) => {
      console.log("disconnected from server", err);
    });
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }

  subscribe(event: string, cb: (error: string | null, msg: any) => void) {
    if (!this.socket) return true;
    this.socket.on(event, (msg: any) => {
      return cb(null, msg);
    });
  }

  emit(event: string, data?: any) {
    if (this.socket) this.socket.emit(event, data);
  }
}
