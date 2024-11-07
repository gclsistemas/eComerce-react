import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserLogged } from '../../redux/slices/user-slice';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; //Poner los correspondientes a tailwind
import { message } from 'antd';
import { register } from "./services/index";

export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const formikMessages = {
        required: "Este campo es obligatorio",
        // name: "El formato introducido no es el correcto",
        email: "Debes introducir una dirección correcta",
        // phone: "Debes introducir un número correcto",
        password: "Debes introducir una contraseña",
        passwordConfirmation: 'Debe coincidir con el valor del campo "contraseña".'
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email(formikMessages.email).required(formikMessages.required),
            password: Yup.string().required(formikMessages.required),
            passwordConfirmation: Yup.string().required(formikMessages.required).oneOf([Yup.ref('password'), null], formikMessages.passwordConfirmation)
        }),
        onSubmit: async (values) => {
            const data = {
                userName: values.email,
                password: values.password
            };
            const response = await register(data);
            console.log(response);
            if (!response.data.success) {
                message.error(response.data.msg);
            } else {
                message.success('Usted ha sido registrado correctamente.');
                const user = response.data.result;
                dispatch(setUserLogged(user));
                navigate("/");
            }
        },
    });

    return (
        <div>
            <h1>Crear cuenta</h1>
            <div>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label>Correo electrónico</label>
                            <input type={"email"} id={"email"} name={"email"} autoComplete={"email"} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? (
                                <div className={"text-danger"}>{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div>
                            <div className="d-flex">
                                <label>Contraseña</label>
                                <input type={!showPassword ? "password" : "text"} id={"password"} name={"password"} autoComplete={"current-password"} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                                <span className="d-flex justify-content-around align-items-center cursor-pointer" onClick={() => setShowPassword((prevStat) => !prevStat)}>
                                    <span className="position-absolute me-5">
                                        {/* Poner los correspondientes a tailwind */}
                                        {/* {!showPassword ? <FaEye /> : <FaEyeSlash />} */}
                                    </span>
                                </span>
                            </div>

                            {formik.touched.password && formik.errors.password ? (
                                <div className={"text-danger"}>{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <div>
                            <button type={"submit"}>Registrarse</button>
                        </div>

                        <div>
                            <button type={"button"}>Registrarse con Google</button>
                        </div>

                        <div>
                            Ya tienes cuenta, <Link to="/login">Iniciar sesión</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};