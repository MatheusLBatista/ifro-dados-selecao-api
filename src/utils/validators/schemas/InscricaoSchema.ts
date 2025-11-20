import { z } from "zod";
import { Status } from "../../../models/Inscricao";

const BackgroundSchema = z.object({
  certificado: z.string().min(5, "Link do certificado muito curto."),
  descricao: z
    .string()
    .min(10, "Descrição do certificado deve ter pelo menos 10 caracteres."),
});

const InscricaoSchema = z.object({
  nome: z
    .string()
    .nonempty("Campo nome é obrigatório.")
    .min(1, "Nome inválido."),
  email: z
    .string()
    .email("Formato de email inválido.")
    .nonempty("Campo email é obrigatório.")
    .min(3, "Email inválido."),
  telefone: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "O celular deve conter 11 dígitos numéricos."),
  data_nascimento: z
    .string("Data de nascimento é obrigatória.")
    .trim()
    .regex(
      /^\d{2}[\/.-]\d{2}[\/.-]\d{4}$/,
      "Data deve estar no formato DD/MM/AAAA ou DD-MM-AAAA."
    )
    .transform((str) => {
      const [day, month, year] = str.split(/[\/.-]/);
      return `${year}-${month}-${day}`;
    })
    .pipe(
      z
        .string()
        .transform((iso) => new Date(iso))
        .refine((date) => date < new Date(), {
          message: "Data de nascimento não pode ser no futuro.",
        })
        .refine(
          (date) => {
            const today = new Date();
            let age = today.getFullYear() - date.getFullYear();
            const monthDiff = today.getMonth() - date.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < date.getDate())
            ) {
              age--;
            }
            return age >= 16;
          },
          {
            message: "Você deve ter pelo menos 16 anos.",
          }
        )
    ),

  background: z
    .array(BackgroundSchema)
    .min(1, "Ao menos 1 certificado é obrigatório."),

  experiencia: z
    .string()
    .min(20, "Descreva sua experiência com pelo menos 20 caracteres."),

  area_interesse: z.string().min(3, "Área de interesse é obrigatória."),

  observacao: z.string().optional(),

  pontuacao: z
    .number("A pontuação deve ser um número válido entre 1 e 10")
    .nonnegative("O valor não pode ser negativo.")
    .max(10, "A pontuação deve ser no máximo 10.")
    .optional(),

  status: z
    .string()
    .transform((val) => val.toUpperCase().trim())
    .pipe(z.enum(Object.values(Status) as [Status, ...Status[]]))
    .default(Status.PENDENTE)
    .optional(),
});

const InscricaoUpdateSchema = InscricaoSchema.partial();

export { InscricaoSchema, InscricaoUpdateSchema };
export type InscricaoDTO = z.infer<typeof InscricaoSchema>;
export type InscricaoInputDTO = z.input<typeof InscricaoSchema>;
export type InscricaoUpdateDTO = z.infer<typeof InscricaoUpdateSchema>;
