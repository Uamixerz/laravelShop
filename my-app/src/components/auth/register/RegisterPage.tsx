import { useNavigate } from "react-router-dom";
import { IRegister } from "./types";
import * as yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import { ChangeEvent, useState } from "react";
import http from "../../../http";

const LoginPage = () => {
    const navigator = useNavigate();

    const initValues: IRegister = {
        email: "",
        phone: "",
        password: "",
        name: "",
        confirmPassword: "",
        lastName: "",
        image: null
    };
    const [loading, setLoading] = useState<boolean>(false);

    const [message, setMessage] = useState<string>("");

    const createSchema = yup.object({
        email: yup
            .string()
            .required("Вкажіть email")
            .email("Пошта вказана не вірно"),
        password: yup.string().required("Вкажіть пароль"),
        name: yup.string().required("Вкажіть ім'я"),
        lastName: yup.string().required("Вкажіть прізвище"),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password'), ""], 'Вкажіть пароль'),
        image: yup.mixed().required("Виберіть фото"),
        phone: yup.string().required("Вкажіть номер телефону"),
    });

    const onSubmitFormikData = async (values: IRegister) => {
        setLoading(true);
        try {
            const result = await http.post("api/auth/register", values, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Auth saccess", result);
            setLoading(false);
            setMessage("");
            navigator("/");
        }
        catch (error) {
            setLoading(false);
            setMessage("Не вірно вказані данні");
            console.log("error: " + error);
        }
    };
    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData,
    });
    const onImageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const file = e.target.files[0];
            formik.setFieldValue(e.target.name, file);
        }
    }

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    return (
        <>
            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <h1 className='text-center'>Register</h1>

                <form className="col-md-6 offset-md-3" onSubmit={handleSubmit} noValidate>
                    <div className="form-floating mb-4">
                        <input
                            type="text"
                            className={classNames("form-control", { "is-invalid": errors.name && touched.name })}
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                        />
                        {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                        <label htmlFor="name">Ім'я</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="text"
                            className={classNames("form-control", { "is-invalid": errors.lastName && touched.lastName })}
                            id="lastName"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && touched.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        <label htmlFor="lastName">Прізвище</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="email"
                            className={classNames("form-control", { "is-invalid": errors.email && touched.email })}
                            id="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                        />
                        {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="tel"
                            className={classNames("form-control", { "is-invalid": errors.phone && touched.phone })}
                            id="phone"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            placeholder="name@example.com"
                        />
                        {errors.phone && touched.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        <label htmlFor="phone">Номер телефону</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="file"
                            id="image"
                            name="image"
                            className={classNames("form-control", { "is-invalid": errors.image && touched.image })}
                            onChange={onImageChangeHandler}
                            required
                        />
                        {errors.image && touched.image && <div className="invalid-feedback">{errors.image}</div>}
                        <label htmlFor="image">Зображення</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className={classNames("form-control", { "is-invalid": errors.password && touched.password })}
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                        <label htmlFor="password">Пароль</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className={classNames("form-control", { "is-invalid": errors.confirmPassword && touched.confirmPassword })}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        {errors.confirmPassword && touched.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        <label htmlFor="confirmPassword">Підтвердження паролю</label>
                    </div>


                    <button type="submit" className="btn btn-primary btn-block mb-4 w-100">
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <></>}
                        &nbsp;
                        Sign in</button>
                    {message && <div className="alert alert-danger text-center" role="alert">
                        {message}
                    </div>}

                    <div className="text-center">
                        <p>Not a member? <a href="#!">Register</a></p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginPage;