import axiosInstance from '../utils/axiosConfig';

const StatisticsService = {
  fetchRevenueStats: async (filters) => {
    try {
      const params = {
        day: filters.day || null,
        month: filters.month || null,
        year: filters.year || null,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : null,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : null
      };

      const response = await axiosInstance.get('/statistical/revenue-stats', { params });
      return response.data;
    } catch (error) {
      console.error('Error in fetchRevenueStats:', error);
      return 0;
    }
  },

  fetchRevenueByEmployee: async (filters) => {
    try {
      const params = {
        day: filters.day || null,
        month: filters.month || null,
        year: filters.year || null,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : null,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : null
      };

      const response = await axiosInstance.get('/statistical/revenue-by-employee', { params });
      return response.data;
    } catch (error) {
      console.error('Error in fetchRevenueByEmployee:', error);
      return [];
    }
  },

  fetchRevenueByProduct: async (filters) => {
    try {
      const params = {
        day: filters.day || null,
        month: filters.month || null,
        year: filters.year || null,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : null,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : null
      };

      const response = await axiosInstance.get('/statistical/revenue-by-product', { params });
      return response.data;
    } catch (error) {
      console.error('Error in fetchRevenueByProduct:', error);
      return [];
    }
  },

  fetchRevenueByCategory: async (filters) => {
    try {
      const params = {
        day: filters.day || null,
        month: filters.month || null,
        year: filters.year || null,
        startDate: filters.startDate ? new Date(filters.startDate).toISOString() : null,
        endDate: filters.endDate ? new Date(filters.endDate).toISOString() : null
      };

      const response = await axiosInstance.get('/statistical/revenue-by-category', { params });
      return response.data;
    } catch (error) {
      console.error('Error in fetchRevenueByCategory:', error);
      return [];
    }
  },

  fetchProductDetails: async (productId) => {
    try {
      console.log('Fetching product details for ID:', productId);
      const response = await axiosInstance.get('/products/getproduct & pagging', {
        params: {
          id: productId
        }
      });
      console.log('Product details response:', response);

      if (response.data && response.data.items && response.data.items.length > 0) {
        const product = response.data.items[0];
        return {
          productName: product.productName,
          description: product.description,
          price: product.price,
          quantityInStock: product.quantityInStock,
          categoryId: product.categoryId,
          imageUrl: product.imageUrl
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  },

  fetchTopSellingProducts: async (filters = {}) => {
    try {
      const params = {
        topN: filters.topN || 10
      };

      if (filters.startDate) {
        params.startDate = new Date(filters.startDate).toISOString();
      }
      if (filters.endDate) {
        params.endDate = new Date(filters.endDate).toISOString();
      }
      if (filters.productName) {
        params.productName = filters.productName;
      }
      if (filters.categoryName) {
        params.categoryName = filters.categoryName;
      }

      console.log('Fetching top selling products with params:', params);
      const response = await axiosInstance.get('/statisticalproduct/top-selling-products', { params });
      console.log('Top selling products response:', response.data);

      if (!Array.isArray(response.data)) {
        console.warn('Top selling products response is not an array:', response.data);
        return [];
      }

      const productsWithDetails = await Promise.all(
        response.data.map(async (product) => {
          console.log('Processing product:', product);
          try {
            const productDetails = await StatisticsService.fetchProductDetails(product.productId);
            console.log('Got product details:', productDetails);
            
            if (productDetails) {
              return {
                ...product,
                productName: productDetails.productName,
                description: productDetails.description,
                price: productDetails.price,
                quantityInStock: productDetails.quantityInStock,
                imageUrl: productDetails.imageUrl
              };
            }
            
            return {
              ...product,
              productName: `SP${product.productId}`
            };
          } catch (error) {
            console.error(`Error fetching details for product ${product.productId}:`, error);
            return {
              ...product,
              productName: `SP${product.productId}`
            };
          }
        })
      );

      console.log('Final products with details:', productsWithDetails);
      return productsWithDetails;
    } catch (error) {
      console.error('Error in fetchTopSellingProducts:', error);
      return [];
    }
  },

  fetchLowStockProducts: async (threshold = null) => {
    try {
      const params = threshold !== null ? { threshold } : {};
      console.log('Fetching low stock products with params:', params);
      const response = await axiosInstance.get('/statisticalproduct/low-stock-products', { params });
      console.log('Low stock products response:', response);

      if (response.data && Array.isArray(response.data)) {
        const productsWithDetails = await Promise.all(
          response.data.map(async (product) => {
            const productDetails = await StatisticsService.fetchProductDetails(product.id);
            return {
              ...product,
              productName: productDetails?.productName || `SP${product.id}`
            };
          })
        );
        return productsWithDetails;
      }
      return [];
    } catch (error) {
      console.error('Error in fetchLowStockProducts:', error);
      return [];
    }
  }
};

export default StatisticsService; 