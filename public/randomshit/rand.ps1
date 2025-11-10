# Random Stuff PowerShell Script
Write-Host "🎉 Starting Random PowerShell Stuff...`n" -ForegroundColor Cyan

# 1. Get random system information
Write-Host "=== Random System Info ===" -ForegroundColor Yellow
$computerName = $env:COMPUTERNAME
$userName = $env:USERNAME
$time = Get-Date
Write-Host "Computer: $computerName" -ForegroundColor Green
Write-Host "User: $userName" -ForegroundColor Green
Write-Host "Current Time: $time" -ForegroundColor Green

# 2. Create a temporary random file
Write-Host "`n=== Creating Random File ===" -ForegroundColor Yellow
$randomContent = @"
This is a randomly generated file!
Created at: $(Get-Date)
Random Number: $(Get-Random -Maximum 1000)
PowerShell is fun! 🚀
"@

$tempFile = "$env:TEMP\random_stuff_$(Get-Random -Maximum 10000).txt"
$randomContent | Out-File -FilePath $tempFile
Write-Host "Created file: $tempFile" -ForegroundColor Green

# 3. Generate some random numbers
Write-Host "`n=== Random Numbers ===" -ForegroundColor Yellow
1..5 | ForEach-Object {
    $randomNum = Get-Random -Minimum 1 -Maximum 100
    Write-Host "Random number $_: $randomNum" -ForegroundColor Magenta
}

# 4. Play with processes
Write-Host "`n=== Process Fun ===" -ForegroundColor Yellow
$randomProcess = Get-Process | Where-Object {$_.ProcessName -ne "Idle"} | Get-Random -Count 1
Write-Host "Random process: $($randomProcess.ProcessName)" -ForegroundColor Cyan
Write-Host "PID: $($randomProcess.Id)" -ForegroundColor Cyan
Write-Host "Memory: $([math]::Round($randomProcess.WorkingSet/1MB, 2)) MB" -ForegroundColor Cyan

# 5. Count files in temp directory
Write-Host "`n=== Temp Directory Stats ===" -ForegroundColor Yellow
$tempFiles = Get-ChildItem -Path $env:TEMP -File | Measure-Object
Write-Host "Files in temp directory: $($tempFiles.Count)" -ForegroundColor Green

# 6. Fun with strings
Write-Host "`n=== String Manipulation ===" -ForegroundColor Yellow
$funText = "powershell is awesome!"
Write-Host "Original: $funText" -ForegroundColor Gray
Write-Host "Uppercase: $($funText.ToUpper())" -ForegroundColor Blue
Write-Host "Reversed: $($funText[-1..-$funText.Length] -join '')" -ForegroundColor Blue

# 7. Math operations
Write-Host "`n=== Math Time ===" -ForegroundColor Yellow
$a = Get-Random -Minimum 10 -Maximum 50
$b = Get-Random -Minimum 1 -Maximum 10
Write-Host "$a + $b = $($a + $b)" -ForegroundColor Red
Write-Host "$a * $b = $($a * $b)" -ForegroundColor Red
Write-Host "$a / $b = $([math]::Round($a/$b, 2))" -ForegroundColor Red

# 8. Create a quick progress bar for fun
Write-Host "`n=== Progress Simulation ===" -ForegroundColor Yellow
1..10 | ForEach-Object {
    Write-Progress -Activity "Doing Random Stuff" -Status "Progress: $_/10" -PercentComplete ($_ * 10)
    Start-Sleep -Milliseconds 200
}
Write-Progress -Activity "Doing Random Stuff" -Completed

# 9. Show the created file content
Write-Host "`n=== File Content Preview ===" -ForegroundColor Yellow
Get-Content $tempFile | ForEach-Object { Write-Host "  $_" -ForegroundColor White }

# 10. Cleanup offer
Write-Host "`n=== Cleanup ===" -ForegroundColor Yellow
$cleanup = Read-Host "Delete the temporary file? (y/n)"
if ($cleanup -eq 'y' -or $cleanup -eq 'Y') {
    Remove-Item $tempFile -Force
    Write-Host "File deleted!" -ForegroundColor Green
} else {
    Write-Host "File kept at: $tempFile" -ForegroundColor Yellow
}

Write-Host "`n🎊 Random PowerShell stuff completed! Have a great day! 😊" -ForegroundColor Cyan
