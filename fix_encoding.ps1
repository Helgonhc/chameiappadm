$files = Get-ChildItem "public/reports/*.html"

# Mapa de substituições usando herestring para evitar conflitos de aspas
$replacements = @{
    "Ã¡"  = "á"
    "Ã "  = "à"
    "Ã¢"  = "â"
    "Ã£"  = "ã"
    "Ã©"  = "é"
    "Ãª"  = "ê"
    "Ã­"  = "í"
    "Ã³"  = "ó"
    "Ã´"  = "ô"
    "Ãµ"  = "õ"
    "Ãº"  = "ú"
    "Ã§"  = "ç"
    "Ã‡"  = "Ç"
    "Ã‚"  = "Â"
    "Ãƒ"  = "Ã"
    "Ã‰"  = "É"
    "ÃŠ"  = "Ê"
    "Âµ"  = "µ"
    "Î©"  = "Ω"
    "Â°"  = "°"
    "NÂº" = "Nº"
    "â€œ" = '"'
    "â€ " = '"'
    "Â "  = " "
}

foreach ($file in $files) {
    Write-Host "Processando: $($file.Name)"
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    foreach ($entry in $replacements.GetEnumerator()) {
        $content = $content.Replace($entry.Key, $entry.Value)
    }

    # Salva novamente como UTF-8
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
Write-Host "Codificação corrigida com sucesso."
