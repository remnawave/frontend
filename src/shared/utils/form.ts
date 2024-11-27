import { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function handleFormErrors(form: UseFormReturnType<any>, errors: unknown) {
  if (!errors || typeof errors !== 'object') {
    return;
  }

  if ('formErrors' in errors && Array.isArray(errors.formErrors)) {
    errors.formErrors.forEach((error) => {
      notifications.show({ message: error, color: 'red' });
    });
  }

  if ('fieldErrors' in errors && typeof errors.fieldErrors === 'object' && errors.fieldErrors) {
    Object.entries(errors.fieldErrors).forEach(([fieldName, fieldErrors]) => {
      form.setFieldError(fieldName, fieldErrors.join(','));
    });
  }
}
