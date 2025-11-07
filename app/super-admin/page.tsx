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
import {
  Building2,
  Users,
  BarChart3,
  Plus,
  Search,
  Edit,
  Trash2,
  LogOut,
  Crown,
} from 'lucide-react';
import { CollegesTable } from '@/components/super-admin/CollegesTable';
import { SuperAdminAnalytics } from '@/components/analytics/SuperAdminAnalytics';

interface College {
  id: string;
  name: string;
  location: string;
  description: string;
  adminId: string;
  adminName: string;
  clubCount: number;
  studentCount: number;
  createdAt: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  collegeId: string;
  collegeName: string;
  adminId: string;
  adminName: string;
  memberCount: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  collegeName?: string;
  clubName?: string;
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
  const [isAddClubOpen, setIsAddClubOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      router.push('/');
      return;
    }

    // Mock data
    const mockColleges: College[] = [
      {
        id: 'college-1',
        name: 'Tech University',
        location: 'San Francisco, CA',
        description: 'Leading technology university with innovative programs',
        adminId: 'admin-1',
        adminName: 'John Smith',
        clubCount: 25,
        studentCount: 1200,
        createdAt: '2024-01-01',
      },
      {
        id: 'college-2',
        name: 'State College',
        location: 'Austin, TX',
        description: 'Comprehensive state college with diverse academic offerings',
        adminId: 'admin-2',
        adminName: 'Sarah Johnson',
        clubCount: 18,
        studentCount: 800,
        createdAt: '2024-01-05',
      },
    ];

    const mockClubs: Club[] = [
      {
        id: 'club-1',
        name: 'Photography Club',
        description: 'Capture moments, create memories',
        collegeId: 'college-1',
        collegeName: 'Tech University',
        adminId: 'club-admin-1',
        adminName: 'Mike Wilson',
        memberCount: 45,
        createdAt: '2024-01-10',
      },
      {
        id: 'club-2',
        name: 'Debate Society',
        description: 'Sharpen your arguments and public speaking',
        collegeId: 'college-1',
        collegeName: 'Tech University',
        adminId: 'club-admin-2',
        adminName: 'Emma Davis',
        memberCount: 32,
        createdAt: '2024-01-12',
      },
      {
        id: 'club-3',
        name: 'Coding Club',
        description: 'Learn, code, and build amazing projects',
        collegeId: 'college-2',
        collegeName: 'State College',
        adminId: 'club-admin-3',
        adminName: 'Alex Brown',
        memberCount: 78,
        createdAt: '2024-01-15',
      },
    ];

    const mockUsers: User[] = [
      {
        id: 'admin-1',
        name: 'John Smith',
        email: 'john@techuni.edu',
        role: 'college_admin',
        collegeName: 'Tech University',
        createdAt: '2024-01-01',
      },
      {
        id: 'club-admin-1',
        name: 'Mike Wilson',
        email: 'mike@techuni.edu',
        role: 'club_admin',
        collegeName: 'Tech University',
        clubName: 'Photography Club',
        createdAt: '2024-01-10',
      },
      {
        id: 'student-1',
        name: 'Alice Cooper',
        email: 'alice@student.techuni.edu',
        role: 'student',
        collegeName: 'Tech University',
        createdAt: '2024-01-20',
      },
    ];

    setColleges(mockColleges);
    setClubs(mockClubs);
    setUsers(mockUsers);
  }, [user, router]);

  const handleAddCollege = (collegeData: any) => {
    const newCollege: College = {
      id: 'college-' + Date.now(),
      ...collegeData,
      adminId: 'admin-' + Date.now(),
      clubCount: 0,
      studentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setColleges((prev) => [...prev, newCollege]);
    setIsAddCollegeOpen(false);
  };

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Manage colleges, clubs, and platform overview</p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{colleges.length}</div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
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

        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList>
            <TabsTrigger value="colleges">Colleges Management</TabsTrigger>
            <TabsTrigger value="clubs">Clubs Management</TabsTrigger>
            <TabsTrigger value="users">Users Overview</TabsTrigger>
            <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="colleges" className="space-y-6">
            <CollegesTable />
          </TabsContent>

          <TabsContent value="clubs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isAddClubOpen} onOpenChange={setIsAddClubOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Club
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Club</DialogTitle>
                    <DialogDescription>Create a new club and assign admin</DialogDescription>
                  </DialogHeader>
                  <AddClubForm colleges={colleges} onSubmit={handleAddClub} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {clubs
                .filter(
                  (club) =>
                    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    club.collegeName.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((club) => (
                  <Card key={club.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{club.name}</CardTitle>
                          <CardDescription>{club.collegeName}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{club.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Admin:</span> {club.adminName}
                        </div>
                        <div>
                          <span className="font-medium">Members:</span> {club.memberCount}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {club.createdAt}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
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
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College/Club
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users
                    .filter(
                      (user) =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              user.role === 'college_admin'
                                ? 'default'
                                : user.role === 'club_admin'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.clubName || user.collegeName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SuperAdminAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AddCollegeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
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
        <Label htmlFor="college-name">College Name</Label>
        <Input
          id="college-name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="admin-name">Admin Name</Label>
        <Input
          id="admin-name"
          value={formData.adminName}
          onChange={(e) => setFormData((prev) => ({ ...prev, adminName: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="admin-email">Admin Email</Label>
        <Input
          id="admin-email"
          type="email"
          value={formData.adminEmail}
          onChange={(e) => setFormData((prev) => ({ ...prev, adminEmail: e.target.value }))}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Create College & Admin
      </Button>
    </form>
  );
}

function AddClubForm({
  colleges,
  onSubmit,
}: {
  colleges: College[];
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collegeId: '',
    adminName: '',
    adminEmail: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCollege = colleges.find((c) => c.id === formData.collegeId);
    onSubmit({
      ...formData,
      collegeName: selectedCollege?.name || '',
    });
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
        <Label htmlFor="college-select">College</Label>
        <select
          id="college-select"
          value={formData.collegeId}
          onChange={(e) => setFormData((prev) => ({ ...prev, collegeId: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="club-admin-name">Club Admin Name</Label>
        <Input
          id="club-admin-name"
          value={formData.adminName}
          onChange={(e) => setFormData((prev) => ({ ...prev, adminName: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="club-admin-email">Club Admin Email</Label>
        <Input
          id="club-admin-email"
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
