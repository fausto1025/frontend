import {
  Container,
  Grid,
  Paper,
  Title,
  Button,
  Text,
  Progress,
  Stack,
  Group,
  Card,
  MantineProvider,
  Timeline,
  Modal
} from "@mantine/core";
import {
  User,
  SignOut,
  BookOpen,
  YoutubeLogo,
  Images,
  Clock,
  Lock,
  Buildings,
  Megaphone,
  Coffee,
  Presentation,
  ListChecks,
} from "@phosphor-icons/react";
import { useState } from "react";

export default function Dashboard() {
  const [opened, setOpened] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <MantineProvider
      theme={{
        colors: {
          hospitalBlue: [
            "#f0f8ff",
            "#d6eaff",
            "#b3d9ff",
            "#80c1ff",
            "#4da9ff",
            "#1a91ff",
            "#0066cc",
            "#004c99",
            "#003366",
            "#001a33",
          ],
        },
        primaryColor: "hospitalBlue",
        defaultRadius: "md",
      }}
      defaultColorScheme="light"
    >
      <Container fluid style={{ padding: "0", backgroundColor: "#EFF0F0" }}>
        {/* Header institucional fijo arriba */}
        <Paper
          shadow="md"
          p="md"
          radius="0"
          style={{
            backgroundColor: "#040948",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Group>
            <Buildings size={28} />
            <Title order={3}>Hospital General de México</Title>
          </Group>
          <Group>
            <User size={24} />
            <Text>USUARIO: DFSSA006265</Text>
            <Button
              leftSection={<SignOut size={20} />}
              color="red"
              variant="light"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Group>
        </Paper>

        {/* Card grande pegado al nav */}
        <Card shadow="lg" radius="md" p="xl" withBorder style={{ marginTop: 0 }}>
          <Grid style={{ gap: "var(--mantine-spacing-md)" }}>
            {/* Columna izquierda */}
            
            <Grid.Col span={4}>
             
             <Paper
  shadow="sm"
  p="md"
  radius="md"
  withBorder
  style={{
    marginBottom: 16,
    padding: 16,
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
  <Group>
    <User size={24} color="#004c99" />
    <Title order={4}>Datos del Usuario</Title>
  </Group>
  <Text>Juan Pérez</Text>
  <Text>juan@example.com</Text>
</Paper>


               <Paper
  shadow="sm"
  p="md"
  radius="md"
  withBorder
  style={{
    marginBottom: 16,
    padding: 16,
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
                <Group>
                  <BookOpen size={24} color="#004c99" />
                  <Title order={4}>Curso inscrito</Title>
                </Group>
                <Text>React Avanzado</Text>
                <Progress value={65} color="hospitalBlue.5" />
                <Text size="sm" mt="xs">
                  65% completado
                </Text>
              </Paper>

              <Paper
  shadow="sm"
  p="md"
  radius="md"
  withBorder
  style={{
    marginBottom: 16,
    padding: 16,
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
                <Group>
                  <BookOpen size={24} color="#004c99" />
                  <Title order={4}>Cursos disponibles</Title>
                </Group>
                <Stack gap="xs" mt="sm">
                  <Button leftSection={<BookOpen size={20} />} variant="light">
                    Docker Básico
                  </Button>
                  <Button leftSection={<BookOpen size={20} />} variant="light">
                    SQL Intermedio
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Columna central: curso y carrusel separados */}
            <Grid.Col span={4}>
             <Paper
  shadow="sm"
  p="md"
  radius="md"
  withBorder
  style={{
    marginBottom: 16,
    padding: 16,
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
                <Group>
                  <YoutubeLogo size={24} color="#004c99" />
                  <Title order={4}>Ver Curso</Title>
                </Group>
 <button
          style={{
           
          
            textAlign: "center",
            padding: "2rem",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
            width: "100%",
          }}
          type="button"
          onClick={() => setOpened(true)}
        >
          <Text fw={500}>🎬 Click para abrir el video</Text>
        </button>
      </Paper>

      {/* Modal centrado con el video */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Vista previa del curso"
        size="xl"
        centered
      >
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src="https://www.youtube.com/embed/HjcJC43pgos"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
              borderRadius: "8px",
            }}
          ></iframe>
        </div>
      </Modal>

      
             <Paper
  shadow="sm"
  p="md"
  radius="md"
  withBorder
  style={{
    marginBottom: 16,
    padding: 16,
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
                <Group>
                  <Images size={24} color="#004c99" />
                  <Title order={4}>Carrusel de Imágenes</Title>
                </Group>
                <Paper
                  shadow="xs"
                  p="xl"
                  radius="md"
                  style={{
                    backgroundColor: "#d6eaff",
                    color: "#003366",
                    textAlign: "center",
                  }}
                >
                  <Text>IMÁGENES DEL CURSO (Placeholder)</Text>
                </Paper>
              </Paper>
            </Grid.Col>

            {/* Columna derecha con Timeline */}
            <Grid.Col span={4}>
          <Card
  shadow="sm"
  padding="lg"
  radius="md"
  mb="md"
  withBorder
  style={{
  
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
  <Group mb="sm">
    <Clock size={28} color="#004c99" strokeWidth={1.5} />
    <Title order={4}>Programa con tiempos</Title>
  </Group>

  <Timeline bulletSize={24} lineWidth={2} mt="md">
    <Timeline.Item bullet={<Presentation size={18} />} title="10:00 hrs" color="green">
      Presentación
    </Timeline.Item>
    <Timeline.Item bullet={<ListChecks size={18} />} title="11:00 hrs" color="blue">
      Puntos del curso
    </Timeline.Item>
    <Timeline.Item bullet={<Coffee size={18} />} title="12:00 hrs" color="orange">
      Receso
    </Timeline.Item>
    <Timeline.Item bullet={<BookOpen size={18} />} title="13:00 hrs" color="blue">
      Continua el curso
    </Timeline.Item>
    <Timeline.Item bullet={<BookOpen size={18} />} title="14:00 hrs" color="red">
      Termina curso
    </Timeline.Item>
    <Timeline.Item bullet={<Megaphone size={18} />} title="15:00 hrs" color="purple">
      Avisos para el día siguiente
    </Timeline.Item>
  </Timeline>
</Card>



             <Card
  shadow="sm"
  padding="lg"
  radius="md"
  mb="md"
  withBorder
  style={{
  
    borderLeft: "8px solid #040948",
    borderRadius: 8,
  }}
>
                <Group>
                  <Lock size={28} color="#004c99" />
                  <Title order={4}>Usuario y contraseña</Title>
                </Group>
                <Text size="sm" color="dimmed">
                  Gestión de credenciales y acceso...
                </Text>
              </Card>
              
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
    </MantineProvider>
  );
}
