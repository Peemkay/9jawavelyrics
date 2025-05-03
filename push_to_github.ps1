Write-Host "=== Pushing 9jaWaveLyrics to GitHub ===" -ForegroundColor Green

Set-Location -Path "C:\Users\chaki\Documents\augment-projects\9jaWaveLyrics"

Write-Host "Setting up Git user..." -ForegroundColor Yellow
git config --local user.email "your-email@example.com"
git config --local user.name "Your Name"

Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit: 9jaWaveLyrics Artwork Editor"

Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin git@github.com:Peemkay/9jawavelyrics.git 2>$null
# The 2>$null suppresses error if remote already exists

Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "Done!" -ForegroundColor Green
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
