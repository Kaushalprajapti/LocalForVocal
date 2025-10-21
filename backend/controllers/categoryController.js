const Category = require('../models/Category');
const Product = require('../models/Product');
const { cloudinary } = require('../middleware/upload');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const { includeProducts = false } = req.query;

    let categories;
    
    if (includeProducts === 'true') {
      categories = await Category.find({ isActive: true })
        .populate({
          path: 'products',
          match: { isActive: true, stock: { $gt: 0 } },
          select: 'name price discountPrice images ratings',
          options: { limit: 4 }
        })
        .sort({ name: 1 });
    } else {
      categories = await Category.find({ isActive: true })
        .sort({ name: 1 });
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/categories/:id/products
// @access  Public
const getCategoryProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get products in this category
    const products = await Product.find({
      category: req.params.id,
      isActive: true,
      stock: { $gt: 0 }
    })
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments({
      category: req.params.id,
      isActive: true,
      stock: { $gt: 0 }
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const hasNext = Number(page) < totalPages;
    const hasPrev = Number(page) > 1;

    res.json({
      success: true,
      data: {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug,
          image: category.image
        },
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts: total,
          hasNext,
          hasPrev,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Check if parent category exists
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const category = new Category({
      name,
      parentCategory: parentCategory || null,
      image: imageUrl
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    console.log('Category update request params:', req.params);
    console.log('Category update request body:', req.body);
    console.log('Category update request file:', req.file);
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, parentCategory, isActive } = req.body;

    // Check if category name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: category._id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Check if parent category exists (handle empty string as null)
    const normalizedParentCategory = parentCategory && parentCategory.trim() !== '' ? parentCategory : null;
    
    if (normalizedParentCategory && normalizedParentCategory !== category.parentCategory?.toString()) {
      const parentExists = await Category.findById(normalizedParentCategory);
      if (!parentExists) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }

      // Prevent setting self as parent
      if (normalizedParentCategory === category._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be its own parent'
        });
      }
    }

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary using full public_id derived from URL
      if (category.image) {
        try {
          const url = category.image;
          const uploadIndex = url.indexOf('/upload/');
          if (uploadIndex !== -1) {
            const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);
            // Remove version segment if present (e.g., v1699999999/)
            const parts = pathAfterUpload.split('/');
            const startsWithVersion = /^v\d+$/.test(parts[0]);
            const publicPath = startsWithVersion ? parts.slice(1).join('/') : parts.join('/');
            const publicId = publicPath.replace(/\.[^.]+$/, '');
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (e) {
          // Ignore image deletion failures
        }
      }
      
      category.image = req.file.path;
    }

    // Update category fields
    category.name = name || category.name;
    category.parentCategory = normalizedParentCategory !== undefined ? normalizedParentCategory : category.parentCategory;
    category.isActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : category.isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Super-admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: category._id });
    const force = req.query.force === 'true';
    if (productsCount > 0 && !force) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productsCount} products. Move or delete products first or pass force=true.`,
        data: { productsCount }
      });
    }

    if (productsCount > 0 && force) {
      // Fetch products to delete and clean up their images
      const products = await Product.find({ category: category._id });
      for (const product of products) {
        if (product.images && product.images.length > 0) {
          for (const imageUrl of product.images) {
            try {
              const uploadIndex = imageUrl.indexOf('/upload/');
              if (uploadIndex !== -1) {
                const pathAfterUpload = imageUrl.substring(uploadIndex + '/upload/'.length);
                const parts = pathAfterUpload.split('/');
                const startsWithVersion = /^v\d+$/.test(parts[0]);
                const publicPath = startsWithVersion ? parts.slice(1).join('/') : parts.join('/');
                const publicId = publicPath.replace(/\.[^.]+$/, '');
                await cloudinary.uploader.destroy(publicId);
              }
            } catch (e) {}
          }
        }
        await Product.findByIdAndDelete(product._id);
      }
    }

    // Check if category has subcategories
    const subcategoriesCount = await Category.countDocuments({ parentCategory: category._id });
    if (subcategoriesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${subcategoriesCount} subcategories. Delete subcategories first.`
      });
    }

    // Delete image from Cloudinary
    if (category.image) {
      try {
        const url = category.image;
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex !== -1) {
          const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);
          const parts = pathAfterUpload.split('/');
          const startsWithVersion = /^v\d+$/.test(parts[0]);
          const publicPath = startsWithVersion ? parts.slice(1).join('/') : parts.join('/');
          const publicId = publicPath.replace(/\.[^.]+$/, '');
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (e) {}
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: productsCount > 0 && force ? 'Category and associated products deleted successfully' : 'Category deleted successfully',
      data: { deletedProducts: productsCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// @desc    Get category hierarchy
// @route   GET /api/admin/categories/hierarchy
// @access  Private (Admin)
const getCategoryHierarchy = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name')
      .sort({ name: 1 });

    // Build hierarchy
    const buildHierarchy = (categories, parentId = null) => {
      return categories
        .filter(category => 
          (parentId === null && !category.parentCategory) ||
          (parentId && category.parentCategory && category.parentCategory._id.toString() === parentId)
        )
        .map(category => ({
          ...category.toObject(),
          children: buildHierarchy(categories, category._id.toString())
        }));
    };

    const hierarchy = buildHierarchy(categories);

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category hierarchy',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy
};
