import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        
        {/* Image Container */}
        <div className="relative w-full aspect-video border border-gray-800 rounded-lg overflow-hidden">
            <Image
              src="/notfound.png" 
              alt="Ping Pong Crash 404"
              fill
              className="object-cover grayscale hover:scale-105 transition-transform duration-500"
              priority
              unoptimized
            />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tighter text-white">
            404
          </h1>
          <p className="text-gray-400 text-lg">
            Game Over. The ball went out of bounds.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link 
            href="/"
            className="inline-block bg-white text-black px-8 py-3 rounded text-sm font-semibold uppercase tracking-wide hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>

      </div>
    </div>
  );
}