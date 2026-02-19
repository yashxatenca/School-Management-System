export type StudentFormData = {
  fullName: string;
  email: string;
  password: string;
  
  // Dropdown selections
  classSelect: string; 
  sectionSelect: string;
  
  // Manual inputs (only used if "Other" is selected)
  customClass?: string;
  customSection?: string;

  rollNumber: string;
  gender: "Male" | "Female" | "Other";
};

export type StudentEditableData = {
  dob: string;
  bloodGroup: string;
  studentPhone: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  address: string;
};