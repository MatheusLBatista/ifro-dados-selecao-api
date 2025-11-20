import { z } from "zod";

export const UsuarioPapel = z.enum([
  "administrador",
  "avaliador",
  "coordenador",
] as const);

export const UsuarioQuerySchema = z.object({
  nome: z
    .string("Nome inválido.")
    .transform((val) => val?.trim())
    .refine((val) => !val || val.length >= 2, {
      message: "Nome deve ter pelo menos 2 caracteres.",
    })
    .optional(),

  email: z
    .string()
    .email("Email inválido.")
    .transform((val) => val?.toLowerCase().trim())
    .optional(),

  papel: z
    .string()
    .transform((val) => {
      if (!val) return val;
      const normalized = val.toLowerCase().trim();
      const mapping: { [key: string]: string } = {
        administrador: "administrador",
        avaliador: "avaliador",
        coordenador: "coordenador",
      };
      return mapping[normalized] || val;
    })
    .pipe(
      z.enum(["administrador", "avaliador", "coordenador"], {
        message: "O papel deve ser: administrador, avaliador ou coordenador.",
      })
    )
    .optional(),

  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val as string, 10))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: "page deve ser um número inteiro maior que 0.",
    })
    .optional(),

  limite: z
    .string()
    .default("10")
    .transform((val) => parseInt(val as string, 10))
    .refine((val) => Number.isInteger(val) && val >= 1 && val <= 100, {
      message: "limite deve ser um número inteiro entre 1 e 100.",
    })
    .optional(),
});

export type UsuarioQueryDTO = z.infer<typeof UsuarioQuerySchema>;
