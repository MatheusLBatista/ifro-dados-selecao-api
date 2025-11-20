import "dotenv/config";
import Usuario from "../models/Usuario";
import { faker } from "@faker-js/faker";
import DbConnect from "../config/DbConnect";
import {
  UsuarioSchema,
  UsuarioInputDTO,
} from "../utils/validators/schemas/UsuarioSchema";
import AuthHelper from "../utils/AuthHelper";

await DbConnect.conectar();

export default async function seed_usuario(): Promise<any[]> {
  await Usuario.deleteMany({});

  const usuarios: UsuarioInputDTO[] = [];

  usuarios.push(
    {
      nome: "Ana Clara Oliveira",
      email: "ana.admin@empresa.com",
      telefone: "11987654321",
      senha: "Administrador$2025",
      data_nascimento: "15/03/1990",
      papel: "administrador",
    },
    {
      nome: "Carlos Eduardo Santos",
      email: "carlos.coord@empresa.com",
      telefone: "31998765432",
      senha: "Coordenador$2025",
      data_nascimento: "22/07/1988",
      papel: "coordenador",
    },
    {
      nome: "Mariana Costa Lima",
      email: "mariana.avaliador@empresa.com",
      telefone: "21976543218",
      senha: "Avaliador$2025",
      data_nascimento: "10/11/1995",
      papel: "avaliador",
    }
  );

  for (let i = 0; i < 10; i++) {
    const roleAleatoria = faker.helpers.arrayElement([
      "administrador",
      "coordenador",
      "avaliador",
    ]);

    usuarios.push({
      nome: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase(),
      telefone: "11" + faker.string.numeric(9).replace(/^0/, "9"),
      senha: "SenhaF0rte@2025!",
      data_nascimento: faker.date
        .between({ from: new Date("1950-01-01"), to: new Date("2009-12-31") })
        .toLocaleDateString("pt-BR"),
      papel: roleAleatoria,
    });
  }

  const usuariosComHash = await Promise.all(
    usuarios.map(async (user) => {
      const validatedUser = UsuarioSchema.parse(user);

      if (user.senha) {
        const { senha: hashed } = await AuthHelper.hashPassword(user.senha);
        return { ...validatedUser, senha: hashed };
      }
      return validatedUser;
    })
  );

  await Usuario.insertMany(usuariosComHash);
  console.log(`${usuarios.length} usuários inseridos com sucesso!`);

  return await Usuario.find().select("-senha");
}
