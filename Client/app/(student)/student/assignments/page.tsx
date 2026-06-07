"use client";
import React, { useState, useEffect } from "react";

// Interfaces (Aapke schema ke hisaab se)
interface Homework {
  _id: string;
  title: string;
  description: string;
  subjectName: string; // Backend se populate karke bhejenge
  dueDate: string;
  hasDueDate: boolean;
}

const StudentHomeworkPage = () => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    null,
  );
  const [driveLink, setDriveLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dummy API Call - Backend se data lane ke liye
  useEffect(() => {
    // Yahan aap apne backend ka API call karenge (e.g., axios.get('/api/homework/my-class'))
    const fetchHomework = async () => {
      const dummyData = [
        {
          _id: "1",
          title: "Science Chapter 4 Notes",
          description:
            "Chapter 4 ke saare notes copy mein likhein aur uski PDF banakar drive link share karein. Dhyan rahe diagrams clear hone chahiye.",
          subjectName: "Science",
          hasDueDate: true,
          dueDate: "2026-06-10T00:00:00.000Z",
        },
        {
          _id: "2",
          title: "Math Algebra Exercises",
          description:
            "Exercise 5.1 aur 5.2 ke saare questions solve karein. Steps miss nahi hone chahiye.",
          subjectName: "Mathematics",
          hasDueDate: true,
          dueDate: "2026-06-12T00:00:00.000Z",
        },
      ];
      setHomeworkList(dummyData);
    };
    fetchHomework();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Yahan submission API call aayegi (e.g., axios.post('/api/homework-submission'))
      console.log("Submitting:", {
        homeworkId: selectedHomework?._id,
        driveLink,
      });
      alert("Homework Submitted Successfully!");

      // Reset aur modal close karein
      setDriveLink("");
      setSelectedHomework(null);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit homework");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Class Homework</h1>

      {/* Homework Cards Grid - Sirf short info dikhegi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworkList.map((hw) => (
          <div
            key={hw._id}
            className="border rounded-lg p-5 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="text-sm text-blue-600 font-semibold mb-1">
              {hw.subjectName}
            </div>
            <h2 className="text-xl font-bold mb-2">{hw.title}</h2>
            {hw.hasDueDate && (
              <p className="text-sm text-red-500 mb-4">
                Due: {new Date(hw.dueDate).toLocaleDateString()}
              </p>
            )}

            {/* Description ko truncate (chhota) karke dikhana (optional) */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {hw.description}
            </p>

            <button
              onClick={() => setSelectedHomework(hw)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              View Details & Submit
            </button>
          </div>
        ))}
      </div>

      {/* Modal - Jab click hoga tab poori details dikhengi */}
      {selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm text-blue-600 font-semibold">
                  {selectedHomework.subjectName}
                </span>
                <h2 className="text-2xl font-bold">{selectedHomework.title}</h2>
              </div>
              <button
                onClick={() => setSelectedHomework(null)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {selectedHomework.hasDueDate && (
              <p className="text-sm text-red-500 mb-4 font-medium">
                Due Date:{" "}
                {new Date(selectedHomework.dueDate).toLocaleDateString()}
              </p>
            )}

            {/* Pura Description yahan dikhega */}
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedHomework.description}
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="border-t pt-4">
              <label className="block mb-2 font-semibold">
                Submit Google Drive Link
              </label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/..."
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedHomework(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                >
                  {isSubmitting ? "Submitting..." : "Submit Homework"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHomeworkPage;
