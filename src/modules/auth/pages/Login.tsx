import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Paper,
  Title,
  Image,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      console.log("Login exitoso:", data);
      navigate("/dashboard"); // 👈 redirige al dashboard
    } catch (err) {
      console.error("❌ Error en login:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <Paper shadow="xl" radius="md" p="xl" style={{ width: 400, backgroundColor: "white" }}>
        <Stack gap="md">
          <Image
            src="https://via.placeholder.com/120x60?text=LOGO"
            alt="Logo institucional"
            fit="contain"
            height={60}
            mx="auto"
          />

          <Title order={2} ta="center" c="blue">
            Iniciar sesión
          </Title>

          <TextInput
            label="Correo electrónico"
            placeholder="tuemail@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />

          <PasswordInput
            label="Contraseña"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />

          <Button onClick={handleSubmit} fullWidth color="blue">
            Ingresar
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate("/registro")}
          >
            Registrarse en un curso
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
