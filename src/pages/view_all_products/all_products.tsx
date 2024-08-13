import { useState, useEffect } from "react";
import { ProductInterface } from "../../intefaces/product";
import { AdminServices } from "../../services/admin";

const ProductPage = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [editedName, seteditedName] = useState("");
  const [editedDescription, seteditedDescription] = useState("");
  const [editedPrice, seteditedPrice] = useState<number | null>(null);
  const [editedUnits, seteditedUnits] = useState<number | null>(null);
  const [productTobeEdited, setproductTobeEdited] = useState<number | null>(null);
  const [productTobeDeleted, setproductTobeDeleted] = useState<number | null>(null);
  const [productToBeSearch, setproductToBeSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await AdminServices.getAllProducts(); 
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit =async (product:ProductInterface) => {
   try {
    const response =await AdminServices.updateProduct(product);
    console.log(response);
    
    //  alert(response);
    fetchProducts();
   } catch (error) {
    alert(error)
   }
  };

  const handleDelete = async (productId: number) => {
    try {
      const response =await AdminServices.deleteProduct(productId);
      console.log(response);
      
      fetchProducts(); 
    } catch (error) {
      alert(error);
    }
  };

  const searchProduct=async()=>{
    try {
      if(productToBeSearch!==""){
      const response=await AdminServices.getProductByName(productToBeSearch);
      setProducts(response.data);
      }
    } catch (error) {
      
    }
  }

  return (
    <div className="p-4 sm:ml-64 text-zinc-900">
      <h1 className="text-5xl font-extrabold text-center mt-10 tracking-wider">All Products</h1>
      <div className="flex justify-end fixed right-2 top-16">
        <input type="search" placeholder="Search Product..." onChange={(e)=>setproductToBeSearch(e.target.value)} className="rounded-s-full p-2 pl-4 focus:outline-none bg-slate-300 text-slate-600"/>
        <button onClick={searchProduct} className="bg-slate-300 text-white p-2 rounded-e-full border-l border-l-slate-600 ">🔍</button>
      </div>
      {products.length==0? <div className="flex justify-start items-center text-white m-2"><h1>No Products Found </h1><button onClick={fetchProducts} className="text-3xl">🔃</button></div>:null}
      {products.length>0 && products.map((product,index) => (
        <div key={product.id} className="p-5">
          {productTobeEdited !== product.id ? (
            <>
              <h1 className={`text-md font-bold bg-white rounded-full h-8 w-8 flex items-center justify-center`}>{index+1}</h1>
              <h2 className="font-bold text-xl tracking-wide">{product.productName}</h2>
              <p><strong>Price: $</strong>{product.price}</p>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Units:</strong> {product.units}</p>
            </>
          ) : (
            <>
              <h2 className="m-1">
                <input
                  className="rounded py-1 px-3 border-zinc-800 border bg-zinc-800 text-white"
                  type="text"
                  value={editedName}
                  onChange={(e)=>seteditedName(e.target.value)}
                />
              </h2>
              <p className="m-1">
                <label className='font-bold'>Price: $</label>
                <input
                  className="rounded p-1 border-zinc-800 border bg-zinc-800 text-white"
                  type="number"
                  value={Number(editedPrice)}
                  onChange={(e)=>seteditedPrice(Number(e.target.value))}
                />
              </p>
              <p className="m-1 flex">
                <label className='font-bold'>Description: </label>
                <textarea
                  className="rounded p-1 border-zinc-800 border bg-zinc-800 text-white"
                  
                  value={editedDescription}
                  onChange={(e)=>seteditedDescription(e.target.value)}
                />
              </p>
              <p className="m-1">
                <label className='font-bold'>Units: </label>
                <input
                  className="rounded p-1 border-zinc-800 border bg-zinc-800 text-white"
                  type="number"
                  value={Number(editedUnits)}
                  onChange={(e)=>seteditedUnits(Number(e.target.value))}
                />
              </p>
            </>
          )}
          <p><strong>Tags:</strong> {product.tags.join(", ")}</p>
          <div>
            <strong>Images:</strong>
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                style={{ width: "100px", height: "auto", marginRight: "5px" }}
              />
            ))}
          </div>
          {productTobeEdited !== product.id ? (
            <div className="flex w-max gap-3 my-2">
              <button
                onClick={() => {
                  // handleEdit(String(product.id));
                  seteditedName(product.productName);
                  seteditedPrice(Number(product.price));
                  seteditedDescription(product.description);
                  seteditedUnits(product.units);
                  setproductTobeEdited(Number(product.id));
                }}
                className="text-blue-500 text-lg"
              >
                Edit
              </button>
              <button
                onClick={() => setproductTobeDeleted(Number(product.id))}
                className="text-red-500 text-lg"
              >
                Delete
              </button>
              {productTobeDeleted === product.id ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><div className="bg-transparent p-6 rounded-lg shadow-lg"><span className="text-white">Are you sure you want to delete the product {product.productName}?</span><div className="mt-4 flex justify-center space-x-2"><button className="px-4 py-2 bg-red-500 text-white rounded" onClick={()=>{handleDelete(Number(product.id)); setproductTobeDeleted(null);}}>Delete</button><button className="px-4 py-2 bg-gray-300 rounded" onClick={()=>setproductTobeDeleted(null)}>Cancel</button></div></div></div> : null}
            </div>
          ) : (
            <div className="flex w-max gap-3">
              <button
                onClick={() => {
                  if (Number(editedPrice)<=0) {
                    alert('Price must be positive integer');
                  }else if(Number(editedUnits)<=0){
                    alert('Units must be positive integer');
                  }
                  else if(editedName.length<=0){
                    alert('Product name cannot be empty');
                  }
                  else if(editedDescription.length<=0){
                    alert('Description cannot be empty');
                  }
                   else {
                    product.productName=editedName;
                    product.price=Number(editedPrice);
                    product.description=editedDescription;
                    product.units=Number(editedUnits);
                    handleEdit(product);
                    setproductTobeEdited(null);
                  }
                  
                }}
                className="text-blue-500"
              >
                Save
              </button>
              <button
                onClick={() => setproductTobeEdited(null)}
                className="text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
