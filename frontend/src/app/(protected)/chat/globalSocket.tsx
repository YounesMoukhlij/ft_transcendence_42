let s;
export function getWebSocket(){
    if (!s)
        s = new WebSocket('ws://localhost:4444/ws');
    s.onclose = () => {
        console.warn('WebSocket closed');
        s = null;
    };
    return s;
}