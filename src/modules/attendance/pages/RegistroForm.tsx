import { useState, useRef } from "react";
import {
  Stepper,
  Button,
  TextInput,
  PasswordInput,
  Select,
  Group,
  Container,
  Title,
  Paper,
  Image,
  Checkbox,
   
  SimpleGrid,
  
  Radio,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Resolver, useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { ArrowRight, ArrowLeft, PaperPlaneTilt, Info } from "@phosphor-icons/react";
import { DatePickerInput } from "@mantine/dates"
import PhoneInputModule from "react-phone-input-2";
import dayjs from "dayjs"
import type { FormData } from "../../../types/registro";
import AvisoPrivacidad from "../../../components/AvisoPrivacidad";

const PhoneInput =
  (PhoneInputModule as any).default ?? PhoneInputModule;
  
const schema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("El correo es requerido"),
  password: yup.string().min(3, "Mínimo 6 caracteres").required("La contraseña es requerida"),
  nombre: yup.string().required("El nombre es requerido"),
  apellido: yup.string().required("El apellido es requerido"),
  edad: yup.string().required("La edad es requerida"),
  telefono: yup.number().required("El teléfono es requerido"),
  fechaNacimiento: yup.date().nullable().required("La fecha de nacimiento es requerida"),
  genero: yup.string().required("El género es requerido"),
  pais: yup.string().required("El país es requerido"),
 estado: yup.string().when("pais", {
  is: (value: string) => value === "México",
  then: (schema) => schema.required("El estado es requerido"),
  otherwise: (schema) => schema.notRequired(),
}),


curso: yup.string().required("El curso es obligatorio"),

  fotoPerfil: yup.mixed()
    .required("La foto es obligatoria")
    .test("fileSize", "El archivo es demasiado grande", 
      value => !value || ((value as File).size <= 2 * 1024 * 1024) // máx 2MB
    )
    .test("fileType", "Formato no soportado", 
      value => !value || (value && ["image/jpeg", "image/png"].includes((value as File).type))
    ),

  escolaridad: yup.string().required("La escolaridad es requerida"),

  privacidad: yup.boolean().oneOf([true], "Debes aceptar el aviso de privacidad"),
});

// Definir campos por paso
const stepFields: (keyof FormData)[][] = [
  ["email", "password"], // Paso 1
  ["nombre", "apellido", "telefono", "fechaNacimiento", "edad", "genero"], // Paso 2
  ["escolaridad", "especialidad"], // Paso 3
  ["pais", "estado", "municipio"], // Paso 4
  ["curso", "fotoPerfil"], // Paso 5
  ["privacidad"], // Paso 6
];




const RegistroForm = () => {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      await videoRef.current.play();
    }
    setStream(mediaStream);
  } catch (err) {
    console.error("No se pudo acceder a la cámara:", err);
  }
};

const stopCamera = () => {
  stream?.getTracks().forEach((track) => track.stop());
  setStream(null);
  if (videoRef.current) videoRef.current.srcObject = null;
};

const capturePhoto = () => {
  if (canvasRef.current && videoRef.current) {
    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 320, 240);

      // Convierte el canvas en Blob y luego en File
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const archivo = new File([blob], "captura.png", { type: "image/png" });
          setValue("fotoPerfil", archivo); // 🔑 guarda en formData
          stopCamera();
        }
      }, "image/png");
    }
  }
};










  const [active, setActive] = useState(0);
const [opened, setOpened] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as unknown as Resolver<FormData>,
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      telefono: "",
      fechaNacimiento: null,
      edad: 0,
      escolaridad: "",
      pais: "México",
      estado: "",
      municipio: "",
      curso: "",
      fotoPerfil: null,
      privacidad: false,
    },
  });
  
const fechaNacimiento = watch("fechaNacimiento");

