const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { cloudinary } = require('../middleware/upload');

// @desc    Get all products with filtering, searching, and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      inStock = true
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const hasNext = Number(page) < totalPages;
    const hasPrev = Number(page) > 1;

    res.json({
      success: true,
      data: {
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
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get related products from same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
      stock: { $gt: 0 }
    })
      .populate('category', 'name slug')
      .limit(4)
      .select('name price discountPrice images ratings')
      .lean();

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    console.log('Product creation request body:', req.body);
    console.log('Product creation request files:', req.files);
    
    const {
      name,
      description,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      maxOrderQuantity,
      sku,
      tags,
      specifications
    } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists'
        });
      }
    }

    // Process images from Cloudinary
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      name,
      description,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      maxOrderQuantity,
      sku,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      specifications: specifications ? JSON.parse(specifications) : {},
      images
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      maxOrderQuantity,
      sku,
      tags,
      specifications,
      isActive
    } = req.body;

    // Check if category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Check if SKU already exists (excluding current product)
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku, _id: { $ne: product._id } });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists'
        });
      }
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
        }
      }
      
      // Add new images
      product.images = req.files.map(file => file.path);
    }

    // Update product fields
    Object.assign(product, {
      name: name || product.name,
      description: description || product.description,
      category: category || product.category,
      subCategory: subCategory || product.subCategory,
      price: price !== undefined ? price : product.price,
      discountPrice: discountPrice !== undefined ? discountPrice : product.discountPrice,
      stock: stock !== undefined ? stock : product.stock,
      maxOrderQuantity: maxOrderQuantity || product.maxOrderQuantity,
      sku: sku || product.sku,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : product.tags,
      specifications: specifications ? JSON.parse(specifications) : product.specifications,
      isActive: isActive !== undefined ? isActive : product.isActive
    });

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product has any orders
    const ordersWithProduct = await Order.find({
      'items.productId': product._id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (ordersWithProduct.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with active orders. Consider deactivating instead.'
      });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Bulk upload products
// @route   POST /api/admin/products/bulk-upload
// @access  Private (Admin)
const bulkUploadProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    const results = {
      successful: [],
      failed: []
    };

    for (const productData of products) {
      try {
        // Validate required fields
        if (!productData.name || !productData.description || !productData.price || !productData.category) {
          results.failed.push({
            product: productData.name || 'Unknown',
            error: 'Missing required fields'
          });
          continue;
        }

        // Check if category exists
        const categoryExists = await Category.findById(productData.category);
        if (!categoryExists) {
          results.failed.push({
            product: productData.name,
            error: 'Category not found'
          });
          continue;
        }

        // Check if SKU already exists
        if (productData.sku) {
          const existingProduct = await Product.findOne({ sku: productData.sku });
          if (existingProduct) {
            results.failed.push({
              product: productData.name,
              error: 'SKU already exists'
            });
            continue;
          }
        }

        const product = new Product({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          subCategory: productData.subCategory,
          price: productData.price,
          discountPrice: productData.discountPrice,
          stock: productData.stock || 0,
          maxOrderQuantity: productData.maxOrderQuantity || 10,
          sku: productData.sku,
          tags: productData.tags || [],
          specifications: productData.specifications || {},
          images: productData.images || []
        });

        await product.save();
        results.successful.push(product);
      } catch (error) {
        results.failed.push({
          product: productData.name || 'Unknown',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Bulk upload completed. ${results.successful.length} successful, ${results.failed.length} failed`,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in bulk upload',
      error: error.message
    });
  }
};

// @desc    Get low stock products
// @route   GET /api/admin/products/low-stock
// @access  Private (Admin)
const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const products = await Product.find({
      stock: { $lte: Number(threshold) },
      isActive: true
    })
      .populate('category', 'name')
      .select('name stock price images category')
      .sort({ stock: 1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock products',
      error: error.message
    });
  }
};

// @desc    Increment favorite count for a product
// @route   POST /api/products/:id/favorite
// @access  Public
const incrementFavoriteCount = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment favorite count
    product.favoriteCount = (product.favoriteCount || 0) + 1;
    await product.save();

    res.json({
      success: true,
      message: 'Favorite count incremented successfully',
      data: {
        productId: product._id,
        favoriteCount: product.favoriteCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error incrementing favorite count',
      error: error.message
    });
  }
};

// @desc    Decrement favorite count for a product
// @route   DELETE /api/products/:id/favorite
// @access  Public
const decrementFavoriteCount = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Decrement favorite count (ensure it doesn't go below 0)
    product.favoriteCount = Math.max((product.favoriteCount || 0) - 1, 0);
    await product.save();

    res.json({
      success: true,
      message: 'Favorite count decremented successfully',
      data: {
        productId: product._id,
        favoriteCount: product.favoriteCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error decrementing favorite count',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getLowStockProducts,
  incrementFavoriteCount,
  decrementFavoriteCount
};
