export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  fitness_level?: string;
  goals?: string;
  injuries?: string;
  vapiPhoneNumber?: string;
  vapiAssistantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  fitness_level?: string;
  goals?: string;
  injuries?: string;
}

export interface UpdateUserDto {
  name?: string;
  age?: number;
  fitness_level?: string;
  goals?: string;
  injuries?: string;
}
