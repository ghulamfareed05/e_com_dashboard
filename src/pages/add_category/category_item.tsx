import { CategoryInterface } from "../../intefaces/categora";
import { AdminServices } from "../../services/admin";
import React, { useEffect, useState } from "react";
import Subcategory from "../add_subcategory/subcategory_item";
import axios from "axios";

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

  const handleDelete = async () => {
    try {
      // await AdminServices.deleteCategory(category.id ?? "");
      const response =await axios.delete(`http://localhost:3000/categories/admin/delete/${category.id}`)
      refreshCategories(); // Refresh categories after deletion
      // Perform any additional actions after deletion if needed
      console.log(response);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async () => {
    try {
      // Perform edit action, for example:
      const updatedCategory = { ...category, categoryName: editedName };
      // await AdminServices.updateCategory(updatedCategory);
      const response=await axios.patch(`http://localhost:3000/categories/admin/update/${category.id}`,updatedCategory)
      // Perform any additional actions after editing if needed
      setEditing(false);
      refreshCategories(); // Exit edit mode
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
          <>
          <button onClick={()=>setOpen(true)}>Add Subcategory</button>
          {open==true? <Subcategory category={category} onClick={()=>setOpen(false)}/>:null}
            <button onClick={handleDelete} className="text-red-500 mr-2">
              Delete
            </button>
            <button onClick={() => setEditing(true)} className="text-blue-500">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
