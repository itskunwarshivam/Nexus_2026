import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-rose-600 mb-4 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
        Mission Not Found
      </h2>
      <p className="text-xl text-gray-400 mb-8 max-w-md">
        The operation you are looking for has been classified, completed, or does not exist.
      </p>
      <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-bold uppercase tracking-wider transition-colors">
        Return to Base
      </Link>
    </div>
  );
}
