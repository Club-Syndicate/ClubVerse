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
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { ClubFormModal } from './ClubFormModal';
import { Plus, Search, Edit, Trash2, Users, Crown, Calendar, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  memberCount: number;
  createdAt: string;
  collegeId: string;
}

interface ClubsTableProps {
  collegeId?: string;
}

export const ClubsTable: React.FC<ClubsTableProps> = ({ collegeId = 'current-college' }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Real-time data fetching from Firestore
  useEffect(() => {
    // Check if Firebase is properly configured
    const firebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                              process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id';

    if (!firebaseConfigured) {
      // Use mock data for development/testing
      console.log('Firebase not configured, using mock data for clubs');
      const mockClubs: Club[] = [
        {
          id: 'mock-club-1',
          name: 'Photography Club',
          description: 'Capture moments, create memories',
          category: 'Arts',
          adminId: 'club-admin-1',
          adminName: 'Mike Wilson',
          adminEmail: 'mike@example.com',
          memberCount: 45,
          createdAt: '2024-01-10',
          collegeId: collegeId,
        },
        {
          id: 'mock-club-2',
          name: 'Debate Society',
          description: 'Sharpen your arguments and public speaking',
          category: 'Academic',
          adminId: 'club-admin-2',
          adminName: 'Emma Davis',
          adminEmail: 'emma@example.com',
          memberCount: 32,
          createdAt: '2024-01-12',
          collegeId: collegeId,
        },
        {
          id: 'mock-club-3',
          name: 'Coding Club',
          description: 'Learn, code, and build amazing projects',
          category: 'Technical',
          adminId: 'club-admin-3',
          adminName: 'Alex Brown',
          adminEmail: 'alex@example.com',
          memberCount: 78,
          createdAt: '2024-01-15',
          collegeId: collegeId,
        }
      ];
      setClubs(mockClubs);
      return;
    }

    const clubsQuery = query(
      collection(db, 'clubs'),
      where('collegeId', '==', collegeId)
    );

    const unsubscribe = onSnapshot(
      clubsQuery,
      (snapshot) => {
        const clubsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Club[];
        setClubs(clubsData);
        console.log('Loaded clubs from Firestore:', clubsData);
      },
      (error) => {
        console.error('Error fetching clubs:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch clubs data',
          variant: 'destructive',
        });
      }
    );

    return unsubscribe;
  }, [toast, collegeId]);

  // Filter clubs based on search text
  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchText.toLowerCase()) ||
    club.category.toLowerCase().includes(searchText.toLowerCase()) ||
    club.adminName.toLowerCase().includes(searchText.toLowerCase()) ||
    club.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // Add new club
  const handleAddClub = async (data: any) => {
    setIsLoading(true);
    try {
      const firebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id';

      if (!firebaseConfigured) {
        // Handle mock data addition
        const newClub: Club = {
          id: `mock-club-${Date.now()}`,
          ...data,
          adminId: `admin-${Date.now()}`,
          memberCount: 0,
          createdAt: new Date().toISOString(),
          collegeId: collegeId,
        };
        
        setClubs(prev => [...prev, newClub]);
        
        toast({
          title: 'Success',
          description: 'Club added successfully (Mock Mode)',
        });
      } else {
        await addDoc(collection(db, 'clubs'), {
          ...data,
          adminId: `admin-${Date.now()}`,
          memberCount: 0,
          createdAt: serverTimestamp(),
          collegeId: collegeId,
        });

        toast({
          title: 'Success',
          description: 'Club added successfully',
        });
      }
      
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding club:', error);
      toast({
        title: 'Error',
        description: 'Failed to add club',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing club
  const handleEditClub = async (data: any) => {
    if (!editingClub) return;
    
    setIsLoading(true);
    try {
      const firebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id';

      if (!firebaseConfigured) {
        // Handle mock data update
        setClubs(prev => prev.map(club => 
          club.id === editingClub.id 
            ? { ...club, ...data, updatedAt: new Date().toISOString() }
            : club
        ));
        
        toast({
          title: 'Success',
          description: 'Club updated successfully (Mock Mode)',
        });
      } else {
        await updateDoc(doc(db, 'clubs', editingClub.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });

        toast({
          title: 'Success',
          description: 'Club updated successfully',
        });
      }
      
      setIsEditModalOpen(false);
      setEditingClub(null);
    } catch (error) {
      console.error('Error updating club:', error);
      toast({
        title: 'Error',
        description: 'Failed to update club',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete club
  const handleDeleteClub = async () => {
    if (!clubToDelete) {
      console.error('No club selected for deletion');
      return;
    }

    console.log('Attempting to delete club:', clubToDelete);
    setIsLoading(true);
    
    try {
      // Check if using mock data (for development)
      const firebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
                                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'your_project_id';

      if (!firebaseConfigured) {
        // Handle mock data deletion
        console.log('Deleting from mock data');
        setClubs(prev => prev.filter(club => club.id !== clubToDelete.id));
        
        toast({
          title: 'Success',
          description: `Club "${clubToDelete.name}" deleted successfully (Mock Mode)`,
        });
      } else {
        // Handle Firebase deletion
        if (!db) {
          throw new Error('Firebase database not initialized');
        }

        await deleteDoc(doc(db, 'clubs', clubToDelete.id));

        toast({
          title: 'Success',
          description: `Club "${clubToDelete.name}" deleted successfully`,
        });
      }
      
      setIsDeleteDialogOpen(false);
      setClubToDelete(null);
      console.log('Club deleted successfully');
    } catch (error) {
      console.error('Error deleting club:', error);
      toast({
        title: 'Error',
        description: `Failed to delete club: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (club: Club) => {
    console.log('Opening edit modal for club:', club);
    setEditingClub(club);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation
  const openDeleteDialog = (club: Club) => {
    console.log('Opening delete dialog for club:', club);
    setClubToDelete(club);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Clubs Management
          </CardTitle>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Club
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by club name, category, admin name, or description..."
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
                <TableHead>Club</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Admin</TableHead>
                <TableHead className="hidden sm:table-cell">Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchText ? 'No clubs found matching your search.' : 'No clubs added yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClubs.map((club) => (
                  <TableRow key={club.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{club.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {club.description}
                        </div>
                        <div className="md:hidden flex items-center gap-2 mt-2">
                          <Badge className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {club.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {club.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <div className="font-medium">{club.adminName}</div>
                        <div className="text-sm text-gray-500">{club.adminEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{club.memberCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(club)}
                        >
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(club)}
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

      {/* Add Club Modal */}
      <ClubFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClub}
        isLoading={isLoading}
      />

      {/* Edit Club Modal */}
      <ClubFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingClub(null);
        }}
        onSubmit={handleEditClub}
        initialValues={editingClub}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Club</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{clubToDelete?.name}"? This action cannot be undone and will remove all club members and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClub}
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
