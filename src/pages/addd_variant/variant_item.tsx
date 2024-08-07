import { TypeInterface } from "@/intefaces/type";
import { VariantInterface } from "@/intefaces/variant";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { VariantValidationSchema } from "../../validation/variantvalidationschema";

interface VariantProps {
  type: TypeInterface;
  onClick: () => void;
}

const Variant: React.FC<VariantProps> = ({ type, onClick }) => {
  const [variants, setVariants] = useState<VariantInterface[]>([]);
  const [isEditing, setisEditing] = useState<Number | null>(null);
  const [editedVariant, seteditedVariant] = useState<string>("");
  const fetchVariants = async (typeid: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/variants/getVariantsByType/${typeid}`,
        { headers: { "Content-Type": "application/json" } }
      );
      setVariants(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchVariants(Number(type.id));
  }, [type.id]);

  const formik = useFormik({
    initialValues: {
      variantName: "",
      type: {
        id: type.id,
      },
    },
    validationSchema: VariantValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/variants/admin",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        resetForm();
        console.log(response);
        fetchVariants(Number(type.id));
      } catch (error) {
        console.log(error);
      }
      console.log(values);
    },
  });

  const handleDelete = async (variantid: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/variants/admin/delete/${variantid}`
      );
      console.log(response);
      fetchVariants(Number(type.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (variant: VariantInterface) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/variants/admin/update/${variant.id}`,
        variant
      );
      console.log(response);
      fetchVariants(Number(type.id));
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
        <h1 className="w-3/4 text-center">Type : {type.typeName}</h1>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-3/4 flex flex-col p-5 border-dotted rounded-lg border-2 gap-3 my-5"
      >
        <label htmlFor="variant">Variant Name</label>
        <input
          type="text"
          name="variantName"
          id="variant"
          placeholder="Enter Variant Name"
          value={formik.values.variantName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 rounded-md border border-white bg-slate-500 mb-3"
          autoComplete="off"
        />
        {formik.touched.variantName && formik.errors.variantName && (
          <div className="text-red-500">{formik.errors.variantName}</div>
        )}
        <input
          type="hidden"
          name="type.id"
          value={Number(formik.values.type.id)}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-teal-400 p-2 rounded-lg w-max mx-auto text-zinc-800"
        >
          Save Variant
        </button>
      </form>
      <div className="h-80 overflow-auto mb-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center gap-56 border-b border-gray-500 "
          >
            <h1 className="w-5/12 p-3">
              {isEditing == variant.id ? (
                <input
                  value={editedVariant}
                  className="text-white bg-zinc-800 p-2  rounded-md"
                  onChange={(e) => {
                    seteditedVariant(e.target.value);
                  }}
                />
              ) : (
                <>{variant.variantName}</>
              )}
            </h1>
            <div className="flex gap-3">
              {isEditing != variant.id ? (
                <>
                  <button
                    onClick={() => {
                      handleDelete(Number(variant.id));
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setisEditing(Number(variant.id));
                      seteditedVariant(variant.variantName);
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
                      variant.variantName = editedVariant;
                      handleEdit(variant);
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

export default Variant;
