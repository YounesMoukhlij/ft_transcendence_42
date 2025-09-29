let s: WebSocket | null = null;

export function getWebSocket(): WebSocket {
    if (!s || s.readyState === WebSocket.CLOSED || s.readyState === WebSocket.CLOSING) {
        s = new WebSocket('ws://localhost:4444/ws');

        s.onopen = () => {
            console.log('WebSocket connected');
        };

        s.onclose = () => {
            console.warn('WebSocket closed');
            s = null;
        };

        s.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
    return s;
}
