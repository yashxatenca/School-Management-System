import React from "react";
import { Edit, Save, X, Loader2 } from "lucide-react";

export function Section({
  title,
  icon,
  edit,
  setEdit,
  onSave,
  loading,
  editable = true,
  children,
}: any) {
  return (<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6"> <div className="flex justify-between items-center flex-wrap gap-4"> <h2 className="text-2xl font-bold flex items-center gap-3 text-black">
    {icon} {title} </h2>
    {editable &&
      (!edit ? (
        <button
          onClick={() => setEdit(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <Edit size={18} /> Edit
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setEdit(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-xl transition"
          >
            <X size={18} />
          </button>

          <button
            onClick={onSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save
          </button>
        </div>
      ))}
  </div>

    {children}
  </div>

  );
}

export function Grid({ children }: any) {
  return (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children} </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: any) {
  return (<div> <label className="text-sm font-semibold text-black">{label}</label>

    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      className="w-full mt-1 px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition"
    />
  </div>

  );
}

export function Textarea({ label, value, onChange, disabled }: any) {
  return (<div className="mt-4"> <label className="text-sm font-semibold text-black">{label}</label>

    <textarea
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      rows={3}
      className="w-full mt-1 px-4 py-2 border border-gray-300 bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition"
    />
  </div>


  );
}
