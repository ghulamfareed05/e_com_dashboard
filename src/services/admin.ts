import { ProductInterface } from "@/intefaces/product";
import { AdminEndPoints } from "../constants/EndPoints";
import { HttpClient } from "./httpclient";
import { CategoryInterface } from "../intefaces/category";
import { SubcategoryInterface } from "@/intefaces/subcategory";
import { TypeInterface } from "@/intefaces/type";
import { VariantInterface } from "@/intefaces/variant";

export const AdminServices = {
    async createProduct(data:any){
    
     return  await HttpClient.post(AdminEndPoints.CREATE_PRODUCT,data)

    },
    async updateProduct( data: ProductInterface){
        return await HttpClient.patch(AdminEndPoints.UPDATE_PRODUCT(Number(data.id)),data)
    },
    async getProductByName(name:string){
        return await HttpClient.get(AdminEndPoints.GET_PRODUCT_BY_NAME(name))
    },
    async deleteProduct(id: number){
        return await HttpClient.delete(AdminEndPoints.DELETE_PRODUCT(id))
    },
    async createCategory(data: CategoryInterface){
        return await HttpClient.post(AdminEndPoints.CREATE_CATEGORY,data)
    },
    async getCategories(){
        return await HttpClient.get(AdminEndPoints.GET_ALL_CATEGORIES)
    },
    async deleteCategory(id: number){
        return await HttpClient.delete(AdminEndPoints.DELETE_CATEGORY(id))
    },
    
    // async updateCategory( data: CategoryInterface){
    //     return await HttpClient.put(AdminEndPoints.UPDATE_CATEGORY,data)
    // },
    async updateCategory( data: CategoryInterface){
        return await HttpClient.patch(AdminEndPoints.UPDATE_CATEGORY(Number(data.id)),data)
    },
    async createSubcategory(data:any){
        return await HttpClient.post(AdminEndPoints.CREATE_SUBCATEGORY,data)
    },
    async deleteSubcategory(id: number){
        return await HttpClient.delete(AdminEndPoints.DELETE_SUBCATEGORY(id))
    },
    async updateSubcategory( data: SubcategoryInterface){
        return await HttpClient.patch(AdminEndPoints.UPDATE_SUBCATEGORY(Number(data.id)),data)
    },
    async getSubcategoriesByCategory(categoryid:number){
        return await HttpClient.get(AdminEndPoints.GET_SUBCATEGORIES_BY_CATEGORY(categoryid))
    },
    async createType(data:any){
        return await HttpClient.post(AdminEndPoints.CREATE_TYPE,data)
    },
    async deleteType(id: number){
        return await HttpClient.delete(AdminEndPoints.DELETE_TYPE(id))
    },
    async updateType( data: TypeInterface){
        return await HttpClient.patch(AdminEndPoints.UPDATE_TYPE(Number(data.id)),data)
    },
    async getTypesBySubcategory(subcategoryid:number){
        return await HttpClient.get(AdminEndPoints.GET_TYPES_BY_SUBCATEGORY(subcategoryid))
    },
    async createVariant(data:any){
        return await HttpClient.post(AdminEndPoints.CREATE_VARIANT,data)
    },
    async deleteVariant(id: number){
        return await HttpClient.delete(AdminEndPoints.DELETE_VARIANT(id))
    },
    async updateVariant( data: VariantInterface){
        return await HttpClient.patch(AdminEndPoints.UPDATE_VARIANT(Number(data.id)),data)
    },
    async getVariantsByType(typeid:number){
        return await HttpClient.get(AdminEndPoints.GET_VARIANTS_BY_TYPE(typeid))
    },
    async getAllProducts(){
        return await HttpClient.get(AdminEndPoints.GET_ALL_PRODUCTS)
    },
   
}

