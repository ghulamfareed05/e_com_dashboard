export const AdminEndPoints = {
    // CREATE_PRODUCT: '/products/admin/',
    // CREATE_CATEGORY: '/category/admin/',
    // DELETE_CATEGORY:(id:string)=> `/category/admin/delete/${id}`,
    // UPDATE_CATEGORY: `/category/admin/update`,
    // GET_CATEGORIES: '/category/',
    // GET_ALL_PRODUCTS: '/products/',
    // UPDATE_PRODUCT:(id:string) => `/admin/product/${id}`,
    // DELETE_PRODUCT:(id:string) => `/admin/product/${id}`,


    CREATE_CATEGORY: '/categories/admin',
    GET_ALL_CATEGORIES: '/categories',
    GET_CATEGORIES_FOR_MENU: '/categories/getCategoriesForMenu',
    GET_CATEGORY_BY_ID: (id: number) => `/categories/getCategoryById/${id}`,
    UPDATE_CATEGORY: (id: number) => `/categories/admin/update/${id}`,
    DELETE_CATEGORY: (id: number) => `/categories/admin/delete/${id}`,
    GET_CATEGORY_BY_NAME: (category: string) => `/categories/getCategoryByName?category=${category}`,


    CREATE_SUBCATEGORY: '/subcategories/admin',
    GET_ALL_SUBCATEGORIES: '/subcategories',
    GET_SUBCATEGORIES_FOR_MENU: '/subcategories/getSubcategoriesForMenu',
    GET_SUBCATEGORY_BY_ID: (id: number) => `/subcategories/getSubcategoryById/${id}`,
    UPDATE_SUBCATEGORY: (id: number) => `/subcategories/admin/update/${id}`,
    DELETE_SUBCATEGORY: (id: number) => `/subcategories/admin/delete/${id}`,
    GET_SUBCATEGORY_BY_NAME: (subcategory: string) => `/subcategories/getSubcategoryByName?subcategory=${subcategory}`,
    GET_SUBCATEGORIES_BY_CATEGORY: (id: number) => `/subcategories/getSubcategoriesByCategory/${id}`,

    CREATE_TYPE: '/types/admin',
    GET_ALL_TYPES: '/types',
    GET_TYPE_BY_ID: (id: number) => `/types/getTypeById/${id}`,
    UPDATE_TYPE: (id: number) => `/types/admin/update/${id}`,
    DELETE_TYPE: (id: number) => `/types/admin/delete/${id}`,
    GET_TYPE_BY_NAME: (type: string) => `/types/getTypeByName?type=${type}`,
    GET_TYPES_BY_SUBCATEGORY: (id: number) => `/types/getTypesBySubcategory/${id}`,

    CREATE_VARIANT: '/variants/admin',
    GET_ALL_VARIANTS: '/variants',
    GET_VARIANT_BY_ID: (id: number) => `/variants/getVariantById/${id}`,
    GET_VARIANT_BY_NAME: (variant: string) => `/variants/getVariantByName?variant=${variant}`,
    UPDATE_VARIANT: (id: number) => `/variants/admin/update/${id}`,
    DELETE_VARIANT: (id: number) => `/variants/admin/delete/${id}`,
    GET_VARIANTS_BY_TYPE: (id: number) => `/variants/getVariantsByType/${id}`,

    CREATE_PRODUCT: '/product/admin',
    GET_ALL_PRODUCTS: '/product',
    GET_PRODUCT_BY_ID: (id: number) => `/product/getProductById/${id}`,
    UPDATE_PRODUCT: (id: number) => `/product/admin/update/${id}`,
    DELETE_PRODUCT: (id: number) => `/product/admin/delete/${id}`,
    GET_PRODUCT_BY_NAME: (product: string) => `/product/getProductByName?product=${product}`,
    GET_PRODUCTS_BY_VARIANT: (variant: string) => `/product/getProductsByVariant?variant=${variant}`,
    GET_PRODUCTS_BY_TYPE: (type: string) => `/product/getProductsByType?type=${type}`,
    GET_PRODUCTS_BY_SUBCATEGORY: (subcategory: string) => `/product/getProductsBySubcategory?subcategory=${subcategory}`,
    GET_PRODUCTS_BY_CATEGORY: (category: string) => `/product/getProductsByCategory?category=${category}`,




}