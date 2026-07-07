# Cubaze Academy - PowerShell Static HTTP Server
# Serves files from the current directory on port 8080

$port = 8080
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Cubaze Academy Live Server" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Serving: $root" -ForegroundColor Gray
Write-Host "  URL:     http://localhost:$port" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# MIME type map
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".webp" = "image/webp"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".txt"  = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        # Decode URL
        $urlPath = [System.Uri]::UnescapeDataString($urlPath)
        # Build file path safely
        $filePath = Join-Path $root ($urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar))

        Write-Host "[$([datetime]::Now.ToString('HH:mm:ss'))] $($request.HttpMethod) $urlPath" -ForegroundColor DarkGray

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200

            # Enable CORS for local dev
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # 404 fallback - serve index.html for SPA routing
            $indexPath = Join-Path $root "index.html"
            if (Test-Path $indexPath) {
                $bytes = [System.IO.File]::ReadAllBytes($indexPath)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                Write-Host "  -> SPA fallback: served index.html" -ForegroundColor DarkYellow
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
                Write-Host "  -> 404 Not Found" -ForegroundColor Red
            }
        }

        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
