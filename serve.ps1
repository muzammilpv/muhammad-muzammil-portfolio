$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "High-Performance Media Server running at $prefix"

$root = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        [System.Threading.ThreadPool]::QueueUserWorkItem({
            param($ctx)
            $request = $ctx.Request
            $response = $ctx.Response

            try {
                $path = $request.Url.LocalPath
                if ($path -eq "/") { $path = "/index.html" }
                
                # Unescape URI paths
                $decodedPath = [System.Uri]::UnescapeDataString($path)
                $filePath = Join-Path $root ($decodedPath.TrimStart('/').Replace('/', '\'))
                
                if (Test-Path $filePath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    switch ($ext) {
                        ".html" { $contentType = "text/html; charset=utf-8" }
                        ".css"  { $contentType = "text/css" }
                        ".js"   { $contentType = "text/javascript" }
                        ".jpg"  { $contentType = "image/jpeg" }
                        ".jpeg" { $contentType = "image/jpeg" }
                        ".png"  { $contentType = "image/png" }
                        ".svg"  { $contentType = "image/svg+xml" }
                        ".mp4"  { $contentType = "video/mp4" }
                        ".mov"  { $contentType = "video/quicktime" }
                        default { $contentType = "application/octet-stream" }
                    }
                    
                    $response.ContentType = $contentType
                    $response.AddHeader("Accept-Ranges", "bytes")
                    $fileLength = (Get-Item $filePath).Length

                    # Handle HTTP Range Requests for smooth Video Streaming
                    $rangeHeader = $request.Headers["Range"]
                    if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                        $range = $rangeHeader.Substring(6).Split('-')
                        $start = [int64]$range[0]
                        $end = if ($range[1]) { [int64]$range[1] } else { $fileLength - 1 }
                        if ($end -ge $fileLength) { $end = $fileLength - 1 }
                        
                        $count = $end - $start + 1
                        $response.StatusCode = 206
                        $response.AddHeader("Content-Range", "bytes $start-$end/$fileLength")
                        $response.ContentLength64 = $count
                        
                        $fs = [System.IO.File]::OpenRead($filePath)
                        $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $buffer = New-Object byte[] 65536
                        $bytesRemaining = $count
                        while ($bytesRemaining -gt 0) {
                            $toRead = [Math]::Min($buffer.Length, $bytesRemaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $response.OutputStream.Write($buffer, 0, $read)
                            $bytesRemaining -= $read
                        }
                        $fs.Close()
                    } else {
                        $response.StatusCode = 200
                        $response.ContentLength64 = $fileLength
                        $fs = [System.IO.File]::OpenRead($filePath)
                        $fs.CopyTo($response.OutputStream)
                        $fs.Close()
                    }
                } else {
                    $response.StatusCode = 404
                }
            } catch {
                # Handle client disconnects gracefully
            } finally {
                try { $response.Close() } catch {}
            }
        }, $context) | Out-Null
    } catch {
        # Listener stopped
    }
}
