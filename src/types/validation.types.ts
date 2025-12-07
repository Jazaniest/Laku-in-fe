import { z } from 'zod';

// Authentication validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email tidak valid')
    .min(1, 'Email wajib diisi'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(50, 'Password maksimal 50 karakter')
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(30, 'Nama maksimal 30 karakter')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf dan spasi')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Voice commands validation
export const voiceCommandSchema = z.object({
  text: z
    .string()
    .min(1, 'Perintah suara tidak boleh kosong')
    .max(500, 'Perintah suara terlalu panjang')
});

export type VoiceCommandData = z.infer<typeof voiceCommandSchema>;