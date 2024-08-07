import { CategoryInterface } from "@/intefaces/categora";
import { SubcategoryInterface } from "@/intefaces/subcategory";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Type from "../add_type/type_item";
import { useFormik } from "formik";
import { SubategoryValidationSchema } from "../../validation/subcategoryvalidationschema";

interface SubcategoryProps {
  category: CategoryInterface;
  onClick: () => void;
}

const Subcategory: React.FC<SubcategoryProps> = ({ category, onClick }) => {
  const [subcategories, setSubcategories] = useState<SubcategoryInterface[]>(
    []
  );
  const [open, setopen] = useState<number | null>(null);
  const [isEditing, setisEditing] = useState<number|null>(null);
  const [editedSubcategory, seteditedSubcategory] = useState<string>("");
  const fetchSubcategories = async (categoryid: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/subcategories/getSubcategoriesByCategory/${categoryid}`,
        { headers: { "Content-Type": "application/json" } }
      );
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
        const response = await axios.post(
          "http://localhost:3000/subcategories/admin",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
      const response=await axios.delete(`http://localhost:3000/subcategories/admin/delete/${subcategoryid}`);
      console.log(response);
      fetchSubcategories(Number(category.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit=async(subcategory:SubcategoryInterface)=>{
    try {
      const response =await axios.patch(`http://localhost:3000/subcategories/admin/update/${subcategory.id}`,subcategory);
      console.log(response);
      fetchSubcategories(Number(category.id));
      setisEditing(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-svw h-svh overflow-auto bg-slate-600 fixed top-10 left-64 p-5">
      <button
        onClick={onClick}
        className="py-2 px-5 bg-white text-zinc-800 mb-3"
      >
        Close
      </button>
      <div>
        <h1 className="w-3/4 text-center">Category : {category.categoryName}</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
        className="w-3/4 flex flex-col p-5 border-dotted rounded-lg border-2 gap-3 my-5"
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
          className="bg-teal-400 p-2 rounded-lg w-max mx-auto text-zinc-800"
        >
          Save Subcategory
        </button>
      </form>
      <div className="h-80 overflow-auto mb-3">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="flex items-center gap-56 border-b border-gray-500 "
          >
            <h1 className="w-5/12 p-3">
              {isEditing == subcategory.id ? (
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
            <div className="flex gap-3">
              <button onClick={() => setopen(Number(subcategory.id))}>
                Add Type
              </button>
              {open === subcategory.id ? (
                <Type subcategory={subcategory} onClick={() => setopen(null)} />
              ) : null}
              {isEditing != subcategory.id ? (
                <>
                  <button
                    onClick={() => {
                      handleDelete(Number(subcategory.id));
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  <button onClick={()=>{
                    setisEditing(Number(subcategory.id));
                    seteditedSubcategory(subcategory.subcategoryName)
                  }} className="text-blue-500">Edit</button>
                </>
              ) : (
                <>
                  <button onClick={()=>{
                    subcategory.subcategoryName=editedSubcategory;
                    handleEdit(subcategory);
                  }}>Save</button>
                  <button onClick={()=>{setisEditing(null)}}>Cancel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subcategory;
