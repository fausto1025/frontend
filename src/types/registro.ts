export interface FormData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: number | string;
  fechaNacimiento: Date | null;
  edad: number;
  genero: string;
  escolaridad: string;
  especialidad: string;
  pais: string;
  estado?: string;
  municipio?: string;
  curso: string;
  fotoPerfil?: File | null;
  privacidad: boolean;
}