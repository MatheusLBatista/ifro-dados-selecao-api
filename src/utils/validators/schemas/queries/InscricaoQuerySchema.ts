import { z } from "zod";

export const InscricaoStatusEnum = z.enum([
  "PENDENTE",
  "APROVADO",
  "REPROVADO",
] as const);

export const InscricaoQuerySchema = z.object({
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

  status: InscricaoStatusEnum.optional(),

  pontuacaoMin: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val >= 0 && val <= 10), {
      message: "A pontuação mínima deve ser um número inteiro entre 0 e 10.",
    })
    .optional(),

  pontuacaoMax: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val >= 0 && val <= 100), {
      message: "A pontuação máxima deve ser um número inteiro entre 0 e 100.",
    })
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

export type InscricaoQueryDTO = z.infer<typeof InscricaoQuerySchema>;