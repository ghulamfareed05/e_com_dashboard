import * as Yup from 'yup';

export const VariantValidationSchema = Yup.object().shape({
    variantName: Yup.string().required('Variant name is required'),
});