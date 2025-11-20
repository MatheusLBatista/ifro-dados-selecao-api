import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export enum Status {
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
  PENDENTE = "PENDENTE",
}

interface Background {
  certificado: string;
  descricao: string;
}

export interface InscricaoI {
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  background: Background[];
  experiencia: string;
  area_interesse: string;
  observacao?: string;
  status: Status;
  pontuacao: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Inscricao {
  public model: Model<InscricaoI>;

  constructor() {
    const inscricaoSchema = new mongoose.Schema<InscricaoI>(
      {
        nome: { type: String },
        email: { type: String },
        telefone: { type: String },
        data_nascimento: { type: String },
        background: [
          {
            certificado: { type: String },
            descricao: { type: String },
            _id: false,
          }
        ],
        experiencia: { type: String },
        area_interesse: { type: String },
        observacao: { type: String },
        pontuacao: { type: Number, default: null },
        status: {
          type: String,
          enum: Object.values(Status),
          default: Status.PENDENTE,
        },
      },
      {
        timestamps: true,
        versionKey: false,
      }
    );

    inscricaoSchema.plugin(mongoosePaginate);
    this.model = mongoose.model<InscricaoI>("Inscricao", inscricaoSchema);
  }
}

export default new Inscricao().model;
