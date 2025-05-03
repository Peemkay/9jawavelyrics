@echo off
echo === Pushing 9jaWaveLyrics to GitHub ===

cd C:\Users\chaki\Documents\augment-projects\9jaWaveLyrics

echo Setting up Git user...
git config --local user.email "your-email@example.com"
git config --local user.name "Your Name"

echo Adding files to Git...
git add .

echo Committing changes...
git commit -m "Initial commit: 9jaWaveLyrics Artwork Editor"

echo Adding remote repository...
git remote add origin git@github.com:Peemkay/9jawavelyrics.git

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause
