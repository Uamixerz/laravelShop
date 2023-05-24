import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ICategoryCreate, ICategoryCreateError } from './types';
import { useFormik } from 'formik';
import * as yup from "yup";
import classNames from 'classnames';
import { APP_ENV } from '../../../../env';
import http from '../../../../http';


const CategoryEditPage = () => {

   

   

    const [allParams, SetAllParams] = useSearchParams();

    useEffect(() => {
        console.log(allParams.get('id'));
        const result = http.get<ICategoryCreate>(`api/category/${allParams.get('id')}`).then(resp => {
            console.log("axios result", resp);
            formik.setValues(resp.data);
        }
        )
            .catch(bad => {
                console.log("bad request", bad)
            }
            );
    }, []);



    const initValues: ICategoryCreate = {
        name: '',
        image: null,
        description: ''
    }
    const navigate = useNavigate();


    const createSchema = yup.object({
        name: yup.string().required("Вкажіть назву"),
        description: yup.string().required("Вкажіть опис"),
        image: yup.mixed().required("Виберіть фото")
    });


    const onSubmitFormikData = (values: ICategoryCreate) => {
        console.log("Formik send ", values);
        http.post(`api/category/edit/${allParams.get('id')}`, values, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(resp => {
                console.log(values, resp);
                navigate("/");
            })
            .catch(bad => {
                console.log("Bad request", bad);
            })
    }

    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData
    });

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const file = e.target.files[0];
            formik.setFieldValue(e.target.name, file);
        }
    }

    return (
        <>
            

            <div>
                <h1 className='text-center'>Редагування категорії</h1>
                <form className="col-md-6 offset-md-3" onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="name">Назва категорії:</label>
                        <input
                            className={classNames("form-control", { "is-invalid": errors.name && touched.name })}
                            type="text"
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && touched.name && <div className="invalid-feedback">
                            {errors.name}
                        </div>}

                    </div>
                    <div className="mb-3">
                        <label htmlFor="image">Фотографія:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            className={classNames("form-control", { "is-invalid": errors.image && touched.image })}

                            onChange={onImageChangeHandler}
                            required
                        />
                        {errors.image && touched.image && <div className="invalid-feedback">
                            {errors.image}
                        </div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description">Опис категорії:</label>
                        <textarea
                            id="description"
                            name="description"
                            className={classNames("form-control", { "is-invalid": errors.description && touched.description })}
                            value={values.description}
                            onChange={handleChange}
                            required
                        />
                        {errors.description && touched.description && <div className="invalid-feedback">
                            {errors.description}
                        </div>}
                    </div>

                    <button className="btn btn-primary"  type="submit">Редагувати категорію</button>
                </form>
            </div>
        </>
    );
};

export default CategoryEditPage;