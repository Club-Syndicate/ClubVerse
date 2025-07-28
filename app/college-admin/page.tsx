'use client';

import type React from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Users, BarChart3, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ClubsTable } from '@/components/college-admin/ClubsTable';
import { CollegeAdminAnalytics } from '@/components/analytics/CollegeAdminAnalytics';

interface Club {
  id: string;
  name: string;
  description: string;
  adminId: string;
  adminName: string;
  memberCount: number;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledClubs: string[];
  joinedAt: string;
  isActive: boolean;
}

export default function CollegeAdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClubOpen, setIsAddClubOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'college_admin') {
      router.push('/');
      return;
    }

    // Mock data for college admin
    const mockClubs: Club[] = [
      {
        id: 'club-1',
        name: 'Photography Club',
        description: 'Capture moments, create memories',
        adminId: 'club-admin-1',
        adminName: 'Mike Wilson',
        memberCount: 45,
        createdAt: '2024-01-10',
      },
      {
        id: 'club-2',
        name: 'Debate Society',
        description: 'Sharpen your arguments and public speaking',
        adminId: 'club-admin-2',
        adminName: 'Emma Davis',
        memberCount: 32,
        createdAt: '2024-01-12',
      },
      {
        id: 'club-3',
        name: 'Coding Club',
        description: 'Learn, code, and build amazing projects',
        adminId: 'club-admin-3',
        adminName: 'Alex Brown',
        memberCount: 78,
        createdAt: '2024-01-15',
      },
    ];

    const mockStudents: Student[] = [
      {
        id: 'student-1',
        name: 'Alice Cooper',
        email: 'alice@student.techuni.edu',
        enrolledClubs: ['club-1', 'club-2'],
        joinedAt: '2024-01-20',
        isActive: true,
      },
      {
        id: 'student-2',
        name: 'Bob Johnson',
        email: 'bob@student.techuni.edu',
        enrolledClubs: ['club-1'],
        joinedAt: '2024-01-22',
        isActive: true,
      },
      {
        id: 'student-3',
        name: 'Carol Smith',
        email: 'carol@student.techuni.edu',
        enrolledClubs: ['club-2', 'club-3'],
        joinedAt: '2024-01-25',
        isActive: false,
      },
    ];

    setClubs(mockClubs);
    setStudents(mockStudents);
  }, [user, router]);

  const handleAddClub = (clubData: any) => {
    const newClub: Club = {
      id: 'club-' + Date.now(),
      ...clubData,
      adminId: 'club-admin-' + Date.now(),
      memberCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClubs((prev) => [...prev, newClub]);
    setIsAddClubOpen(false);
  };

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.adminName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">College Admin Dashboard</h1>
                <p className="text-gray-600">{user.collegeName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.filter((s) => s.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clubs.reduce((sum, club) => sum + club.memberCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clubs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="clubs">Clubs Management</TabsTrigger>
            <TabsTrigger value="students">Students Management</TabsTrigger>
            <TabsTrigger value="profile">College Profile</TabsTrigger>
            <TabsTrigger value="reports">Analytics & Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="clubs" className="space-y-6">
            <ClubsTable collegeId="current-college" />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled Clubs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">{student.enrolledClubs.length} clubs</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={student.isActive ? 'default' : 'secondary'}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.joinedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>College Profile</CardTitle>
                <CardDescription>Manage your college information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="college-name">College Name</Label>
                  <Input id="college-name" value={user.collegeName} />
                </div>
                <div>
                  <Label htmlFor="college-location">Location</Label>
                  <Input id="college-location" value="San Francisco, CA" />
                </div>
                <div>
                  <Label htmlFor="college-description">Description</Label>
                  <Textarea
                    id="college-description"
                    value="Leading technology university with innovative programs"
                  />
                </div>
                <Button>Update College Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Club Enrollment Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Photography Club</span>
                      <span className="font-medium">45 members</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coding Club</span>
                      <span className="font-medium">78 members</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Debate Society</span>
                      <span className="font-medium">32 members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Student Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Students</span>
                      <span className="font-medium">
                        {students.filter((s) => s.isActive).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Clubs per Student</span>
                      <span className="font-medium">
                        {(
                          students.reduce((sum, s) => sum + s.enrolledClubs.length, 0) /
                          students.length
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AddClubForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adminName: '',
    adminEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="club-name">Club Name</Label>
        <Input
          id="club-name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="club-description">Description</Label>
        <Textarea
          id="club-description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="admin-name">Club Admin Name</Label>
        <Input
          id="admin-name"
          value={formData.adminName}
          onChange={(e) => setFormData((prev) => ({ ...prev, adminName: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="admin-email">Club Admin Email</Label>
        <Input
          id="admin-email"
          type="email"
          value={formData.adminEmail}
          onChange={(e) => setFormData((prev) => ({ ...prev, adminEmail: e.target.value }))}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Create Club & Admin
      </Button>
    </form>
  );
}
