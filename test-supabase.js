const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ycssbfzfrcfxpbsdlzkq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljc3NiZnpmcmNmeHBic2RsemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTgwODMsImV4cCI6MjA4NTc5NDA4M30.zmidXgCeI92y8hdAjA8V7j9RsWHW_XcNPaabZEBrN-g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('🧪 Testando conexão com Supabase...');
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Erro na consulta:', error.message);
        } else {
            console.log('✅ Conexão estabelecida com sucesso!');
        }
    } catch (err) {
        console.error('💥 Erro inesperado:', err.message);
    }
}

testConnection();
