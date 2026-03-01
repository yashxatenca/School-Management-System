// components/TeacherDetails.tsx

interface TeacherDetailsProps {
  data: {
    phone?: string;
    qualification?: string;
    experience?: number;
    address?: string;
    gender?: string;
    dateOfBirth?: string;
    joiningDate?: string;
  };
}

// Helper function to format dates nicely (e.g., 27 Feb 2026)
const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

export default function TeacherDetails({ data }: TeacherDetailsProps) {
  // Array mein objects banaye hain taaki map karna aasan ho
  // fullWidth property se hum Address ko 2 columns ki jagah de sakte hain
  const details = [
    { label: "Phone", value: data.phone },
    { label: "Gender", value: data.gender },
    { label: "Date of Birth", value: formatDate(data.dateOfBirth) },
    { label: "Joining Date", value: formatDate(data.joiningDate) },
    { label: "Qualification", value: data.qualification },
    { 
      label: "Experience", 
      // 0 experience ko handle karne ke liye strict check lagaya hai
      value: data.experience !== undefined && data.experience !== null 
        ? `${data.experience} ${data.experience === 1 ? 'Year' : 'Years'}` 
        : null 
    },
    { label: "Address", value: data.address, fullWidth: true },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      {details.map((item, index) => (
        <div 
          key={index} 
          className={`p-4 bg-gray-50 rounded-lg border border-gray-100 ${
            item.fullWidth ? "md:col-span-2" : ""
          }`}
        >
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            {item.label}
          </p>
          <p className="text-sm font-medium text-gray-800 mt-1">
            {/* Agar value valid hai toh dikhao, warna 'Not Provided' */}
            {item.value !== null && item.value !== "" ? item.value : "Not Provided"}
          </p>
        </div>
      ))}
    </div>
  );
}