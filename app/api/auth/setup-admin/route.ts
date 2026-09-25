import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY não está configurada no servidor.' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const targetEmail = email.trim().toLowerCase();

    // 1. Listar usuários para encontrar o usuário existente
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json({ error: `Erro ao listar usuários do Supabase: ${listError.message}` }, { status: 500 });
    }

    const existingUser = usersData.users.find((u) => u.email?.toLowerCase() === targetEmail);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // Atualizar a senha, auto-confirmar e definir role admin nos metadados
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: password,
        email_confirm: true,
        user_metadata: { role: 'admin' },
        app_metadata: { role: 'admin' },
      });

      if (updateError) {
        return NextResponse.json({ error: `Erro ao atualizar usuário no Supabase Auth: ${updateError.message}` }, { status: 500 });
      }
    } else {
      // Criar o usuário diretamente já confirmado com a senha fornecida
      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: targetEmail,
        password: password,
        email_confirm: true,
        user_metadata: { role: 'admin' },
        app_metadata: { role: 'admin' },
      });

      if (createError || !newUserData.user) {
        return NextResponse.json({ error: `Erro ao criar usuário admin no Supabase Auth: ${createError?.message}` }, { status: 500 });
      }

      userId = newUserData.user.id;
    }

    // 2. Garantir o registro com role 'admin' na tabela public.profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: targetEmail,
        role: 'admin',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      return NextResponse.json({ error: `Erro ao salvar perfil de admin na tabela profiles: ${profileError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Conta ${targetEmail} configurada, ativada e promovida a Admin com sucesso no Supabase!`,
      userId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro inesperado no servidor.' }, { status: 500 });
  }
}
