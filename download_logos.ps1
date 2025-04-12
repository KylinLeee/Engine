# Create a function to download a file
function Download-File {
    param (
        [string]$Url,
        [string]$OutputPath
    )
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($Url, $OutputPath)
        Write-Host "Downloaded: $OutputPath"
    }
    catch {
        Write-Host "Error downloading $Url : $_"
    }
}

# Read the sources file
$sources = Get-Content -Path "logos/sources.txt" -Raw

# Split into categories
$categories = $sources -split "# " | Where-Object { $_ -ne "" }

foreach ($category in $categories) {
    $lines = $category -split "`n" | Where-Object { $_ -ne "" }
    $categoryName = $lines[0].Trim()
    $categoryFolder = $categoryName -replace " ", "_" -replace "&", "and" -replace "\.", "" -replace "AI", "" -replace " ", "" -replace "-", "_"
    $categoryFolder = $categoryFolder.ToLower()
    
    Write-Host "Processing category: $categoryName"
    
    # Skip the first line (category name)
    for ($i = 1; $i -lt $lines.Count; $i++) {
        $line = $lines[$i].Trim()
        if ($line -ne "") {
            $parts = $line -split ": "
            $toolName = $parts[0]
            $url = $parts[1]
            
            # Create filename
            $filename = $toolName -replace " ", "_" -replace "\.", "" -replace "&", "and" -replace "-", "_"
            $filename = $filename.ToLower()
            
            # Get file extension from URL
            $extension = [System.IO.Path]::GetExtension($url)
            if ($extension -eq "") {
                $extension = ".svg"  # Default to SVG if no extension
            }
            
            $outputPath = "logos\$categoryFolder\$filename$extension"
            
            # Create directory if it doesn't exist
            $directory = [System.IO.Path]::GetDirectoryName($outputPath)
            if (-not (Test-Path $directory)) {
                New-Item -ItemType Directory -Path $directory -Force | Out-Null
            }
            
            # Download the file
            Download-File -Url $url -OutputPath $outputPath
        }
    }
}

Write-Host "All downloads completed!" 