import { SubcategoryInterface } from "./subcategory";

export interface TypeInterface{
    id?:number;
    typeName:string;
    createdAt?:Date;
    updatedAt?:Date;
    subcategory:SubcategoryInterface;
}