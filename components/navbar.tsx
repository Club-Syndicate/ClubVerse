'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, ChevronDown, LogIn, UserPlus, UserCog } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="w-full fixed top-0 py-0 md:py-2 bg-white shadow-sm border-b z-[5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ClubVerse</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div>
                <div className="hidden md:flex items-center space-x-2">
                  {/* Student Auth Dialog */}
                  <Dialog open={isStudentAuthOpen} onOpenChange={setIsStudentAuthOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Student Access</DialogTitle>
                        <DialogDescription>Login or register as a student</DialogDescription>
                      </DialogHeader>
                      <StudentAuthTabs onClose={() => setIsStudentAuthOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  {/* Admin Auth Dialog */}
                  <Dialog open={isAdminAuthOpen} onOpenChange={setIsAdminAuthOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button>
                            <LogIn className="h-4 w-4 mr-2" />
                            Admin Login
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setIsAdminAuthOpen(true)}>
                            College Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setIsAdminAuthOpen(true)}>
                            Club Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Admin Login</DialogTitle>
                        <DialogDescription>Login as College Admin or Club Admin</DialogDescription>
                      </DialogHeader>
                      <AdminAuthForm onClose={() => setIsAdminAuthOpen(false)} />
                    </DialogContent>
                  </Dialog>

                  {/* Super Admin Link */}
                  <Link href="/super-admin/login">
                    <Button variant="ghost" size="sm">
                      Super Admin
                    </Button>
                  </Link>
                </div>

                <div className="flex md:hidden">
                  <DropdownMenu>
                    {/* hamberger */}
                    <DropdownMenuTrigger>
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <Dialog open={isStudentAuthOpen} onOpenChange={setIsStudentAuthOpen}>
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <Button variant="ghost">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Student
                            </Button>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Student Access</DialogTitle>
                            <DialogDescription>Login or register as a student</DialogDescription>
                          </DialogHeader>
                          <StudentAuthTabs onClose={() => setIsStudentAuthOpen(false)} />
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuSeparator />

                      <DropdownMenuSub>
                        <Dialog open={isAdminAuthOpen} onOpenChange={setIsAdminAuthOpen}>
                          <DialogTrigger asChild>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="text-md">
                                <Button variant="ghost">
                                  <LogIn className="h-4 w-4 mr-2" />
                                  Admin Login
                                </Button>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setIsAdminAuthOpen(true)}>
                                  College Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsAdminAuthOpen(true)}>
                                  Club Admin
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Admin Login</DialogTitle>
                              <DialogDescription>
                                Login as College Admin or Club Admin
                              </DialogDescription>
                            </DialogHeader>
                            <AdminAuthForm onClose={() => setIsAdminAuthOpen(false)} />
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="text-md">
                        <Link href="/super-admin/login">
                          <Button variant="ghost">
                            <UserCog />
                            Super Admin
                          </Button>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function StudentAuthTabs({ onClose }: { onClose: () => void }) {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <StudentLoginForm onClose={onClose} />
      </TabsContent>
      <TabsContent value="register">
        <StudentRegisterForm onClose={onClose} />
      </TabsContent>
    </Tabs>
  );
}

function StudentLoginForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password, 'student');
      onClose();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student-email">Email</Label>
            <Input
              id="student-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="student-password">Password</Label>
            <Input
              id="student-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function StudentRegisterForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        collegeName: formData.collegeName,
        role: 'student',
      });
      onClose();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reg-name">Full Name</Label>
            <Input
              id="reg-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="reg-college">College Name</Label>
            <Input
              id="reg-college"
              value={formData.collegeName}
              onChange={(e) => setFormData((prev) => ({ ...prev, collegeName: e.target.value }))}
              placeholder="Enter your college name"
              required
            />
          </div>
          <div>
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AdminAuthForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminType, setAdminType] = useState<'college_admin' | 'club_admin'>('college_admin');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password, adminType);
      onClose();
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Admin Type</Label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="college_admin"
                  checked={adminType === 'college_admin'}
                  onChange={(e) => setAdminType(e.target.value as 'college_admin')}
                  className="mr-2"
                />
                College Admin
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="club_admin"
                  checked={adminType === 'club_admin'}
                  onChange={(e) => setAdminType(e.target.value as 'club_admin')}
                  className="mr-2"
                />
                Club Admin
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
