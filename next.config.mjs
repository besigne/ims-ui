/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    api: 'http://127.0.0.1:8000/api/',
    websocket: 'ws://127.0.0.1:8000/ws/'
  },
};

export default nextConfig;