const calcularEdad = (fecha: Date | null) => {
  if (!fecha) return 0;
  const hoy = dayjs();
  const nacimiento = dayjs(fecha);

  // Si la fecha es futura, regresamos 0
  if (nacimiento.isAfter(hoy)) {
    return 0;
  }

  let edad = hoy.year() - nacimiento.year();
  if (
    hoy.month() < nacimiento.month() ||
    (hoy.month() === nacimiento.month() && hoy.date() < nacimiento.date())
  ) {
    edad--;
  }
  return edad;
};

  const handleFechaChange = (value: string | null) => {
    const fecha = value ? dayjs(value).toDate() : null;
    setValue("fechaNacimiento", fecha);
    const edad = calcularEdad(fecha);
    setValue("edad", edad);
  };


  const formData = watch();

  let emailBorderColor: string | undefined;
  let emailDescription: string | undefined;

  if (errors.email) {
    emailBorderColor = "red";
    emailDescription = errors.email.message;
  } else if (touchedFields.email) {
    emailBorderColor = "green";
    emailDescription = "Correo válido ✔";
  }

  // ✅ Avanzar solo si el paso actual valida correctamente
  const nextStep = async () => {
    const fields = stepFields[active];
    const valid = await trigger(fields);
    if (valid) setActive((current) => (current < 5 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


  const onSubmit = async (data: FormData) => {
    try {
      // ✅ Guardar en la base de datos
      await axios.post("/api/registro", data);

      showNotification({
        title: "Registro exitoso",
        message: "Se guardó en la base de datos y se generó el acuse.",
        color: "green",
      });

      
    } catch (err) {
      console.error("Error al guardar el registro o generar el acuse:", err);
      showNotification({
        title: "Error",
        message: "No se pudo guardar el registro.",
        color: "red",
      });
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Container size="xl">
        <Paper shadow="xl" radius="md" p="xl" style={{ backgroundColor: "white" }}>
          {/* Logo institucional */}
          <Image
            src="https://scontent.fmex3-2.fna.fbcdn.net/v/t39.30808-6/626182018_1328566789314106_164162234257722441_n.jpg?stp=dst-jpg_tt6&cstp=mx1000x522&ctp=s1000x522&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4KUVS1cLOJYQ7kNvwEulb9C&_nc_oc=AdqCljnraB5Fgy_BbxG0n53i5hX4__29tfoJtulyqYJGB7vCu8vrXqnF0-USIRhNuFuWJu07uKNvXnnYA730JeUl&_nc_zt=23&_nc_ht=scontent.fmex3-2.fna&_nc_gid=RQubIH3CLukL-4t_2gtB5Q&_nc_ss=7b289&oh=00_AQG7EjW8c0Su6cT3wYTtcR5BCUo_WWvyocbeM9pZcJJSYQ&oe=6A930C23"
            alt="Logo institucional"
            fit="contain"
            height={100}
            mx="auto"
            mb="md"
          />

          <Title order={2} ta="center" mb="lg" c="gray">
            Registro de Curso
          </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
    

<Stepper
  active={active}
  onStepClick={setActive}
 
>

        {/* Paso 1: Cuenta */}
        <Stepper.Step label="Cuenta" description="Usuario y contraseña">
          <TextInput
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            {...register("email")}
            error={errors.email?.message}
            withAsterisk
            styles={{
              input: { borderColor: emailBorderColor },
              description: { color: errors.email ? "red" : "green" },
            }}
            description={emailDescription}
          />
          <PasswordInput
            label="Contraseña"
            placeholder="********"
            {...register("password")}
            error={errors.password?.message}
            withAsterisk
          />
        </Stepper.Step>

     {/* Paso 2: Datos personales */}
<Stepper.Step
  label="Datos personales"
  description="Información básica"
>
<SimpleGrid
  cols={12}
  spacing="md"
>
  {/* Nombre - 2 columnas */}
  <div style={{ gridColumn: "span 2" }}>
    <TextInput
      label="Nombre"
      withAsterisk
      {...register("nombre")}
      error={errors.nombre?.message}
    />
  </div>

  {/* Apellidos - 3 columnas */}
  <div style={{ gridColumn: "span 4" }}>
    <TextInput
      label="Apellidos"
      withAsterisk
      {...register("apellido")}
      error={errors.apellido?.message}
    />
  </div>
{/* Fecha nacimiento - 2 columnas */}
  <div style={{ gridColumn: "span 2" }}>
    <DatePickerInput
      label="Fecha de nacimiento"
      placeholder="Selecciona tu fecha"
      value={fechaNacimiento}
      onChange={handleFechaChange}
      withAsterisk
      error={errors.fechaNacimiento?.message}
      maxDate={new Date()}
    />
  </div>

  {/* Edad - 1 columna */}
  <div style={{ gridColumn: "span 2" }}>
    <TextInput
      label="Edad"
      {...register("edad")}
      error={errors.edad?.message}
      value={
        fechaNacimiento
          ? calcularEdad(fechaNacimiento)
          : ""
      }
      readOnly
    />
  </div>

  {/* Género - 2 columnas */}
  <div style={{ gridColumn: "span 2" }}>
    <Select
      label="Género"
      withAsterisk
      error={errors.genero?.message}
      data={[
        "Masculino",
        "Femenino",
        "Otro",
      ]}
      value={formData.genero}
      onChange={(value) =>
        setValue("genero", value || "Otro")
      }
    />
  </div>
  {/* Teléfono - 12 columnas */}
  <div style={{ gridColumn: "span 12" }}>
    <Controller
      name="telefono"
      control={control}
      rules={{
        required: "El teléfono es obligatorio",
        validate: (value) => {
          const telefono = String(value ?? "");

          if (telefono.length !== 10) {
            return "El teléfono debe tener 10 dígitos";
          }

          return true;
        },
      }}
      render={({ field }) => {
        const telefonoValidationMessage =
          errors.telefono?.message ??
          (touchedFields.telefono
            ? "Teléfono válido"
            : null);

        let telefonoBorderColor = "#ced4da";
        if (errors.telefono) {
          telefonoBorderColor = "red";
        } else if (touchedFields.telefono) {
          telefonoBorderColor = "green";
        }

        const handleTelefonoChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const soloNumeros =
            e.target.value.replace(/\D/g, "");

          field.onChange(
            soloNumeros.slice(0, 10)
          );
        };

        return (
          <div>
            <label
              htmlFor="telefono"
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Teléfono{" "}
              <span style={{ color: "red" }}>*</span>
            </label>

            <div
              style={{
                display: "flex",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "0 10px",
                  border: `1px solid ${telefonoBorderColor}`,
                  borderRight: "none",
                  borderRadius: "8px 0 0 8px",
                  backgroundColor: "#f8f9fa",
                  whiteSpace: "nowrap",
                }}
              >
                <span>🇲🇽</span>
                <span>+52</span>
              </div>

              <input
                id="telefono"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10 dígitos"
                value={
                  field.value
                    ? String(field.value)
                    : ""
                }
                onChange={handleTelefonoChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                maxLength={10}
                style={{
                  flex: 1,
                  minWidth: 0,
                  borderRadius: "0 8px 8px 0",
                  padding: "10px",
                  border: `1px solid ${telefonoBorderColor}`,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {telefonoValidationMessage && (
              <small
                style={{
                  color: errors.telefono
                    ? "red"
                    : "green",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {telefonoValidationMessage}
              </small>
            )}
          </div>
        );
      }}
    />
  </div>

  
</SimpleGrid>

</Stepper.Step>

      {/* Paso 3: Escolaridad */}
<Stepper.Step label="Escolaridad" description="Último Grado de Estudios">
  <div style={{ gridColumn: "span 12" }}>
    <Controller
      name="escolaridad"
      control={control}
      render={({ field }) => (
        <Radio.Group
          label="Escolaridad"
          withAsterisk
          {...field}
          error={errors.escolaridad?.message}
        >
          <SimpleGrid cols={{ base: 1, sm: 3 }} mt="xs">
            <Radio value="Post Doctorado" label="Post Doctorado" />
            <Radio value="Maestría" label="Maestría" />
            <Radio value="Posgrado" label="Posgrado" />
            <Radio value="Carrera Técnica" label="Carrera Técnica" />
            <Radio value="Preparatoria" label="Preparatoria" />
            <Radio value="Doctorado" label="Doctorado" />
            <Radio value="Primaria" label="Primaria" />
            <Radio value="Licenciatura" label="Licenciatura" />
            <Radio value="Secundaria" label="Secundaria" />
          </SimpleGrid>
        </Radio.Group>
      )}
    />
  </div>
</Stepper.Step>


        {/* Paso 4: Dirección */}
        <Stepper.Step label="Entidad Federativa" description="Extranjeros y Nacionales">
          <Select
            label="País"
            data={["México", "Estados Unidos", "Canadá", "Otro"]}
            value={formData.pais}
            onChange={(value) => setValue("pais", value || "México")}
          />
          {formData.pais === "México" && (
            <>
              <Select
  label="Estado"
  placeholder="Selecciona tu estado"
  withAsterisk
  searchable
  clearable
  value={formData.estado}
  onChange={(value) =>
    setValue("estado", value || "")
  }
  error={errors.estado?.message}
  data={[
    { value: "aguascalientes", label: "Aguascalientes" },
    { value: "baja_california", label: "Baja California" },
    { value: "baja_california_sur", label: "Baja California Sur" },
    { value: "campeche", label: "Campeche" },
    { value: "chiapas", label: "Chiapas" },
    { value: "chihuahua", label: "Chihuahua" },
    { value: "ciudad_de_mexico", label: "Ciudad de México" },
    { value: "coahuila", label: "Coahuila" },
    { value: "colima", label: "Colima" },
    { value: "durango", label: "Durango" },
    { value: "estado_de_mexico", label: "Estado de México" },
    { value: "guanajuato", label: "Guanajuato" },
    { value: "guerrero", label: "Guerrero" },
    { value: "hidalgo", label: "Hidalgo" },
    { value: "jalisco", label: "Jalisco" },
    { value: "michoacan", label: "Michoacán" },
    { value: "morelos", label: "Morelos" },
    { value: "nayarit", label: "Nayarit" },
    { value: "nuevo_leon", label: "Nuevo León" },
    { value: "oaxaca", label: "Oaxaca" },
    { value: "puebla", label: "Puebla" },
    { value: "queretaro", label: "Querétaro" },
    { value: "quintana_roo", label: "Quintana Roo" },
    { value: "san_luis_potosi", label: "San Luis Potosí" },
    { value: "sinaloa", label: "Sinaloa" },
    { value: "sonora", label: "Sonora" },
    { value: "tabasco", label: "Tabasco" },
    { value: "tamaulipas", label: "Tamaulipas" },
    { value: "tlaxcala", label: "Tlaxcala" },
    { value: "veracruz", label: "Veracruz" },
    { value: "yucatan", label: "Yucatán" },
    { value: "zacatecas", label: "Zacatecas" },
  ]}
/>
              <TextInput label="Municipio" {...register("municipio")} error={errors.municipio?.message} />
            </>
          )}
        </Stepper.Step>


 <Stepper.Step label="Curso y foto" description="Selección y perfil">
  <SimpleGrid cols={2} spacing="lg">
    {/* Columna 1: Curso + Foto capturada */}
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Select
        label="Curso disponible"
        withAsterisk
        data={["Curso de IA Médica", "Curso A", "Curso B", "Curso C"]}
        value={formData.curso || "Curso de IA Médica"}
        onChange={(value) => setValue("curso", value || "Curso de IA Médica")}
        error={errors.curso?.message}
      />

      {/* Vista previa de la foto capturada */}
      {formData.fotoPerfil && (
        <img
          src={URL.createObjectURL(formData.fotoPerfil)}
          alt="Foto capturada"
          style={{
            marginTop: "10px",
            
            width: "180px",
            height: "180px",
            objectFit: "cover",
            border: "2px solid #ced4da",
          }}
        />
      )}
    </div>

    {/* Columna 2: Cámara + Botones */}
    <div style={{ display: "flex", gap: "16px" }}>
      <div style={{ position: "relative", width: "320px", height: "240px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />

        {/* Overlay circular */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            border: "3px dashed rgba(255,255,255,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "32px",
          }}
        >
          🙂
        </div>
      </div>

      {/* Botones en columna */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Button variant="light" color="blue" onClick={startCamera}>
          Activar cámara
        </Button>
        <Button variant="light" color="green" onClick={capturePhoto}>
          Capturar foto
        </Button>
        
      </div>
    </div>
  </SimpleGrid>
</Stepper.Step>








        {/* Paso 6: Confirmación */}
        <Stepper.Completed>
          <Title order={3}>Confirmación</Title>
          <p>Revisa tus datos y confirma tu registro.</p>
          <Checkbox
            label="Acepto el aviso de privacidad"
            {...register("privacidad")}
            error={errors.privacidad?.message}
          />
          <Button type="submit" color="blue" variant="light" leftSection={<PaperPlaneTilt size={20} />}>
            Enviar registro
          </Button>
        </Stepper.Completed>
      </Stepper>

      <Group justify="space-between" mt="xl">
        <Button variant="light" onClick={prevStep} disabled={active === 0} leftSection={<ArrowLeft size={20} />}>
          Atrás
        </Button>
  <Button
  variant="subtle"
  size="xs"
  color="gray"
  leftSection={<Info size={16} />}
  onClick={() => setOpened(true)}
>
  Aviso de privacidad
</Button>
        {active < 5 && (
          <Button variant="light" onClick={nextStep} rightSection={<ArrowRight size={20} />}>
            Siguiente
          </Button>
        )}
      </Group>
    </form>
        </Paper>
      </Container>

<AvisoPrivacidad
  opened={opened}
  onClose={() => setOpened(false)}
/>


    </div>
  );
};

export default RegistroForm;
