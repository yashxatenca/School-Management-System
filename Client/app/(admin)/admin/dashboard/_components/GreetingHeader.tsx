export default function GreetingHeader() {
  return (
    <div className="p-6 bg-[#e6eaf0] rounded-2xl shadow-[-5px_-5px_10px_#ffffff,_5px_5px_10px_rgba(166,180,200,0.55)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Welcome, Principal 👋
        </h2>
        <p className="text-slate-600 mt-1 text-sm md:text-base font-medium">
          Here is an overview of your school's current status.
        </p>
      </div>
    </div>
  );
}
