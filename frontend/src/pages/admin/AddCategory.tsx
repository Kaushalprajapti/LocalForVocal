import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Image } from '../../components/common/Image';
// import { api } from '../../utils/api';
import { useCreateCategory } from '../../hooks/useCategories';

interface CategoryForm {
  name: string;
  parentCategory?: string;
  isActive: boolean;
}

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const createCategory = useCreateCategory();
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryForm>({
    defaultValues: {
      isActive: true
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const onSubmit = async (data: CategoryForm) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', data.name);
      if (data.parentCategory && data.parentCategory.trim() !== '') {
        formData.append('parentCategory', data.parentCategory);
      }
      formData.append('isActive', data.isActive.toString());
      
      // Add image
      if (image) {
        formData.append('image', image);
      }

      await createCategory.mutateAsync(formData);
      showSuccess('Category created successfully!');
      navigate('/admin/categories');
    } catch (error: any) {
      showError(error.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/categories')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Add Category</h1>
            <p className="text-secondary-600">
              Create a new product category
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Category Name"
                  {...register('name', { required: 'Category name is required' })}
                  error={errors.name?.message}
                  required
                  placeholder="e.g., Electronics"
                />
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Parent Category (Optional)
                  </label>
                  <input
                    {...register('parentCategory')}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Technology"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Category Image
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 mb-2">
                    Upload category image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Choose file
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="relative group">
                    <Image
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Status
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label className="ml-2 block text-sm text-secondary-700">
                  Active (visible to customers)
                </label>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/categories')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;



