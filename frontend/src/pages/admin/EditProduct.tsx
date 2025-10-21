import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Save
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useUpdateProduct } from '../../hooks/useProducts';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Image } from '../../components/common/Image';
import { api } from '../../utils/api';

interface ProductForm {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  price: number;
  discountPrice: number;
  stock: number;
  maxOrderQuantity: number;
  sku: string;
  tags: string;
  specifications: Record<string, string>;
  isActive: boolean;
}

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useNotification();
  const { data: categories } = useCategories();
  const updateProductMutation = useUpdateProduct();
  
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProductForm>({
    defaultValues: {
      isActive: true,
      maxOrderQuantity: 10,
      tags: '',
      specifications: {}
    }
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productData = await api.products.getById(id);
        setProduct(productData);
        
        // Set form values
        reset({
          name: productData.name,
          description: productData.description,
          category: productData.category._id,
          subCategory: productData.subCategory || '',
          price: productData.price,
          discountPrice: productData.discountPrice || 0,
          stock: productData.stock,
          maxOrderQuantity: productData.maxOrderQuantity,
          sku: productData.sku || '',
          tags: productData.tags?.join(', ') || '',
          isActive: productData.isActive
        });

        // Set specifications
        if (productData.specifications) {
          const specs = Object.entries(productData.specifications).map(([key, value]) => ({
            key,
            value: value as string
          }));
          setSpecifications(specs.length > 0 ? specs : [{ key: '', value: '' }]);
        }

        // Set existing images as previews
        setImagePreviews(productData.images || []);
      } catch (error: any) {
        showError(error.message || 'Failed to fetch product');
        navigate('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset, showError, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductForm) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('subCategory', data.subCategory);
      formData.append('price', data.price.toString());
      formData.append('discountPrice', data.discountPrice?.toString() || '');
      formData.append('stock', data.stock.toString());
      formData.append('maxOrderQuantity', data.maxOrderQuantity.toString());
      formData.append('sku', data.sku);
      formData.append('tags', data.tags);
      formData.append('isActive', data.isActive.toString());
      
      // Add specifications
      const specs: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specs[spec.key] = spec.value;
        }
      });
      formData.append('specifications', JSON.stringify(specs));
      
      // Add new images
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      await updateProductMutation.mutateAsync({ id, data: formData });
      showSuccess('Product updated successfully!');
      navigate('/admin/products');
    } catch (error: any) {
      showError(error.message || 'Failed to update product');
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-secondary-200 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary-200 rounded-lg animate-pulse" />
            ))}
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
            onClick={() => navigate('/admin/products')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Edit Product</h1>
            <p className="text-secondary-600">
              Update product information
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Product Name"
                    {...register('name', { 
                      required: 'Product name is required',
                      minLength: {
                        value: 3,
                        message: 'Product name must be at least 3 characters long'
                      }
                    })}
                    error={errors.name?.message}
                    required
                  />
                  <Input
                    label="SKU"
                    {...register('sku', { 
                      required: 'SKU is required',
                      minLength: {
                        value: 3,
                        message: 'SKU must be at least 3 characters long'
                      }
                    })}
                    error={errors.sku?.message}
                    required
                    placeholder="e.g., PROD-001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description', { 
                      required: 'Description is required',
                      minLength: {
                        value: 10,
                        message: 'Description must be at least 10 characters long'
                      }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe your product in detail (minimum 10 characters)..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                    )}
                  </div>
                  <Input
                    label="Sub Category"
                    {...register('subCategory')}
                    placeholder="e.g., Smartphones"
                  />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  error={errors.price?.message}
                  required
                />
                <Input
                  label="Discount Price"
                  type="number"
                  step="0.01"
                  {...register('discountPrice', {
                    min: { value: 0, message: 'Discount price must be positive' }
                  })}
                  error={errors.discountPrice?.message}
                />
              </div>
            </Card>

            {/* Inventory */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Stock Quantity"
                  type="number"
                  {...register('stock', { 
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock must be non-negative' }
                  })}
                  error={errors.stock?.message}
                  required
                />
                <Input
                  label="Max Order Quantity"
                  type="number"
                  {...register('maxOrderQuantity', { 
                    required: 'Max order quantity is required',
                    min: { value: 1, message: 'Must be at least 1' }
                  })}
                  error={errors.maxOrderQuantity?.message}
                  required
                />
              </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Specifications
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex space-x-3">
                    <Input
                      placeholder="Specification name"
                      value={spec.key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpecification(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpecification(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Product Images
              </h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                  <p className="text-sm text-secondary-600 mb-2">
                    Upload new images
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Choose files
                  </label>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Tags
              </h3>
              <Input
                {...register('tags')}
                placeholder="Enter tags separated by commas"
                helpText="e.g., electronics, smartphone, premium"
              />
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
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
