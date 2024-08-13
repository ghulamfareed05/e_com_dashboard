import { SubcategoryInterface } from "@/intefaces/subcategory";
import { TypeInterface } from "@/intefaces/type";
import React, { useEffect, useState } from "react";
import Variant from "../addd_variant/variant_item";
import { useFormik } from "formik";
import { TypeValidationSchema } from "../../validation/typevalidationschema";
import { AdminServices } from "../../services/admin";


interface TypeProps {
  subcategory: SubcategoryInterface;
  onClick: () => void;
}

const Type: React.FC<TypeProps> = ({ subcategory, onClick }) => {
  const [types, setTypes] = useState<TypeInterface[]>([]);
  const [open, setopen] = useState<number | null>(null);
  const [typeToBeUpdated, settypeToBeUpdated] = useState<Number | null>(null);
  const [typeToBeDeleted, settypeToBeDeleted] = useState<Number|null>(null);
  const [editedType, seteditedType] = useState<string>("");
  const fetchTypes = async (subcategoryid: number) => {
    try {
      const response =await AdminServices.getTypesBySubcategory(subcategoryid);
      setTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTypes(Number(subcategory.id));
  }, [subcategory.id]);

  const formik = useFormik({
    initialValues: {
      typeName: "",
      subcategory: {
        id: subcategory.id,
      },
    },
    validationSchema: TypeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const lowercasevalues={...values,typeName:values.typeName.toLowerCase()};
        const response =await AdminServices.createType(lowercasevalues);
        console.log(response);
        resetForm();
        fetchTypes(Number(subcategory.id));
      } catch (error) {
        console.log(error);
      }
      console.log(values);
    },
  });

  const handleDelete = async (typeid: number) => {
    try {
      const response=await AdminServices.deleteType(typeid);
      console.log(response);
      fetchTypes(Number(subcategory.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (type: TypeInterface) => {
    try {
      const response =await AdminServices.updateType(type);
      console.log(response);
      fetchTypes(Number(subcategory.id));
      settypeToBeUpdated(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 top-10 sm:left-64 overflow-y-auto">
    <div className="bg-slate-600 p-3">
      <button
        onClick={onClick}
        className="py-2 px-6 bg-slate-400 text-white font-bold  mb-3 shadow-md hover:shadow-lg rounded shadow-slate-300 hover:shadow-slate-300 hover:scale-105 transition-all ease-in-out duration-500"
      >
        Exit
      </button>
      <div>
        <h1 className="text-center">
          Subcategory : {subcategory.subcategoryName}
        </h1>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col p-4 m-1 border-dotted rounded-lg border-2 gap-3 my-5"
      >
        <label htmlFor="type">Type Name</label>
        <input
          type="text"
          name="typeName"
          id="type"
          placeholder="Enter Type Name"
          value={formik.values.typeName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
          className="w-full p-3 rounded-md border border-white bg-slate-500 mb-3"
        />
        {formik.touched.typeName && formik.errors.typeName && (
          <div className="text-red-500">{formik.errors.typeName}</div>
        )}
        <input
          type="hidden"
          name="subcategory.id"
          value={Number(formik.values.subcategory.id)}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-teal-400 shadow-sm hover:shadow-md  shadow-teal-100 hover:shadow-teal-100 py-2 px-4 rounded-lg w-max mx-auto text-zinc-800 transition-all duration-500 ease-in-out hover:scale-105"
        >
          Save Type
        </button>
      </form>
      <div style={{height:'40vh'}}>
        {types.map((type) => (
          <div
            key={type.id}
            className="flex items-center justify-between border-b border-gray-500 "
          >
            <h1 className="w-5/12 p-3">
              {typeToBeUpdated == type.id ? (
                <input
                  value={editedType}
                  className="text-white bg-zinc-800 p-2 rounded-md"
                  onChange={(e) => {
                    seteditedType(e.target.value);
                  }}
                />
              ) : (
                <>{type.typeName}</>
              )}
            </h1>
            <div className="flex gap-3">
                <button onClick={() => setopen(Number(type.id))}>
                  Add Variant
                </button>
              {open === type.id ? (
                <Variant type={type} onClick={() => setopen(null)} />
              ) : null}
              {typeToBeUpdated != type.id ? (
                <>
                  <button
                    // onClick={() => {
                    //   handleDelete(Number(type.id));
                    // }}
                    onClick={()=>settypeToBeDeleted(Number(type.id))}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  {typeToBeDeleted === type.id ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div className="bg-white p-6 rounded-lg shadow-lg"><span className="text-zinc-700">Deleting the type {type.typeName} will delete all its variants and products.</span><div className="mt-4 flex justify-end space-x-2"><button className="px-4 py-2 bg-red-500 text-white rounded" onClick={()=>handleDelete(Number(typeToBeDeleted))}>Delete</button><button className="px-4 py-2 bg-gray-300 rounded" onClick={()=>settypeToBeDeleted(null)}>Cancel</button></div></div></div> : null}
                  <button
                    onClick={() => {
                      settypeToBeUpdated(Number(type.id));
                      seteditedType(type.typeName);
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      type.typeName = editedType;
                      handleEdit(type);
                    }}
                    className="text-blue-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      settypeToBeUpdated(null);
                    }}
                    className="text-gray-300"
                  >
                    Cancel
                  </button>
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

export default Type;
