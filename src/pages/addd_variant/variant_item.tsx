import { TypeInterface } from "@/intefaces/type";
import { VariantInterface } from "@/intefaces/variant";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { VariantValidationSchema } from "../../validation/variantvalidationschema";
import { AdminServices } from "../../services/admin";


interface VariantProps {
  type: TypeInterface;
  onClick: () => void;
}

const Variant: React.FC<VariantProps> = ({ type, onClick }) => {
  const [variants, setVariants] = useState<VariantInterface[]>([]);
  const [variantToBeUpdated, setvariantToBeUpdated] = useState<Number | null>(null);
  const [editedVariant, seteditedVariant] = useState<string>("");
  const [variantToBeDeleted, setvariantToBeDeleted] = useState<Number|null>(null);
  const fetchVariants = async (typeid: number) => {
    try {
      const response=await AdminServices.getVariantsByType(typeid);
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
        const lowercasevalues={...values,variantName:values.variantName.toLowerCase()};
        const response =await AdminServices.createVariant(lowercasevalues);
        resetForm();
        console.log(response);
        fetchVariants(Number(type.id));
        if(!response.error)
        {
          alert(`Variant created successfully`);
        }
        
      } catch (error) {
        console.log(error);
      }
      console.log(values);
    },
  });

  const handleDelete = async (variantid: number) => {
    try {
      const response=await AdminServices.deleteVariant(variantid);
      console.log(response);
      fetchVariants(Number(type.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (variant: VariantInterface) => {
    try {
      const response =await AdminServices.updateVariant(variant);
      console.log(response);
      fetchVariants(Number(type.id));
      setvariantToBeUpdated(null);
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
        <h1 className="text-center">Type : {type.typeName}</h1>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col p-4 m-1 border-dotted rounded-lg border-2 gap-3 my-5"
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
          className="bg-teal-400 shadow-sm hover:shadow-md  shadow-teal-100 hover:shadow-teal-100 py-2 px-4 rounded-lg w-max mx-auto text-zinc-800 transition-all duration-500 ease-in-out hover:scale-105"
        >
          Save Variant
        </button>
      </form>
      <div style={{height:'40vh'}}>
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between border-b border-gray-500 "
          >
            <h1 className="w-5/12 p-3">
              {variantToBeUpdated == variant.id ? (
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
              {variantToBeUpdated != variant.id ? (
                <>
                  <button
                    // onClick={() => {
                    //   handleDelete(Number(variant.id));
                    // }}
                    onClick={()=>setvariantToBeDeleted(Number(variant.id))}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  {variantToBeDeleted === variant.id ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div className="bg-white p-6 rounded-lg shadow-lg"><span className="text-zinc-800">Are you sure you want to delete the variant {variant.variantName} and all its products?</span><div className="mt-4 flex justify-end space-x-2"><button className="px-4 py-2 bg-red-500 text-white rounded" onClick={()=>handleDelete(Number(variantToBeDeleted))}>Delete</button><button className="px-4 py-2 bg-gray-300 rounded" onClick={()=>setvariantToBeDeleted(null)}>Cancel</button></div></div></div> : null}
                  <button
                    onClick={() => {
                      setvariantToBeUpdated(Number(variant.id));
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
                    className="text-blue-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setvariantToBeUpdated(null);
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

export default Variant;
