import { CategoryInterface } from "@/intefaces/category";
import { SubcategoryInterface } from "@/intefaces/subcategory";
import React, { useEffect, useState } from "react";
import Type from "../add_type/type_item";
import { useFormik } from "formik";
import { SubategoryValidationSchema } from "../../validation/subcategoryvalidationschema";
import { AdminServices } from "../../services/admin";

interface SubcategoryProps {
  category: CategoryInterface;
  onClick: () => void;
}

const Subcategory: React.FC<SubcategoryProps> = ({ category, onClick }) => {
  const [subcategories, setSubcategories] = useState<SubcategoryInterface[]>(
    []
  );
  const [open, setopen] = useState<number | null>(null);
  const [subcategoryToBeUpdated, setsubcategoryToBeUpdated] = useState<number|null>(null);
  const [subcategoryToBeDaleted, setsubcategoryToBeDaleted] = useState<number|null>(null);
  const [editedSubcategory, seteditedSubcategory] = useState<string>("");
  const fetchSubcategories = async (categoryid: number) => {
    try {
      const response=await AdminServices.getSubcategoriesByCategory(categoryid);
      setSubcategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSubcategories(Number(category.id));
  }, [category.id]);

  const formik = useFormik({
    initialValues: {
      subcategoryName: "",
      category: {
        id: Number(category.id),
      },
    },
    validationSchema:SubategoryValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const lowercasevalues={...values,subcategoryName:values.subcategoryName.toLowerCase()};
        const response=await AdminServices.createSubcategory(lowercasevalues)
        console.log(response);
        resetForm();
        fetchSubcategories(Number(category.id));
      } catch (error) {
        console.log(error);
      }
      console.log(values);
    },

  });

  const handleDelete=async(subcategoryid:number)=>{
    try {
      const response =await AdminServices.deleteSubcategory(subcategoryid);
      console.log(response);
      fetchSubcategories(Number(category.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit=async(subcategory:SubcategoryInterface)=>{
    try {
      const response =await AdminServices.updateSubcategory(subcategory);
      console.log(response);
      fetchSubcategories(Number(category.id));
      setsubcategoryToBeUpdated(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed overflow-y-auto inset-0 top-10 sm:left-64">
    <div className=" bg-slate-600 p-3">
      <button
        onClick={onClick}
        className="py-2 px-6 bg-slate-400 text-white font-bold  mb-3 shadow-md hover:shadow-lg rounded shadow-slate-300 hover:shadow-slate-300 hover:scale-105 transition-all ease-in-out duration-500"
      >
        Exit
      </button>
      <div>
        <h1 className="text-center">Category : {category.categoryName}</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
        className="w-full flex flex-col p-4 border-dotted m-1 rounded-lg border-2 gap-3 my-5"
      >
        <label htmlFor="subcategory">Subcategory Name</label>
        <input
          type="text"
          name="subcategoryName"
          id="subcategory"
          placeholder="Enter Subcategory Name"
          className="w-full p-3 rounded-md border border-white bg-slate-500 mb-3"
          value={formik.values.subcategoryName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
        />
        {formik.touched.subcategoryName && formik.errors.subcategoryName && (
          <div className="text-red-500">{formik.errors.subcategoryName}</div>
        )}
        <input
          type="hidden"
          name="category.id"
          value={Number(formik.values.category.id)}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-teal-400 shadow-sm hover:shadow-md  shadow-teal-100 hover:shadow-teal-100 py-2 px-4 rounded-lg w-max mx-auto text-zinc-800 transition-all duration-500 ease-in-out hover:scale-105"
        >
          Save Subcategory
        </button>
      </form>
      <div style={{height:'40vh'}}>
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="flex items-center justify-between border-b border-gray-500 "
          >
            <h1 className="p-3">
              {subcategoryToBeUpdated == subcategory.id ? (
                <input
                  value={editedSubcategory}
                  className="text-white rounded-md p-2 bg-zinc-800"
                  onChange={(e) => {
                    seteditedSubcategory(e.target.value);
                  }}
                />
              ) : (
                <>{subcategory.subcategoryName}</>
              )}
            </h1>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setopen(Number(subcategory.id))}>
                Add Type
              </button>
              {open === subcategory.id ? (
                <Type subcategory={subcategory} onClick={() => setopen(null)} />
              ) : null}
              {subcategoryToBeUpdated != subcategory.id ? (
                <>
                  <button
                    // onClick={() => {
                    //   handleDelete(Number(subcategory.id));
                    // }}
                    onClick={()=>setsubcategoryToBeDaleted(Number(subcategory.id))}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  {subcategoryToBeDaleted === subcategory.id ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div className="bg-white p-6 rounded-lg shadow-lg"><span className="text-zinc-700">Deleting the subcategory {subcategory.subcategoryName} will delete all its types, variants and products.</span><div className="mt-4 flex justify-end space-x-2"><button className="px-4 py-2 bg-red-500 text-white rounded" onClick={()=>handleDelete(Number(subcategoryToBeDaleted))}>Delete</button><button className="px-4 py-2 bg-gray-300 rounded" onClick={()=>setsubcategoryToBeDaleted(null)}>Cancel</button></div></div></div> : null}
                  <button onClick={()=>{
                    setsubcategoryToBeUpdated(Number(subcategory.id));
                    seteditedSubcategory(subcategory.subcategoryName)
                  }} className="text-blue-500">Edit</button>
                </>
              ) : (
                <>
                  <button onClick={()=>{
                    subcategory.subcategoryName=editedSubcategory;
                    handleEdit(subcategory);
                  }} className="text-blue-500">Save</button>
                  <button onClick={()=>{setsubcategoryToBeUpdated(null)}} className="text-gray-300">Cancel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Subcategory;
