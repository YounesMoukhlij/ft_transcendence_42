'use client';

const WS_FALLBACK_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_WS_PORT || '4444';
const WS_FALLBACK_PATH = process.env.NEXT_PUBLIC_WS_PATH || '/ws';
const WS_EXPLICIT_URL = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WEBSOCKET_URL;

let sharedSocket: WebSocket | null = null;

const isActiveSocket = (socket: WebSocket | null) =>
  !!socket && socket.readyState !== WebSocket.CLOSING && socket.readyState !== WebSocket.CLOSED;

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const buildWsUrl = () => {
  if (WS_EXPLICIT_URL) {
    return WS_EXPLICIT_URL;
  }

  if (typeof window === 'undefined') {
    // Should never happen for client components, but keeps SSR-safe imports.
    return `ws://localhost:${WS_FALLBACK_PORT}${normalizePath(WS_FALLBACK_PATH)}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = process.env.NEXT_PUBLIC_BACKEND_IP || window.location.hostname;
  const port = process.env.NEXT_PUBLIC_BACKEND_PORT || WS_FALLBACK_PORT;

  const portSegment = port ? `:${port}` : '';
  return `${protocol}://${host}${portSegment}${normalizePath(WS_FALLBACK_PATH)}`;
};

const attachLifecycleHandlers = (socket: WebSocket) => {
  const handleClose = () => {
    if (sharedSocket === socket) {
      sharedSocket = null;
    }
    socket.removeEventListener('close', handleClose);
    socket.removeEventListener('error', handleError);
  };

  const handleError = () => {
    // Let the consumer decide how to treat errors; we just ensure stale sockets are cleared.
    if (sharedSocket === socket && socket.readyState >= WebSocket.CLOSING) {
      sharedSocket = null;
    }
  };

  socket.addEventListener('close', handleClose);
  socket.addEventListener('error', handleError);
};

export const getWebSocket = () => {
  if (typeof window === 'undefined') {
    throw new Error('WebSocket is only available in the browser.');
  }

  if (isActiveSocket(sharedSocket)) {
    return sharedSocket as WebSocket;
  }

  const ws = new WebSocket(buildWsUrl());
  sharedSocket = ws;
  attachLifecycleHandlers(ws);
  return ws;
};

export const resetWebSocket = () => {
  if (sharedSocket) {
    sharedSocket.close();
    sharedSocket = null;
  }
};
