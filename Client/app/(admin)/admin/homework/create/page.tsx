"use client";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateHomework } from "@/hooks/Admin/useHomework";
import { useGetClasses } from "@/hooks/Admin/useClass"; // Tumhara existing hook
import { useGetSubjects } from "@/hooks/Admin/useSubject";

export default function CreateHomeworkPage() {
    const router = useRouter();
    const { mutate: createHomework, isPending } = useCreateHomework();
    const { data } = useGetSubjects();
    const { data: classesResponse, isLoading } = useGetClasses(); // Class list API se aayegi
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        classId: "",
        subjectId: "", // Ideal way: Class select hone pe uske subjects aane chahiye
        hasDueDate: true,
        dueDate: "",
        driveLink: "", // Single link for simplicity
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            attachments: formData.driveLink ? [formData.driveLink] : [],
        };

        createHomework(payload, {
            onSuccess: () => {
                toast.success("Homework Assigned Successfully! 🔥");
                router.push("/admin/homework/read"); // Wapas list page pe bhej do
            },
            onError: (err) => {
                toast.error("Error assigning homework: " + err.message);
            }
        });
    };
    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Assign New Homework</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Homework Title</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g., Chapter 5 Physics Numericals"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                {/* Class & Subject Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Class</label>
                        <select
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                        >
                            <option value="">-- Choose Class --</option>
                            {classesResponse?.data?.map((c: any) => (
                                <option key={c._id} value={c._id}>{"Class " + c.name + " section " + c.section}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Subject</label>
                        <select
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                        >
                            <option value="">-- Choose Subject --</option>
                            {data?.data?.map((c: any) => (
                                <option key={c._id} value={c._id}>{c.name + " " + c.code}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Instructions / Description</label>
                    <textarea
                        required
                        rows={4}
                        placeholder="Solve all questions from page 42..."
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Due Date Logic */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.hasDueDate}
                            onChange={(e) => setFormData({ ...formData, hasDueDate: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm font-medium">Has Due Date?</span>
                    </label>

                    {formData.hasDueDate && (
                        <input
                            type="date"
                            required
                            className="p-2 border border-gray-300 rounded-md text-sm"
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    )}
                </div>

                {/* Google Drive Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Google Drive Link (Optional)</label>
                    <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isPending ? "Assigning..." : "Assign Homework"}
                </button>
            </form>
            <   ToastContainer />
        </div>
    );
}