import { auth } from "@/lib/auth"; // Ajuste a importação se o seu auth.ts estiver em outro caminho
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: "admin@gmail.com",
        password: "admin123",
        name: "Administrador",
      },
    });

    return NextResponse.json({ ok: true, mensagem: "Admin criado com sucesso!", user });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, erro: error?.message || error },
      { status: 500 }
    );
  }
}