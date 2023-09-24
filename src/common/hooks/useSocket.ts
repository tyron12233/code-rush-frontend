import { useEffect } from "react";
import { useConnectionStore } from "../../modules/play2/state/connection-store";
import SocketLatest from "../services/Socket";
import { getServerUrl } from "@/utils/getServerUrl";

export function useSocket() {
  useEffect(() => {
    const serverUrl = getServerUrl();
    const socket = new SocketLatest(serverUrl);
    useConnectionStore.setState((s) => ({ ...s, socket }));
    return () => {
      socket.disconnect();
    };
  }, []);
}
