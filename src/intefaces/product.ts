import { Tag } from "@/components/tag_input";
import { CategoryInterface } from "./category";
import { VariantInterface } from "./variant";
import { TypeInterface } from "./type";
import { SubcategoryInterface } from "./subcategory";

export interface  ProductInterface{
    id?: number;
    productName: string;
    price: number | undefined;
    description: string;
    units: number;
    images: string[];
    // category: string;
    tags: Tag[];
    variant?:VariantInterface;
    type?:TypeInterface;
    subcategory?:SubcategoryInterface;
    category?:CategoryInterface;
    createdAt?: Date;
    updatedAt?: Date;
}