import * as Yup from 'yup';

export const TypeValidationSchema = Yup.object().shape({
    typeName: Yup.string().required('Type name is required'),
});