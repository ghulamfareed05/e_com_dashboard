import * as Yup from 'yup';

export const SubategoryValidationSchema = Yup.object().shape({
    subcategoryName: Yup.string().required('Subcategory name is required'),
});