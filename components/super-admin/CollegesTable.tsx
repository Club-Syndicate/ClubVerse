'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { db } from '@/lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { CollegeFormModal } from './CollegeFormModal';
import { Plus, Search, Edit, Trash2, Building2, Users, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  College, 
  CollegeFirestoreDoc, 
  CollegeFormData, 
  isFirebaseConfigured, 
  convertFirestoreDocToCollege 
} from '@/types/college';

export const CollegesTable: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState<College | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Real-time data fetching from Firestore
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // Use mock data for development/testing
      const mockColleges: College[] = [
        {
          id: 'mock-college-1',
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
          id: 'mock-college-2',
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
      setColleges(mockColleges);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'colleges'),
      (snapshot) => {
        const collegesData = snapshot.docs.map(doc => 
          convertFirestoreDocToCollege(doc.id, doc.data() as CollegeFirestoreDoc)
        );
        setColleges(collegesData);
      },
      (error) => {
        console.error('Error fetching colleges:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch colleges data',
          variant: 'destructive',
        });
      }
    );

    return unsubscribe;
  }, [toast]);

  // Filter colleges based on search text
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchText.toLowerCase()) ||
    college.location.toLowerCase().includes(searchText.toLowerCase()) ||
    college.adminName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Add new college
  const handleAddCollege = async (data: CollegeFormData) => {
    setIsLoading(true);
    try {
      if (!isFirebaseConfigured()) {
        // Handle mock data addition
        const newCollege: College = {
          id: `mock-college-${Date.now()}`,
          ...data,
          adminId: `admin-${Date.now()}`,
          clubCount: 0,
          studentCount: 0,
          createdAt: new Date().toISOString(),
        };
        
        setColleges(prev => [...prev, newCollege]);
        
        toast({
          title: 'Success',
          description: 'College added successfully (Mock Mode)',
        });
      } else {
        await addDoc(collection(db, 'colleges'), {
          ...data,
          adminId: `admin-${Date.now()}`,
          clubCount: 0,
          studentCount: 0,
          createdAt: serverTimestamp(),
        });

        toast({
          title: 'Success',
          description: 'College added successfully',
        });
      }
      
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding college:', error);
      toast({
        title: 'Error',
        description: 'Failed to add college',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing college
  const handleEditCollege = async (data: CollegeFormData) => {
    if (!editingCollege) return;
    
    setIsLoading(true);
    try {
      if (!isFirebaseConfigured()) {
        // Handle mock data update
        setColleges(prev => prev.map(college => 
          college.id === editingCollege.id 
            ? { ...college, ...data, updatedAt: new Date().toISOString() }
            : college
        ));
        
        toast({
          title: 'Success',
          description: 'College updated successfully (Mock Mode)',
        });
      } else {
        await updateDoc(doc(db, 'colleges', editingCollege.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });

        toast({
          title: 'Success',
          description: 'College updated successfully',
        });
      }
      
      setIsEditModalOpen(false);
      setEditingCollege(null);
    } catch (error) {
      console.error('Error updating college:', error);
      toast({
        title: 'Error',
        description: 'Failed to update college',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete college
  const handleDeleteCollege = async () => {
    if (!collegeToDelete) {
      console.error('No college selected for deletion');
      return;
    }

    setIsLoading(true);
    
    try {
      if (!isFirebaseConfigured()) {
        // Handle mock data deletion
        setColleges(prev => prev.filter(college => college.id !== collegeToDelete.id));
        
        toast({
          title: 'Success',
          description: `College "${collegeToDelete.name}" deleted successfully (Mock Mode)`,
        });
      } else {
        // Handle Firebase deletion
        if (!db) {
          throw new Error('Firebase database not initialized');
        }

        await deleteDoc(doc(db, 'colleges', collegeToDelete.id));

        toast({
          title: 'Success',
          description: `College "${collegeToDelete.name}" deleted successfully`,
        });
      }
      
      setIsDeleteDialogOpen(false);
      setCollegeToDelete(null);
    } catch (error) {
      console.error('Error deleting college:', error);
      toast({
        title: 'Error',
        description: `Failed to delete college: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (college: College) => {
    setEditingCollege(college);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation
  const openDeleteDialog = (college: College) => {
    setCollegeToDelete(college);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Colleges Management
          </CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by college name, location, or admin name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Admin</TableHead>
                <TableHead className="hidden sm:table-cell">Stats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredColleges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchText ? 'No colleges found matching your search.' : 'No colleges added yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredColleges.map((college) => (
                  <TableRow key={college.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{college.name}</div>
                        <div className="text-sm text-gray-500 md:hidden flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {college.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {college.location}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {college.adminName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />
                          {college.clubCount} Clubs
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {college.studentCount} Students
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(college)}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(college)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add College Modal */}
      <CollegeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCollege}
        isLoading={isLoading}
      />

      {/* Edit College Modal */}
      <CollegeFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCollege(null);
        }}
        onSubmit={handleEditCollege}
        initialValues={editingCollege}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete College</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{collegeToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCollege}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
