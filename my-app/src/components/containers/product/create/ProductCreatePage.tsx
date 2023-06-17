import { useFormik } from "formik";
import { ICategorySelect, IProductCreate } from "./types";
import * as yup from "yup";
import classNames from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import http from "../../../../http";
import { ICategoryCreate } from "../../category/create/types";
import { APP_ENV } from "../../../../env";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const ProductCreatePage = () => {

    const navigate = useNavigate();
    const initValues: IProductCreate = {
        name: '',
        images: [],
        price: 0,
        category_id: 0,
        description: ''
    }
    const [categories, setCategories] = useState<ICategorySelect[]>([]);

    useEffect(() => {
        http
            .get<ICategorySelect[]>("api/category/select")
            .then((resp) => setCategories(resp.data));
    }, []);

    const createSchema = yup.object({
        name: yup.string().required("Вкажіть назву"),
        description: yup.string().required("Вкажіть опис"),
        images: yup.array().min(1, 'Додайте хоча б одне фото'),
        price: yup.number().min(0.00001, "Ціна має бути більшою за 0"),
        category_id: yup.number().min(0.00001, "Вкажіть категорію"),
    });

    const onSubmitFormikData = (values: IProductCreate) => {
        console.log("Formik send ", values);
        http.post('api/products', values, {
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

    const onImageSelect = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.addEventListener("change", (e: any) => {
            const files = e.target.files;
            if (files) {
                const file = files[0];
                setFieldValue("images", [...values.images, file]);
            }
        });
        input.click();

    }

    const removeImage = (index: number) => {
        const newArray = [...values.images]; // Створюємо копію масиву
        newArray.splice(index, 1); // Видаляємо елемент за індексом
        setFieldValue("images",[...newArray]); // Оновлюємо стан масиву
      };


    const { values, errors, touched, handleSubmit, handleChange, setFieldValue } = formik;
    return (
        <>
            <h1 className='text-center'>Добавлення товару</h1>
            <form className="col-md-6 offset-md-3" onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label htmlFor="category_id">Категорія товару:</label>
                    <select
                        className={classNames("form-select", {
                            "is-invalid": errors.category_id && touched.category_id,
                        })}
                        defaultValue={values.category_id}
                        onChange={handleChange}
                        name="category_id"
                        id="category_id"
                    >
                        <option value={0} disabled>
                            Оберіть категорію
                        </option>
                        {categories.map((item) => (
                            <option value={item.id} key={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    {errors.category_id && touched.category_id && (
                        <div className="invalid-feedback">{errors.category_id}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="name">Назва товару:</label>
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
                    <label htmlFor="price">Ціна:</label>
                    <input
                        className={classNames("form-control", { "is-invalid": errors.price && touched.price })}
                        type="number"
                        id="price"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        required
                    />
                    {errors.price && touched.price && <div className="invalid-feedback">
                        {errors.price}
                    </div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="description">Опис товару:</label>
                    <Editor
                        id="description"
                        value={values.description}
                        onEditorChange={(content) => {
                            formik.setFieldValue('description', content);
                        }}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: ['code'],
                            toolbar: 'undo redo | bold italic underline | code',
                        }}
                    />
                    {errors.description && touched.description && <div className="invalid-feedback">
                        {errors.description}
                    </div>}
                </div>
                <div className="mb-3">
                    <div className="row">
                        <div className="col-md-3">
                            <img
                                className="img-fluid"
                                src={APP_ENV.BASE_URL + "default_image.png"}
                                onClick={onImageSelect}
                                alt="Оберіть фото"
                                style={{ cursor: "pointer" }}

                            />
                        </div>
                        {errors.images && touched.images &&
                            <div className="invalid-feedback">
                                {errors.price}
                            </div>}
                        {values.images.map((img, index) => (
                            <div className="col-md-3" key={index}>
                                <button type="button" className="btn-close" onClick={()=>removeImage(index)} aria-label="Close"></button>
                                <img
                                    className="img-fluid"
                                    src={URL.createObjectURL(img)}
                                    onClick={onImageSelect}
                                    alt="Оберіть фото"
                                    style={{ cursor: "pointer" }}

                                />
                            </div>
                        ))}

                    </div>
                </div>

                <button className="btn btn-primary" type="submit">Додати товар</button>
            </form>
        </>
    );
};
export default ProductCreatePage;