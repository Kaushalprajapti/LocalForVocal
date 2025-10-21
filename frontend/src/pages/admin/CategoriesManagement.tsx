import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Settings
} from 'lucide-react';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Image } from '../../components/common/Image';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Loader';
import { apiClient } from '../../utils/api';

const CategoriesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
  const [productsInCategory, setProductsInCategory] = useState<any[]>([]);
  const [isForcePrompt, setIsForcePrompt] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { showSuccess, showError } = useNotification();
  const deleteCategoryMutation = useDeleteCategory();
  
  // Fetch categories
  const { data: categories, isLoading, refetch } = useCategories();

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteCategoryMutation.mutateAsync(categoryToDelete._id);
      showSuccess('Category deleted successfully');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setProductsInCategory([]);
      setIsForcePrompt(false);
      refetch();
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        showSuccess('Category already deleted');
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        setProductsInCategory([]);
        setIsForcePrompt(false);
        refetch();
        return;
      }
      if (status === 400) {
        try {
          const result: any = await apiClient.get(`/categories/${categoryToDelete._id}/products`, { params: { limit: 50, page: 1 } } as any);
          const list = (result as any).products || (result as any).data?.products || [];
          setProductsInCategory(list);
        } catch {}
        setIsForcePrompt(true);
        showError(error?.response?.data?.message || 'This category contains products.');
        return;
      }
      showError(error.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleForceDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/categories/${categoryToDelete._id}`, { params: { force: true } } as any);
      showSuccess('Category and related products deleted successfully');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setProductsInCategory([]);
      setIsForcePrompt(false);
      refetch();
    } catch (error: any) {
      showError(error?.response?.data?.message || error.message || 'Failed to force delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (category: any) => {
    setCategoryToDelete(category);
    setProductsInCategory([]);
    setIsForcePrompt(false);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Categories</h1>
          <p className="text-secondary-600">
            Manage product categories and organization
          </p>
        </div>
        <Link to="/admin/categories/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="max-w-md">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4 text-secondary-400" />}
          />
        </div>
      </Card>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="p-6">
              <Skeleton className="aspect-square w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-secondary-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={category.image || '/placeholder-category.svg'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  lazy
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {category.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <Badge
                    variant={category.isActive ? 'success' : 'error'}
                    size="sm"
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteModal(category)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Link to={`/admin/categories/edit/${category._id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="text-sm text-secondary-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Settings className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            {searchQuery ? 'No categories found' : 'No categories yet'}
          </h3>
          <p className="text-secondary-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first category'
            }
          </p>
          {!searchQuery && (
            <Link to="/admin/categories/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          {!isForcePrompt ? (
            <>
              <p className="text-secondary-700">
                Are you sure you want to delete "{categoryToDelete?.name}"?
              </p>
              <p className="text-sm text-secondary-600">This action cannot be undone.</p>
            </>
          ) : (
            <>
              <p className="text-secondary-700">
                This category contains products. Deleting it will also delete its products. Proceed?
              </p>
              {productsInCategory.length > 0 && (
                <div className="max-h-48 overflow-auto border border-secondary-200 rounded">
                  <ul className="divide-y divide-secondary-200">
                    {productsInCategory.map((p) => (
                      <li key={p._id} className="p-2 text-sm text-secondary-700">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            {!isForcePrompt ? (
              <Button
                variant="primary"
                onClick={handleDeleteCategory}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                Delete
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleForceDeleteCategory}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                Delete Anyway
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesManagement;
