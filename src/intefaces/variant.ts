import { TypeInterface } from "./type";

export interface VariantInterface{
    id?:number;
    variantName:string;
    createdAt?:Date;
    updatedAt?:Date;
    type?:TypeInterface;
}