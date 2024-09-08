import subprocess
import sys

def install_packages():
    packages = [
        "pinecone-client",
        "google-generativeai",
        "python-dotenv"
    ]

    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        except subprocess.CalledProcessError as e:
            print(f"Failed to install {package}. Error: {e}")
            return False
    return True

if __name__ == "__main__":
    success = install_packages()
    if success:
        print("All packages installed successfully.")
    else:
        print("Some packages failed to install.")
