import * as yup from "yup";

export const registroSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo inválido")
    .required("El correo es requerido"),

  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es requerida"),

  nombre: yup
    .string()
    .required("El nombre es requerido"),

  apellido: yup
    .string()
    .required("El apellido es requerido"),

  edad: yup
    .string()
    .required("La edad es requerida"),

  telefono: yup
    .number()
    .required("El teléfono es requerido"),

  fechaNacimiento: yup
    .date()
    .nullable()
    .required("La fecha de nacimiento es requerida"),

  genero: yup
    .string()
    .required("El género es requerido"),

  pais: yup
    .string()
    .required("El país es requerido"),

  estado: yup.string().when("pais", {
    is: (value: string) => value === "México",
    then: (schema) =>
      schema.required("El estado es requerido"),
    otherwise: (schema) =>
      schema.notRequired(),
  }),

  curso: yup
    .string()
    .required("El curso es obligatorio"),

  fotoPerfil: yup
    .mixed()
    .required("La foto es obligatoria")
    .test(
      "fileSize",
      "El archivo es demasiado grande",
      (value) =>
        !value ||
        ((value as File).size <= 2 * 1024 * 1024)
    )
    .test(
      "fileType",
      "Formato no soportado",
      (value) =>
        !value ||
        ["image/jpeg", "image/png"].includes(
          (value as File).type
        )
    ),

  escolaridad: yup
    .string()
    .required("La escolaridad es requerida"),

  privacidad: yup
    .boolean()
    .oneOf(
      [true],
      "Debes aceptar el aviso de privacidad"
    ),
});