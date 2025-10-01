import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});
export function onEvent(event, handler){ socket.on(event, handler); return () => socket.off(event, handler); }
export function emit(event, payload){ socket.emit(event, payload); }
export default socket;
