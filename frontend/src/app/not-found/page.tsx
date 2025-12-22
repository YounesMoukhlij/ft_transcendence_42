export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-3xl font-black text-white">Not Found</h1>
        <p className="text-slate-400">
          The page you're looking for doesn't exist or was moved.
        </p>
        <a
          href="/"
          className="inline-block mt-2 text-primary font-bold hover:underline"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
