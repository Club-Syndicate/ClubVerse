'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const clubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  adminName: z.string().min(1, 'Admin name is required'),
  adminEmail: z.string().email('Valid email is required'),
});

type ClubFormData = z.infer<typeof clubSchema>;

interface Club {
  id?: string;
  name: string;
  description: string;
  category: string;
  adminId?: string;
  adminName: string;
  adminEmail: string;
  memberCount?: number;
  createdAt?: string;
  collegeId?: string;
}

interface ClubFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClubFormData) => void;
  initialValues?: Club | null;
  isLoading?: boolean;
}

const clubCategories = [
  'Academic',
  'Sports',
  'Cultural',
  'Technical',
  'Social Service',
  'Arts',
  'Music',
  'Drama',
  'Photography',
  'Literary',
  'Other'
];

export const ClubFormModal: React.FC<ClubFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        description: initialValues.description,
        category: initialValues.category,
        adminName: initialValues.adminName,
        adminEmail: initialValues.adminEmail,
      });
    } else {
      reset({
        name: '',
        description: '',
        category: '',
        adminName: '',
        adminEmail: '',
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = (data: ClubFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? 'Edit Club' : 'Add New Club'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Club Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter club name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter club description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminName">Club Admin Name</Label>
            <Input
              id="adminName"
              {...register('adminName')}
              placeholder="Enter admin name"
            />
            {errors.adminName && (
              <p className="text-sm text-red-500">{errors.adminName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              type="email"
              {...register('adminEmail')}
              placeholder="Enter admin email"
            />
            {errors.adminEmail && (
              <p className="text-sm text-red-500">{errors.adminEmail.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialValues ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
