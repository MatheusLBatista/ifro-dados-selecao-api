import { z } from "zod";
import { Role } from "../../../models/Usuario";

const hashPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UsuarioSchema = z.object({
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
  senha: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .optional()
    .refine(
      (password) => {
        if (!password) return true;
        return hashPassword.test(password);
      },
      {
        message:
          "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.",
      }
    ),
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

  papel: z
    .string({ message: "O papel é obrigatório." })
    .transform((val) => val.toLowerCase().trim())
    .pipe(
      z.enum(Object.values(Role), {
        message:
          "Papel inválido. Use: administrador, coordenador ou avaliador.",
      })
    ),
});

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };
export type UsuarioDTO = z.infer<typeof UsuarioSchema>;
export type UsuarioInputDTO = z.input<typeof UsuarioSchema>;
export type UsuarioUpdateDTO = z.infer<typeof UsuarioUpdateSchema>;
