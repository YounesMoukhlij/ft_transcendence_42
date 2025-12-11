import './loading.css'
export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative bg-black border-2 h-32 w-64 overflow-hidden">
        <div className="absolute left-4 w-2 h-12 rounded bg-white paddle-left"></div>
        <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg ball"></div>
        <div  className="absolute right-4 w-2 h-12 rounded bg-white paddle-right"></div>
      </div>
    </div>
  );
}