import "dotenv/config";
import Inscricao from "../models/Inscricao";
import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import DbConnect from "../config/DbConnect";
import {
  InscricaoDTO,
  InscricaoInputDTO,
  InscricaoSchema,
} from "../utils/validators/schemas/InscricaoSchema";
import { Status } from "../models/Inscricao";

await DbConnect.conectar();

export default async function seed_inscricao(): Promise<InscricaoDTO[]> {
  await Inscricao.deleteMany();

  const inscricoes: InscricaoInputDTO[] = [];

  inscricoes.push({
    nome: "Mario Silva Santos",
    email: "mario.pedro2@email.com",
    telefone: "69992723354",
    data_nascimento: "09-09-2000",
    background: [
      {
        certificado: "https://udemy.com/certificate/UC-abc123xyz",
        descricao: "Curso completo de Node.js e Express com mais de 40 horas.",
      },
      {
        certificado: "https://udemy.com/certificate/UC-typescript",
        descricao: "Curso de Typescript e Next.js com mais de 100 horas.",
      },
    ],
    experiencia:
      "Atuei por 1 ano como estagiário back-end em uma startup de fintech.",
    area_interesse: "Back-end Node.js",
    pontuacao: 8,
    observacao: "Disponível para trabalhar remotamente",
    status: Status.PENDENTE,
  });

  for (let i = 0; i <= 10; i++) {
    inscricoes.push({
      nome: faker.person.firstName() + " " + faker.person.lastName(),
      email: faker.internet.email(),
      telefone: "11" + faker.string.numeric(9).replace(/^0/, "9"),
      data_nascimento: faker.date
        .between({ from: new Date("1950-01-01"), to: new Date("2009-12-31") })
        .toLocaleDateString("pt-BR"),
      background: [
        {
          certificado: faker.internet.url() + "/" + uuid() + ".jpg",
          descricao: faker.lorem.sentence(),
        },
      ],
      experiencia: faker.lorem.paragraph(),
      area_interesse: faker.person.jobArea(),
      observacao: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(Object.values(Status)),
    });
  }

  const parsedData = inscricoes.map((data) => InscricaoSchema.parse(data));
  await Inscricao.insertMany(parsedData);
  console.log(`${inscricoes.length} inscrições inseridas com sucesso!`);

  return await Inscricao.find();
}
