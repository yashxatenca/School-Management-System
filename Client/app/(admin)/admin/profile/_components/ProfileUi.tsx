import React from 'react';
import { Edit, Save, X, Loader2 } from 'lucide-react';

export function Section({ title, icon, edit, setEdit, onSave, loading, editable = true, children }: any) {
    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    {icon} {title}
                </h2>
                {editable && (
                    !edit ? (
                        <button
                            onClick={() => setEdit(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-colors"
                        >
                            <Edit size={18} /> Edit
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEdit(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <button
                                onClick={onSave}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 transition-colors"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save
                            </button>
                        </div>
                    )
                )}
            </div>
            {children}
        </div>
    );
}

export function Grid({ children }: any) {
    return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>;
}

export function Input({ label, value, onChange, disabled, type = "text" }: any) {
    return (
        <div>
            <label className="text-sm font-semibold">{label}</label>
            <input
                type={type}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                className="w-full mt-1 px-4 py-2 border dark:border-gray-700 dark:bg-gray-800 rounded-xl disabled:bg-gray-100 disabled:dark:bg-gray-900 disabled:text-gray-500 transition-colors"
            />
        </div>
    );
}

export function Textarea({ label, value, onChange, disabled }: any) {
    return (
        <div className="mt-4">
            <label className="text-sm font-semibold">{label}</label>
            <textarea
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                rows={3}
                className="w-full mt-1 px-4 py-2 border dark:border-gray-700 dark:bg-gray-800 rounded-xl disabled:bg-gray-100 disabled:dark:bg-gray-900 disabled:text-gray-500 transition-colors"
            />
        </div>
    );
}