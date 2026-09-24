import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteger todas as rotas administrativas /admin/* (exceto /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Se Supabase não estiver configurado em desenvolvimento local, permite navegar no mockup admin
    if (!supabaseUrl || !supabaseAnonKey) {
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/admin/login?error=sem-configuracao', request.url));
    }

    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // 1. Validar sessão real do usuário no servidor (NÃO apenas existência de cookie)
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Validar autorização ADMIN explícita (NÃO apenas role 'authenticated')
    const userRole = user.app_metadata?.role || user.user_metadata?.role;

    if (userRole !== 'admin') {
      // Checar na tabela profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        // Usuário autenticado, mas SEM autorização de admin -> 403 / Redirecionar
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'acesso-negado-sem-permissao');
        return NextResponse.redirect(loginUrl);
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
