import { useNavigate } from "react-router-dom";
import { ILogin, ILoginResult } from "./types";
import * as yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import http from "../../../http";
import { useState } from "react";
import { AuthUserActionType, IUser } from "../types";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";


const LoginPage = () => {
    const navigator = useNavigate();
    const dispatch = useDispatch();
    const initValues: ILogin = {
        email: "",
        password: "",
    };
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const createSchema = yup.object({
        email: yup
            .string()
            .required("Вкажіть email")
            .email("Пошта вказана не вірно"),
        password: yup.string().required("Вкажіть пароль"),
    });

    const onSubmitFormikData = async (values: ILogin) => {
        setLoading(true);
        try {
            const result = await http.post<ILoginResult>("api/auth/login", values);

            const { access_token } = result.data;
            const user = jwtDecode(access_token) as IUser;
            console.log("Auth saccess", user);
            localStorage.token = access_token;
            http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
            setMessage("");
            dispatch({
                type: AuthUserActionType.LOGIN_USER, payload: {
                    email: user.email,
                    name: user.name,
                    image: user.image
                } as IUser
            });
            setLoading(false);
            navigator("/");
        }
        catch (error) {
            setMessage("Не вірно вказані данні");
            setLoading(false);
            console.log("error: " + error);
        }
    };
    const formik = useFormik({
        initialValues: initValues,
        validationSchema: createSchema,
        onSubmit: onSubmitFormikData,
    });

    const { values, errors, touched, handleSubmit, handleChange } = formik;

    return (
        <>
            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <h1 className='text-center'>Login</h1>

                <form className="col-md-6 offset-md-3" onSubmit={handleSubmit} noValidate>
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
                            type="password"
                            className={classNames("form-control", { "is-invalid": errors.password && touched.password })}
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
                        <label htmlFor="password">Password</label>
                    </div>


                    <button type="submit" className="btn btn-primary btn-block mb-4 w-100">
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <></>}
                        &nbsp;
                        Sign in
                        &nbsp;
                    </button>

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