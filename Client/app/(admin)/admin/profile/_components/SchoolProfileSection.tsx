'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { School } from 'lucide-react';
import { Section, Grid, Input, Textarea } from './ProfileUi'; // Adjust import path if needed
import { createSchoolInfo, updateSchoolInfo, type SchoolInfo } from '@/lib/admin_api/AdminProfile.api';

interface SchoolProfileSectionProps {
    schoolData?: Partial<SchoolInfo>;
    profileExists: boolean;
}

export default function SchoolProfileSection({ schoolData, profileExists }: SchoolProfileSectionProps) {
    const queryClient = useQueryClient();
    const [editSchool, setEditSchool] = useState(false);
    const [schoolForm, setSchoolForm] = useState<Partial<SchoolInfo>>({});

    useEffect(() => {
        if (schoolData) {
            setSchoolForm(schoolData);
        }
    }, [schoolData]);

    const schoolMutation = useMutation({
        mutationFn: (payload: Partial<SchoolInfo>) =>
            profileExists
                ? updateSchoolInfo(payload)
                : createSchoolInfo(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(["adminProfile"], (old: any) => ({
                ...(old ?? {}),
                school: updated
            }));
            setEditSchool(false);
        }
    });

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
                    value={schoolForm.schoolName}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                />
                <Input
                    label="Board of Education"
                    value={schoolForm.board}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, board: e.target.value })}
                />
                <Input
                    label="Affiliation Number"
                    value={schoolForm.affiliationNumber}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, affiliationNumber: e.target.value })}
                />
                <Input
                    label="Principal Name"
                    value={schoolForm.principalName}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                />
                <Input
                    type="number"
                    label="Established Year"
                    value={schoolForm.establishedYear}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, establishedYear: Number(e.target.value) })}
                />
                <Input
                    label="School Email"
                    type="email"
                    value={schoolForm.schoolEmail}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, schoolEmail: e.target.value })}
                />
                <Input
                    label="School Phone"
                    value={schoolForm.schoolPhone}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, schoolPhone: e.target.value })}
                />
                <Input
                    label="Website URL"
                    value={schoolForm.website}
                    disabled={!editSchool}
                    onChange={(e: any) => setSchoolForm({ ...schoolForm, website: e.target.value })}
                />
            </Grid>
            <Textarea
                label="Complete Address"
                value={schoolForm.address}
                disabled={!editSchool}
                onChange={(e: any) => setSchoolForm({ ...schoolForm, address: e.target.value })}
            />
        </Section>
    );
}