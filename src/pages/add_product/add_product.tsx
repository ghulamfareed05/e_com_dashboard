import { useEffect, useState } from "react";
import TagInput, { Tag } from "../../components/tag_input";
import { useFormik } from "formik";
import { ProductValidationSchema } from "../../validation/productvalidationschema";
import { AdminServices } from "../../services/admin";
import axios from "axios";
import { CategoryInterface } from "@/intefaces/category";
import { SubcategoryInterface } from "@/intefaces/subcategory";
import { TypeInterface } from "@/intefaces/type";
import { VariantInterface } from "@/intefaces/variant";

export const AddProduct = () => {
  const [imageFiles, setImageFiles] = useState<any>([]);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setcategories] = useState<CategoryInterface[]>([]);
  const [subcategories, setsubcategories] = useState<SubcategoryInterface[]>([]);
  const [types, settypes] = useState<TypeInterface[]>([]);
  const [variants, setvariants] = useState<VariantInterface[]>([]);

  const fetchCategories = async () => {
    try {
      const response =await AdminServices.getCategories();
      setcategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSubcategories = async (categoryid: number) => {
    try {
      const response =await AdminServices.getSubcategoriesByCategory(categoryid);
      setsubcategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTypes = async (subcategoryid: number) => {
    try {
      const response =await AdminServices.getTypesBySubcategory(subcategoryid);
      settypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchVariants = async (typeid: number) => {
    try {
      const response =await AdminServices.getVariantsByType(typeid);
      setvariants(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert("You can upload maximum 5 images");
      return false;
    }
    setImageFiles([...imageFiles, ...files]);
    return files;
  };
  const removeImage = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const updatedImages = [...imageFiles];
    updatedImages.splice(index, 1);
    setImageFiles(updatedImages);
  };


  const formik = useFormik({
    initialValues: {
      productName: "",
      price: undefined,
      description: "",
      units: 0,
      tags: [] as Tag[],
      // category: "",
      images: [""],
      category: {
        id: undefined,
      },
      subcategory: {
        id: undefined,
      },
      type: {
        id: undefined,
      },
      variant: {
        id: undefined,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    
    validationSchema: ProductValidationSchema,
    onSubmit: async (values) => {
      //values:ProductInterface
      console.log("SUbmiting data");
      setSubmitting(true);
      console.log(values);
      try {
        const uploadedImages = await Promise.all(
          imageFiles.map(async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "d7rtvmdb");
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/dk4wazera/image/upload`,
              formData
            );
            console.log(response);
            return response.data.secure_url;
          })
        );
        console.log("Uploaded images:", uploadedImages);
        values.images = uploadedImages;
        const result = await AdminServices.createProduct(values); 
        console.log(result);
      } catch (e) {
        console.log(e);
      }
      // handleFileChange(values.file); //PREVIOUSLY COMMENTED
      setSubmitting(false);
    },
  });
  console.log(submitting);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="p-4 sm:ml-64 ">
        <div className="p-4 border-2  border-dashed rounded-lg border-gray-700 mt-12">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* <div>
              <SelectCategory
                value={formik.values.category} // Assuming category is the name of the field
                onChange={(category) => {
                  formik.setFieldValue("category", category);
                  console.log(category);
                }}
              />
              {formik.touched.category && formik.errors.category && (
                <div className="text-red-500">{formik.errors.category}</div>
              )}
            </div> */}
            <div className="flex flex-col p-1">
              <label htmlFor="category" className="text-white">
                Select Category
              </label>
              <select
                name="category.id"
                id="category"
                className="p-3 mt-1 bg-transparent rounded-lg border-white border-[1.5px]"
                value={formik.values.category.id}
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchSubcategories(Number(e.target.value));
                  settypes([]);
                }}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Category"></option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {formik.touched.category?.id && formik.errors.category && (
                <div className="text-red-500">
                  {formik.errors.category.id as any}
                </div>
              )}
            </div>

            <div className="flex flex-col p-1">
              <label htmlFor="subcategory" className="text-white">
                Select Subcategory
              </label>
              <select
                name="subcategory.id"
                id="subcategory"
                className="p-3 mt-1 bg-transparent rounded-lg border- border-[1.5px]"
                value={formik.values.subcategory.id}
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchTypes(Number(e.target.value));
                  // setsubcategoryid(Number(e.target.value));
                  setvariants([]);
                }}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Subcategory"></option>
                {subcategories.map((subcategory) => (
                  <option value={subcategory.id} key={subcategory.id}>
                    {subcategory.subcategoryName}
                  </option>
                ))}
              </select>
              {formik.touched.subcategory?.id && formik.errors.subcategory && (
                <div className="text-red-500">
                  {formik.errors.subcategory.id as any}
                </div>
              )}
            </div>
            <div className="flex flex-col p-1">
              <label htmlFor="type" className="text-white">
                Select Type
              </label>
              <select
                name="type.id"
                id="type"
                className="p-3 mt-1 bg-transparent rounded-lg border-white border-[1.5px]"
                onChange={(e) => {
                  formik.handleChange(e);
                  fetchVariants(Number(e.target.value));
                  // settypeid(Number(e.target.value));
                }}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Type"></option>
                {types.map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              {formik.touched.type?.id && formik.errors.type && (
                <div className="text-red-500">
                  {formik.errors.type.id as any}
                </div>
              )}
            </div>
            <div className="flex flex-col p-1">
              <label htmlFor="variant" className="text-white">
                Select Variant
              </label>
              <select
                name="variant.id"
                id="variant"
                className="p-3 mt-1 bg-transparent rounded-lg border-white border-[1.5px]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Select Variant"></option>
                {variants.map((variant) => (
                  <option value={variant.id} key={variant.id}>
                    {variant.variantName}
                  </option>
                ))}
              </select>
              {formik.touched.variant?.id && formik.errors.variant && (
                <div className="text-red-500">
                  {formik.errors.variant.id as any}
                </div>
              )}
            </div>
          </div>
          <div className="mb-5">
            <TagInput
              id="TagInput"
              value={formik.values.tags}
              onChange={(tags) => formik.setFieldValue("tags", tags)} // Update formik state
            />{" "}
            {formik.touched.tags && formik.errors.tags && (
              <div className="text-red-500">{formik.errors.tags as any}</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-sm ">
              <div className="flex flex-col gap-5.5 p-7.0">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formik.values.productName}
                    onChange={(e) => formik.handleChange("productName")(e)}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Product Name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input "
                  />
                  {formik.touched.productName && formik.errors.productName && (
                    <div className="text-red-500">
                      {formik.errors.productName}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-sm ">
              <div className="flex flex-col gap-5.5 p-7.0">
                <div>
                  <label className="mb-3 block text-sm font-medium text-white">
                    Product Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formik.values.price}
                    onChange={(e) => formik.handleChange("price")(e)}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Product Price"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input "
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-red-500">{formik.errors.price}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium text-white ">
              Product Discription
            </label>
            <textarea
              rows={6}
              value={formik.values.description}
              name="description"
              onBlur={formik.handleBlur}
              onChange={(e) => formik.handleChange("description")(e)}
              placeholder="Enter Product Discription"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-3 block text-sm font-medium text-white">
                Attach file
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.setFieldValue("file", e.target.files);
                  handleFileChange(e);
                }}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
              {/* {formik.touched.file && formik.errors.file && (
                <div className="text-red-500">{formik.errors.file}</div>
              )} */}
            </div>
            <div>
              <label className="mb-3 block text-sm font-medium text-white">
                Units of Product
              </label>
              <input
                type="text"
                value={formik.values.units}
                onBlur={formik.handleBlur}
                name="units"
                onChange={(e) => formik.handleChange("units")(e)}
                placeholder="Enter Units of Product"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-slate-500 px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input "
              />
              {formik.touched.units && formik.errors.units && (
                <div className="text-red-500">{formik.errors.units}</div>
              )}
            </div>

            {/* <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div> */}
          </div>
          <div className="flex flex-wrap items-center justify-start h-48 mb-4 rounded bg-gray-800">
            {imageFiles.map((file: any, index: any) => (
              <div
                key={index}
                className="relative flex items-center max-w-56 min-w-40 justify-center rounded  h-36 dark:bg-gray-800 overflow-hidden mr-2 mb-2"
              >
                <img
                  src={URL.createObjectURL(file)}
                  width={500}
                  height={500}
                  alt={`Image ${index + 1}`}
                  className="max-h-full max-w-full object-fill "
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white py-1 px-3  rounded-full"
                  onClick={(e) => removeImage(index, e)}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="border border-black rounded-lg p-2 bg-teal-400 "
            type="submit"
            disabled={submitting}
          >
            Save Product
          </button>
        </div>
      </div>{" "}
    </form>
  );
};
