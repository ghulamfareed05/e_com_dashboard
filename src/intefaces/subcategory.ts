import { CategoryInterface } from "./category";

export interface SubcategoryInterface{
    id?:number;
    subcategoryName:string;
    createdAt?:Date;
    updatedAt?:Date;
    category?:CategoryInterface;
}
