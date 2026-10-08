import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    setErrorBackendMessage(''); 
    try {
      await createProduct(formData);
      navigate('/admin/products');
    } catch (error) {
      const serverError = error.response?.data;

      if (typeof serverError === 'object' && serverError !== null) {
          Object.keys(serverError).forEach((fieldName) => {
             setError(fieldName, { type: 'manual', message: serverError[fieldName] });
          });
          return;
      }

      if (typeof serverError === 'string') {
          const jsonStartIndex = serverError.indexOf('{');
          
          if (jsonStartIndex !== -1) {
              try {
                  const jsonString = serverError.substring(jsonStartIndex);
                  const fieldErrors = JSON.parse(jsonString);
                  
                  Object.keys(fieldErrors).forEach((fieldName) => {
                      setError(fieldName, { type: 'manual', message: fieldErrors[fieldName] });
                  });
                  return; 
              } catch (e) {
                  console.error("Error parseando JSON", e);
              }
          }
      }

      if (serverError) {
         setErrorBackendMessage(typeof serverError === 'string' ? serverError : 'Error al crear producto');
      } else {
         setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <Card>
      <form
        className='flex flex-col gap-20 p-8 sm:gap-4'
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          error={errors.sku?.message} 
          {...register('sku', { required: 'SKU es requerido' })}
        />
        <Input
          label='Código Único'
          error={errors.cui?.message} 
          {...register('cui', { required: 'Código Único es requerido' })}
        />
        <Input
          label='Nombre'
          error={errors.name?.message} 
          {...register('name', { required: 'Nombre es requerido' })}
        />
        
        <Input
          label='Descripción'
          {...register('description')}
        />
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          {...register('price', {
            min: { value: 0, message: 'No puede tener un precio negativo' },
          })}
        />
        <Input
          label='Stock'
          error={errors.stock?.message}
          {...register('stock', {
            min: { value: 0, message: 'No puede tener un stock negativo' },
          })}
        />

        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>
        
        {errorBackendMessage && <span className='text-red-500 text-sm mt-2 block text-center sm:text-right'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
};

export default CreateProductForm;
