import { SubcategoryInterface } from "@/intefaces/subcategory";
import { TypeInterface } from "@/intefaces/type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Variant from "../addd_variant/variant_item";
import { useFormik } from "formik";
import { TypeValidationSchema } from "../../validation/typevalidationschema";

interface TypeProps {
  subcategory: SubcategoryInterface;
  onClick: () => void;
}

const Type: React.FC<TypeProps> = ({ subcategory, onClick }) => {
  const [types, setTypes] = useState<TypeInterface[]>([]);
  const [open, setopen] = useState<number | null>(null);
  const [isEditing, setisEditing] = useState<Number | null>(null);
  const [editedType, seteditedType] = useState<string>("");
  const fetchTypes = async (subcategoryid: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/types/getTypesBySubcategory/${subcategoryid}`,
        { headers: { "Content-Type": "application/json" } }
      );
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
        const response = await axios.post(
          "http://localhost:3000/types/admin",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
      const response = await axios.delete(
        `http://localhost:3000/types/admin/delete/${typeid}`
      );
      console.log(response);
      fetchTypes(Number(subcategory.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (type: TypeInterface) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/types/admin/update/${type.id}`,
        type
      );
      console.log(response);
      fetchTypes(Number(subcategory.id));
      setisEditing(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-svw h-svh bg-slate-600 fixed top-10 left-64 p-5">
      <button
        onClick={onClick}
        className="py-2 px-5 bg-white text-zinc-800 mb-3"
      >
        Close
      </button>
      <div>
        <h1 className="w-3/4 text-center">
          Subcategory : {subcategory.subcategoryName}
        </h1>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-3/4 flex flex-col p-5 border-dotted rounded-lg border-2 gap-3 my-5"
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
          className="bg-teal-400 p-2 rounded-lg w-max mx-auto text-zinc-800"
        >
          Save Subcategory
        </button>
      </form>
      <div className="h-80 overflow-auto mb-3">
        {types.map((type) => (
          <div
            key={type.id}
            className="flex items-center gap-56 border-b border-gray-500 "
          >
            <h1 className="w-5/12 p-3">
              {isEditing == type.id ? (
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
              {isEditing != type.id ? (
                <>
                  <button
                    onClick={() => {
                      handleDelete(Number(type.id));
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setisEditing(Number(type.id));
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
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setisEditing(null);
                    }}
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
  );
};

export default Type;
