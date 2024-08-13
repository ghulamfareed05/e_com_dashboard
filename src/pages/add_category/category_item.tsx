import { CategoryInterface } from "../../intefaces/category";
import { AdminServices } from "../../services/admin";
import React, { useEffect, useState } from "react";
import Subcategory from "../add_subcategory/subcategory_item";

interface CategoryItemProps {
  category: CategoryInterface;
  refreshCategories: () => void; // Function to refresh categories
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  refreshCategories,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.categoryName);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setdeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const response=await AdminServices.deleteCategory(Number(category.id));
      refreshCategories(); // Refresh categories after deletion
      // Perform any additional actions after deletion if needed
      console.log(response);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedCategory = { ...category, categoryName: editedName };
      await AdminServices.updateCategory(updatedCategory);
      setEditing(false);
      refreshCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  useEffect(() => {
    setEditedName(category.categoryName);
  }, [category]);

  return (
    <div className="flex items-center justify-between p-4 text-white border-b border-gray-700">
      {editing ? (
        <input
          className="bg-gray-800 p-2 rounded-sm"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      ) : (
        <span className="text-white">{category.categoryName}</span>
      )}
      <div>
        {editing ? (
          <>
            <button onClick={handleEdit} className="text-blue-500 mr-2">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-500">
              Cancel
            </button>
          </>
        ) : (
          <div className="flex gap-2">
          <button onClick={()=>setOpen(true)}>Add Subcategory</button>
          {open==true? <Subcategory category={category} onClick={()=>setOpen(false)}/>:null}
            <button
             onClick={()=>setdeleteDialog(true)}
             className="text-red-500">
              Delete
            </button>
            {deleteDialog === true ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div className="bg-white p-6 rounded-lg shadow-lg"><span className="text-zinc-700">Deleting the category {category.categoryName} will delete all its subcategories, types, variants and products.</span><div className="mt-4 flex justify-end space-x-2"><button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>Delete</button><button className="px-4 py-2 bg-gray-300 rounded" onClick={()=>setdeleteDialog(false)}>Cancel</button></div></div></div> : null}
            <button onClick={() => setEditing(true)} className="text-blue-500">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
