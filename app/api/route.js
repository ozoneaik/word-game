import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(){
    const words = await prisma.tbl_word_game.findMany({});
    return Response.json({
        words,
    });
}