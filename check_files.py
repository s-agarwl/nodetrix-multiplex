import os
import sys

def check_files():
    """
    Check if data files exist in the expected locations.
    This script can be run in the Vercel deployment to debug file paths.
    """
    print("Checking file paths...")
    
    # Check current directory
    print(f"Current working directory: {os.getcwd()}")
    
    # Check environment
    print("Environment variables:")
    for key, value in os.environ.items():
        if key.startswith("VERCEL"):
            print(f"  {key}: {value}")
    
    # List of directories to check
    directories = [
        ".",
        "/var/task",
        "/var/task/static",
        "/var/task/static/server_services",
        "/var/task/static/server_services/pythondata_infovis2015",
        "static",
        "static/server_services",
        "static/server_services/pythondata_infovis2015"
    ]
    
    # Check each directory
    for directory in directories:
        if os.path.exists(directory):
            print(f"\nDirectory exists: {directory}")
            try:
                files = os.listdir(directory)
                print(f"  Contents ({len(files)} files):")
                for file in files:
                    file_path = os.path.join(directory, file)
                    file_size = os.path.getsize(file_path) if os.path.isfile(file_path) else "N/A"
                    print(f"  - {file} ({file_size} bytes)")
            except Exception as e:
                print(f"  Error listing directory: {str(e)}")
        else:
            print(f"\nDirectory does not exist: {directory}")
    
    # Check specific data files
    data_files = [
        "/var/task/static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p",
        "/var/task/static/server_services/pythondata_infovis2015/co-authorship_dictionary_matrix.p",
        "/var/task/static/server_services/pythondata_infovis2015/co-citation_authors_dictionary_matrix.p",
        "/var/task/static/server_services/pythondata_infovis2015/author_topic_dictionary_matrix.p",
        "static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p",
        "static/server_services/pythondata_infovis2015/co-authorship_dictionary_matrix.p",
        "static/server_services/pythondata_infovis2015/co-citation_authors_dictionary_matrix.p",
        "static/server_services/pythondata_infovis2015/author_topic_dictionary_matrix.p"
    ]
    
    print("\nChecking specific data files:")
    for file_path in data_files:
        if os.path.exists(file_path):
            print(f"  File exists: {file_path} ({os.path.getsize(file_path)} bytes)")
        else:
            print(f"  File does not exist: {file_path}")
    
    # Try to find any pickle files
    print("\nSearching for pickle files:")
    for root_dir in [".", "/var/task"]:
        if os.path.exists(root_dir):
            for dirpath, dirnames, filenames in os.walk(root_dir):
                for filename in filenames:
                    if filename.endswith(".p") or filename.endswith(".pickle"):
                        file_path = os.path.join(dirpath, filename)
                        print(f"  Found pickle file: {file_path} ({os.path.getsize(file_path)} bytes)")

if __name__ == "__main__":
    check_files() 