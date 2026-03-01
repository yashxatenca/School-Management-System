'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Edit, Save, X, Loader2, ShieldCheck, School
} from 'lucide-react';

/* ================= TYPES ================= */

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  designation: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
  qualification: string;
  experienceYears: number;
  emergencyContact: string;
  bio: string;
  profileStatus: "ACTIVE" | "SUSPENDED";
}

interface SchoolInfo {
  schoolId: string;
  schoolName: string;
  schoolCode: string;
  affiliationNumber: string;
  establishedYear: string;
  board: string;
  schoolType: string;
  website: string;
  supportEmail: string;
  schoolPhone: string;
  motto: string;
  address: string;
  totalStudents: number;
  totalTeachers: number;
}

/* ================= DUMMY FETCH ================= */

const fetchProfile = async () => {
  await new Promise(r => setTimeout(r, 700));

  return {
    admin: {
      id: "ADMIN_001",
      name: "Yashashvi Yadav",
      email: "principal@school.edu",
      phone: "+91 9876543210",
      role: "SUPER_ADMIN",
      designation: "Principal",
      gender: "Male",
      dateOfBirth: "1985-08-15",
      joiningDate: "2022-06-15",
      qualification: "M.Ed, Ph.D.",
      experienceYears: 12,
      emergencyContact: "+91 9123456789",
      bio: "Experienced education leader focused on holistic academic excellence.",
      profileStatus: "ACTIVE"
    },
    school: {
      schoolId: "SCH_001",
      schoolName: "Global Excellence Public School",
      schoolCode: "GEPS-2026",
      affiliationNumber: "CBSE-2130001",
      establishedYear: "2008",
      board: "CBSE",
      schoolType: "Co-Educational, English Medium",
      website: "https://geps.edu.in",
      supportEmail: "support@geps.edu.in",
      schoolPhone: "0522-2345678",
      motto: "Learning Today, Leading Tomorrow",
      address: "Sector 14, Main Campus Route, Jankipuram Extension, Lucknow, UP",
      totalStudents: 1250,
      totalTeachers: 78
    }
  };
};

/* ================= MAIN COMPONENT ================= */

