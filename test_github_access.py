import os
import urllib.request
import sys
import tempfile

def test_github_access():
    """
    Test if we can access and download files from GitHub.
    This script can be run locally to verify your GitHub token works.
    """
    # GitHub raw content URL (replace with your actual URL)
    GITHUB_RAW_URL = os.environ.get('GITHUB_RAW_URL', 'https://raw.githubusercontent.com/s-agarwl/nodetrix-multiplex/main')
    
    # Files to test
    files_to_test = [
        "static/server_services/pythondata_infovis2015/dictGlobalIDAuthorName.p",
        "static/server_services/pythondata_infovis2015/co-authorship_dictionary_matrix.p",
        "static/server_services/pythondata_infovis2015/co-citation_authors_dictionary_matrix.p",
        "static/server_services/pythondata_infovis2015/author_topic_dictionary_matrix.p"
    ]
    
    print(f"Testing GitHub access with URL: {GITHUB_RAW_URL}")
    
    # Test each file
    for file_path in files_to_test:
        github_url = f"{GITHUB_RAW_URL}/{file_path}"
        print(f"\nTesting access to: {github_url}")
        
        try:
            # First try a HEAD request to check if the file exists
            req = urllib.request.Request(github_url, method="HEAD")
            resp = urllib.request.urlopen(req, timeout=5)
            
            print(f"  ✅ File exists: Status {resp.status} {resp.reason}")
            print(f"  Content-Length: {resp.headers.get('Content-Length', 'Unknown')} bytes")
            print(f"  Content-Type: {resp.headers.get('Content-Type', 'Unknown')}")
            
            # Try to download a small part of the file
            print("  Attempting to download first 1024 bytes...")
            with urllib.request.urlopen(github_url) as response:
                data = response.read(1024)
                print(f"  ✅ Successfully downloaded {len(data)} bytes")
                
                # Save to temp file
                tmp_path = os.path.join(tempfile.gettempdir(), os.path.basename(file_path))
                with open(tmp_path, 'wb') as f:
                    f.write(data)
                print(f"  ✅ Saved sample to: {tmp_path}")
                
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
    
    print("\nIf all tests passed, your GitHub token is working correctly!")
    print("If you see errors, check your token and repository permissions.")

if __name__ == "__main__":
    # Allow passing GitHub URL as command line argument
    if len(sys.argv) > 1:
        os.environ['GITHUB_RAW_URL'] = sys.argv[1]
    
    test_github_access() 