export default function GlassCard({ children }) {
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 w-full max-w-md shadow-lg">
      {children}
    </div>
  );
}
