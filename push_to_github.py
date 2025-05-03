import os
import subprocess
import sys

def run_command(command):
    """Run a shell command and return the output."""
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(f"Error message: {e.stderr}")
        return None

def push_to_github():
    """Push the project to GitHub."""
    # 1. Check if Git is installed
    git_version = run_command("git --version")
    if not git_version:
        print("Git is not installed. Please install Git and try again.")
        return False

    print(f"Git version: {git_version.strip()}")

    # 2. Initialize Git repository if not already initialized
    if not os.path.exists(".git"):
        print("Initializing Git repository...")
        run_command("git init")
    else:
        print("Git repository already initialized.")

    # 3. Configure Git user (if needed)
    user_name = input("Enter your GitHub username: ")
    user_email = input("Enter your GitHub email: ")
    
    run_command(f'git config user.name "{user_name}"')
    run_command(f'git config user.email "{user_email}"')
    
    print("Git user configured.")

    # 4. Add all files to Git
    print("Adding files to Git...")
    run_command("git add .")

    # 5. Commit changes
    commit_message = input("Enter commit message (default: 'Initial commit'): ") or "Initial commit"
    print(f"Committing changes with message: {commit_message}")
    run_command(f'git commit -m "{commit_message}"')

    # 6. Create a new repository on GitHub (manual step)
    print("\nBefore continuing, please create a new repository on GitHub:")
    print("1. Go to https://github.com/new")
    print("2. Enter a repository name (e.g., '9jaWaveLyrics')")
    print("3. Choose public or private")
    print("4. Do NOT initialize with README, .gitignore, or license")
    print("5. Click 'Create repository'")
    
    repo_url = input("\nEnter the GitHub repository URL (e.g., https://github.com/username/9jaWaveLyrics.git): ")
    
    # 7. Add remote and push
    print(f"Adding remote repository: {repo_url}")
    run_command(f'git remote add origin {repo_url}')
    
    print("Pushing to GitHub...")
    push_result = run_command('git push -u origin master')
    
    if push_result:
        print("\nSuccessfully pushed to GitHub!")
        print(f"Your repository is now available at: {repo_url}")
        return True
    else:
        print("\nFailed to push to GitHub. Please check the error messages above.")
        return False

if __name__ == "__main__":
    print("=== 9jaWaveLyrics GitHub Push Tool ===")
    push_to_github()
