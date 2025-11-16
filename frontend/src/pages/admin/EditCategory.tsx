import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { api } from '../../utils/api';

interface CategoryForm {
  name: string;
  parentCategory?: string;
  isActive: boolean;
}

const EditCategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useNotification();
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CategoryForm>({
    defaultValues: {
      isActive: true
    }
  });

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const categoryData = await api.categories.getById(id);
        
        // Set form values
        reset({
          name: categoryData.name,
          parentCategory: categoryData.parentCategory || '',
          isActive: categoryData.isActive
        });

        // Set existing image as preview
        if (categoryData.image) {
          setImagePreview(categoryData.image);
        }
      } catch (error: any) {
        showError(error.message || 'Failed to fetch category');
        navigate('/admin/categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, reset, showError, navigate]);

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
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', data.name);
      if (data.parentCategory && data.parentCategory.trim() !== '') {
        formData.append('parentCategory', data.parentCategory);
      }
      formData.append('isActive', data.isActive.toString());
      
      // Add new image if selected
      if (image) {
        formData.append('image', image);
      }

      await api.categories.update(id, formData);
      showSuccess('Category updated successfully!');
      navigate('/admin/categories');
    } catch (error: any) {
      showError(error.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-secondary-200 rounded animate-pulse" />
          <div className="w-64 h-8 bg-secondary-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-secondary-200 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-32 bg-secondary-200 rounded-lg animate-pulse" />
            <div className="h-24 bg-secondary-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-secondary-900">Edit Category</h1>
            <p className="text-secondary-600">
              Update category information
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
                    Upload new image
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
            Update Category
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;



