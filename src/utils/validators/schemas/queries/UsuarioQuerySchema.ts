import { z } from "zod";
import mongoose from 'mongoose';

export const UsuarioIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});