export default function AdminProfilePage() {
  const queryClient = useQueryClient();
  const [editPersonal, setEditPersonal] = useState(false);
  const [editSchool, setEditSchool] = useState(false);

  const [adminForm, setAdminForm] = useState<Partial<AdminProfile>>({});
  const [schoolForm, setSchoolForm] = useState<Partial<SchoolInfo>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: fetchProfile
  });

  const adminMutation = useMutation({
    mutationFn: async (data: AdminProfile) => data, // Replace with Axios PUT
    onSuccess: (updated) => {
      queryClient.setQueryData(['adminProfile'], (old: any) => ({
        ...old,
        admin: updated
      }));
      setEditPersonal(false);
    }
  });

  const schoolMutation = useMutation({
    mutationFn: async (data: SchoolInfo) => data, // Replace with Axios PUT
    onSuccess: (updated) => {
      queryClient.setQueryData(['adminProfile'], (old: any) => ({
        ...old,
        school: updated
      }));
      setEditSchool(false);
    }
  });

  useEffect(() => {
    if (data) {
      setAdminForm(data.admin);
      setSchoolForm(data.school);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* ================= PERSONAL INFO ================= */}
        <Section
          title="Personal Information"
          icon={<ShieldCheck size={24} className="text-indigo-600" />}
          edit={editPersonal}
          setEdit={setEditPersonal}
          onSave={() => adminMutation.mutate(adminForm as AdminProfile)}
          loading={adminMutation.isPending}
        >
          <Grid>
            <Input label="Full Name" value={adminForm.name} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,name:e.target.value})}/>
            <Input label="Email Address" type="email" value={adminForm.email} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,email:e.target.value})}/>
            <Input label="Phone Number" value={adminForm.phone} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,phone:e.target.value})}/>
            <Input label="Designation" value={adminForm.designation} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,designation:e.target.value})}/>
            <Input label="Gender" value={adminForm.gender} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,gender:e.target.value})}/>
            <Input type="date" label="Date of Birth" value={adminForm.dateOfBirth} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,dateOfBirth:e.target.value})}/>
            <Input type="date" label="Joining Date" value={adminForm.joiningDate} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,joiningDate:e.target.value})}/>
            <Input label="Highest Qualification" value={adminForm.qualification} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,qualification:e.target.value})}/>
            <Input label="Experience (Years)" type="number" value={adminForm.experienceYears} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,experienceYears:Number(e.target.value)})}/>
            <Input label="Emergency Contact" value={adminForm.emergencyContact} disabled={!editPersonal}
              onChange={(e: any)=>setAdminForm({...adminForm,emergencyContact:e.target.value})}/>
          </Grid>

          <Textarea label="Professional Bio" value={adminForm.bio} disabled={!editPersonal}
            onChange={(e: any)=>setAdminForm({...adminForm,bio:e.target.value})} />

          <div className="mt-4">
            <StatusBadge status={adminForm.profileStatus || "ACTIVE"} />
          </div>
        </Section>

        {/* ================= SCHOOL INFO ================= */}
        <Section
          title="School Information"
          icon={<School size={24} className="text-indigo-600" />}
          edit={editSchool}
          setEdit={setEditSchool}
          onSave={() => schoolMutation.mutate(schoolForm as SchoolInfo)}
          loading={schoolMutation.isPending}
        >
          <Grid>
            <Input label="School Name" value={schoolForm.schoolName} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,schoolName:e.target.value})}/>
            <Input label="School Code" value={schoolForm.schoolCode} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,schoolCode:e.target.value})}/>
            <Input label="Affiliation Number" value={schoolForm.affiliationNumber} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,affiliationNumber:e.target.value})}/>
            <Input label="Board" value={schoolForm.board} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,board:e.target.value})}/>
            <Input label="School Type" value={schoolForm.schoolType} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,schoolType:e.target.value})}/>
            <Input label="Established Year" value={schoolForm.establishedYear} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,establishedYear:e.target.value})}/>
            <Input label="Website URL" value={schoolForm.website} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,website:e.target.value})}/>
            <Input label="Support Email" type="email" value={schoolForm.supportEmail} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,supportEmail:e.target.value})}/>
            <Input label="School Phone Desk" value={schoolForm.schoolPhone} disabled={!editSchool}
              onChange={(e: any)=>setSchoolForm({...schoolForm,schoolPhone:e.target.value})}/>
          </Grid>

          <Textarea label="Complete Address" value={schoolForm.address} disabled={!editSchool}
            onChange={(e: any)=>setSchoolForm({...schoolForm,address:e.target.value})} />
          
          <Textarea label="School Motto" value={schoolForm.motto} disabled={!editSchool}
            onChange={(e: any)=>setSchoolForm({...schoolForm,motto:e.target.value})} />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <StatCard title="Total Students" value={schoolForm.totalStudents}/>
            <StatCard title="Total Teachers" value={schoolForm.totalTeachers}/>
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, icon, edit, setEdit, onSave, loading, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-100">
          {icon} {title}
        </h2>

        {!edit ? (
          <button onClick={()=>setEdit(true)}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium">
            <Edit size={18}/> Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={()=>setEdit(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition">
              <X size={18}/>
            </button>
            <button onClick={onSave} disabled={loading}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 transition text-white rounded-xl flex items-center gap-2 font-medium disabled:opacity-70">
              {loading ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
              Save Changes
            </button>
          </div>
        )}
      </div>
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}

function Grid({ children }: any) {
  return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>;
}

function Input({ label, value, onChange, disabled, type="text" }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
      <input type={type} value={value || ""}
        onChange={onChange} disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-indigo-500
          ${disabled 
            ? 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-600 dark:text-white'
          }`}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, disabled }: any) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
      <textarea value={value || ""} onChange={onChange} disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-y
          ${disabled 
            ? 'bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-600 dark:text-white'
          }`}
      />
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-6 rounded-2xl text-center shadow-lg shadow-indigo-200 dark:shadow-none">
      <p className="text-4xl font-bold mb-1">{value}</p>
      <p className="text-sm font-medium text-indigo-100">{title}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold tracking-wide
      ${status === "ACTIVE" 
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" 
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
      }`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}></span>
      {status}
    </div>
  );
}