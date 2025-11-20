import { z } from "zod";
import mongoose from 'mongoose';

export const MongoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});