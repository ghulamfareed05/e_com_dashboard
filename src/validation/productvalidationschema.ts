
import * as Yup from 'yup';


export const ProductValidationSchema = Yup.object().shape({
    category: Yup.object().shape({
        id: Yup.number().required('Category is required'),
      }),
      subcategory: Yup.object().shape({
        id: Yup.number().required('Subcategory is required'),
      }),
      type: Yup.object().shape({
        id: Yup.number().nullable(),
      }),
      variant: Yup.object().shape({
        id: Yup.number().nullable(),
      }),
    tags: Yup.array().min(1, 'At least one tag is required'),
    file: Yup.mixed().required('File is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required'),
    productName: Yup.string().required('Name is required'),
    units: Yup.number().required('Units of product is required'),
    images: Yup.array().min(1, 'At least one image is required'),
});