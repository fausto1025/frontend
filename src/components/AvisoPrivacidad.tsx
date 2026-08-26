import {
  Modal,
  Box,
  ThemeIcon,
  Text,
  Divider,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { ShieldCheckIcon } from "@phosphor-icons/react";

interface AvisoPrivacidadProps {
  readonly opened: boolean;
  readonly onClose: () => void;
}

export default function AvisoPrivacidad({
  opened,
  onClose,
}: AvisoPrivacidadProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="xl"
      radius="lg"
      padding={0}
      withCloseButton
      title={
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: "100%",
          }}
        >
          <ThemeIcon
            size={42}
            radius="xl"
            variant="light"
            color="blue"
          >
            <ShieldCheckIcon size={24} weight="duotone" />
          </ThemeIcon>

          <Box>
            <Text fw={700} size="lg">
              Aviso de Privacidad
            </Text>

            <Text size="xs" c="dimmed">
              Protección y tratamiento de datos personales
            </Text>
          </Box>
        </Box>
      }
    >
      <Divider mb="md" />

      <ScrollArea
        h={450}
        offsetScrollbars
        scrollbarSize={8}
        type="auto"
      >
        <Stack gap="md" px="sm" pb="md">

          {/* Introducción */}
          <Box>
            <Text
              size="sm"
              lh={1.7}
              ta="justify"
            >
              Usted está accediendo al SRyC de cumplimiento obligatorio
              entre instituciones del sector salud de primer nivel,
              segundo nivel de atención y tercer nivel de atención,
              tiene como finalidad asegurar la continuidad de la
              atención médica del paciente.
            </Text>
          </Box>

          {/* Protección de datos personales */}
          <Box
            p="md"
            style={{
              borderLeft:
                "4px solid var(--mantine-color-blue-6)",
              backgroundColor:
                "var(--mantine-color-blue-0)",
              borderRadius: "8px",
            }}
          >
            <Text
              fw={700}
              size="sm"
              c="blue.8"
              mb={8}
            >
              Protección de datos personales
            </Text>

            <Text
              size="sm"
              lh={1.7}
              ta="justify"
            >
              El Sistema contiene datos personales sensibles cuyo
              tratamiento se encuentra previsto en la Ley General de
              Protección de Datos Personales en Posesión de Sujetos
              Obligados, así como en la ley en materia de protección de
              datos personales aplicable a la entidad federativa;
              información clasificada como confidencial, la que deberá
              proteger, resguardar, no divulgar, evitar el uso indebido,
              sustraer, ocultar, alterar, mutilar, destruir o inutilizar,
              total o parcialmente, los datos personales a los que en
              ejercicio de sus funciones tenga acceso, su incumplimiento
              es causal de responsabilidad administrativa, civil,
              laboral y penal.
            </Text>
          </Box>

          {/* Aviso importante */}
          <Box
            p="md"
            style={{
              backgroundColor:
                "var(--mantine-color-gray-0)",
              borderRadius: "8px",
              border:
                "1px solid var(--mantine-color-gray-3)",
            }}
          >
            <Text
              size="xs"
              c="dimmed"
              ta="justify"
              lh={1.6}
            >
              El acceso y uso del sistema implica el conocimiento de
              las obligaciones relacionadas con la protección,
              confidencialidad y correcto tratamiento de la información
              contenida en el mismo.
            </Text>
          </Box>

        </Stack>
      </ScrollArea>

      <Divider mt="md" />
    </Modal>
  );
}