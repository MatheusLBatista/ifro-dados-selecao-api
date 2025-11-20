import mongoose, { Model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export enum Status {
  APROVADO = "Aprovado",
  REPROVADO = "Reprovado",
  PENDENTE = "Pendente"
}

export interface InscricaoI {
  nome: string, 
  email: string,
  telefone: string, 
  data_nascimento: string,
  background: {
    certificado: string,
    descricao: string
  },
  experiencia: string, 
  area_interesse: string,
  observacao?: string,
  status: Status,
  createdAt?: Date,
  updatedAt?: Date;
}

class Inscricao {
  public model: Model <InscricaoI>

  constructor() {
    const inscricaoSchema = new mongoose.Schema<InscricaoI>(
      {
        nome: { type: String },
        email: { type: String },
        telefone: { type: String },
        data_nascimento: { type: String },
        background: {
          certificado: { type: String },
          descricao: { type: String  }
        },
        experiencia: { type: String },
        area_interesse: { type: String },
        observacao: { type: String },
        status: { type: String, enum: Object.values(Status), default: Status.PENDENTE }
      },
      {
        timestamps: true,
        versionKey: false,
      }
    );

    inscricaoSchema.plugin(mongoosePaginate)
    this.model = mongoose.model<InscricaoI>("Inscricao", inscricaoSchema);
  }
}

export default new Inscricao().model;