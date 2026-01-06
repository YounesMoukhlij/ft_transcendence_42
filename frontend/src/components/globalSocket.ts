'use client';

const WS_FALLBACK_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_WS_PORT || '4444';
const WS_FALLBACK_PATH = '/api/ws';
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
    return `ws://${process.env.NEXT_PUBLIC_BACKENDIP}:${WS_FALLBACK_PORT}${normalizePath(WS_FALLBACK_PATH)}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  // Smart host detection: use env var if set and not localhost, otherwise use current hostname
  // This ensures network access works automatically (matches getBackendURL() logic)
  const envHost = process.env.NEXT_PUBLIC_BACKEND_IP || process.env.NEXT_PUBLIC_BACKENDIP;
  const envPort = process.env.NEXT_PUBLIC_BACKEND_PORT || process.env.NEXT_PUBLIC_BACKENDPORT || WS_FALLBACK_PORT;

  let host;
  if (envHost && envHost.trim() !== '' && envHost !== 'localhost' && envHost !== '127.0.0.1') {
    // Use env var if explicitly set to non-localhost
    host = envHost;
  } else {
    // Use current hostname (runtime detection) - works for network access
    // e.g., if frontend is at http://192.168.1.100:3000, WS will be at ws://192.168.1.100:4444/ws
    host = window.location.hostname;
  }

  const portSegment = envPort ? `:${envPort}` : '';
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
