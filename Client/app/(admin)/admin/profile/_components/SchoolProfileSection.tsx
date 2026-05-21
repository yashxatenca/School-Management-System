'use client';

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { School } from "lucide-react";
import { Section, Grid, Input, Textarea } from "./ProfileUi";

import {
    getSchoolInfo,
    updateSchoolInfo,
    type SchoolInfo,
} from "@/lib/Admin/AdminProfile.api";

export default function SchoolProfileSection() {
    const queryClient = useQueryClient();

    const [editSchool, setEditSchool] = useState(false);
    const [schoolForm, setSchoolForm] = useState<Partial<SchoolInfo>>({});

    /* ================= FETCH SCHOOL INFO ================= */

    const { data: schoolData, isLoading } = useQuery({
        queryKey: ["schoolInfo"],
        queryFn: getSchoolInfo,
    });

    /* ================= PREFILL FORM ================= */

    useEffect(() => {
        if (schoolData) {
            setSchoolForm(schoolData);
        }
    }, [schoolData]);

    /* ================= UPDATE SCHOOL INFO ================= */

    const schoolMutation = useMutation({
        mutationFn: (payload: Partial<SchoolInfo>) => updateSchoolInfo(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(["schoolInfo"], updated);
            setEditSchool(false);
        },
    });

    /* ================= LOADING ================= */

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                Loading School Information...
            </div>
        );
    }

    return (
        <Section
            title="School Information"
            icon={<School size={24} className="text-indigo-600" />}
            edit={editSchool}
            setEdit={setEditSchool}
            onSave={() => schoolMutation.mutate(schoolForm)}
            loading={schoolMutation.isPending}
        >
            <Grid>
                <Input
                    label="School Name"
                    value={schoolForm.schoolName || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, schoolName: e.target.value })
                    }
                />

                <Input
                    label="School Code"
                    value={schoolForm.schoolCode || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, schoolCode: e.target.value })
                    }
                />

                <Input
                    label="Affiliation Number"
                    value={schoolForm.affiliationNumber || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({
                            ...schoolForm,
                            affiliationNumber: e.target.value,
                        })
                    }
                />

                <Input
                    label="Established Year"
                    value={schoolForm.establishedYear || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({
                            ...schoolForm,
                            establishedYear: e.target.value,
                        })
                    }
                />

                <Input
                    label="Board"
                    value={schoolForm.board || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, board: e.target.value })
                    }
                />

                <Input
                    label="School Type"
                    value={schoolForm.schoolType || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, schoolType: e.target.value })
                    }
                />

                <Input
                    label="Website"
                    value={schoolForm.website || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, website: e.target.value })
                    }
                />

                <Input
                    label="Support Email"
                    type="email"
                    value={schoolForm.supportEmail || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, supportEmail: e.target.value })
                    }
                />

                <Input
                    label="School Phone"
                    value={schoolForm.schoolPhone || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({ ...schoolForm, schoolPhone: e.target.value })
                    }
                />

                <Input
                    label="Total Students"
                    type="number"
                    value={schoolForm.totalStudents || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({
                            ...schoolForm,
                            totalStudents: Number(e.target.value),
                        })
                    }
                />

                <Input
                    label="Total Teachers"
                    type="number"
                    value={schoolForm.totalTeachers || ''}
                    disabled={!editSchool}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSchoolForm({
                            ...schoolForm,
                            totalTeachers: Number(e.target.value),
                        })
                    }
                />
            </Grid>

            <Textarea
                label="School Motto"
                value={schoolForm.motto || ''}
                disabled={!editSchool}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setSchoolForm({ ...schoolForm, motto: e.target.value })
                }
            />

            <Textarea
                label="Complete Address"
                value={schoolForm.address || ''}
                disabled={!editSchool}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setSchoolForm({ ...schoolForm, address: e.target.value })
                }
            />
        </Section>
    );
}