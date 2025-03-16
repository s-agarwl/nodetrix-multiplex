# NodeTrix-Multiplex

A Flask application for visualizing and analyzing network data using a NodeTrix-based approach for multiplex networks.

## Features

- Interactive visualization of multiplex networks
- Matrix-based representation for dense subgraphs
- Multiple similarity metrics (co-authorship, co-citation, author-topic)
- Various matrix operations (Laplacian, power)

## Requirements

- Python 3.6+
- Flask
- NumPy
- SciPy
- NetworkX

## Local Development

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the application: `python server.py`
4. Open http://localhost:5000 in your browser

## Deployment to Vercel

### Important: Data Files Access

This application requires several pickle data files that need to be accessible to the Vercel deployment. The code is set up to download these files directly from your GitHub repository during runtime.

#### Option 1: Public Repository

If your repository is public:

1. **Set the GitHub Raw URL in Vercel**:

   - Go to your Vercel dashboard
   - Select your project
   - Go to "Settings" > "Environment Variables"
   - Add a new environment variable:
     - Name: `GITHUB_RAW_URL`
     - Value: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main`
     - Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name

2. **Deploy to Vercel**:
   ```
   vercel
   ```

#### Option 2: Private Repository

If your repository is private:

1. **Create a GitHub Personal Access Token**:

   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Click "Generate new token" (classic)
   - Give it a name (e.g., "Vercel NodeTrix App")
   - Select the `repo` scope (for private repos)
   - Click "Generate token"
   - **Copy the token immediately** - you won't see it again!

2. **Set the GitHub Raw URL with Token in Vercel**:

   - Go to your Vercel dashboard
   - Select your project
   - Go to "Settings" > "Environment Variables"
   - Add a new environment variable:
     - Name: `GITHUB_RAW_URL`
     - Value: `https://YOUR_TOKEN@raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main`
     - Replace `YOUR_TOKEN`, `YOUR_USERNAME`, and `YOUR_REPO` with your actual values

3. **Deploy to Vercel**:
   ```
   vercel
   ```

### Testing GitHub Access

To test if your GitHub access is working correctly:

1. Deploy your application to Vercel
2. Visit the debug endpoint: `https://your-app.vercel.app/debug/check-files`
3. Check if the GitHub test shows a successful connection

If you encounter issues, verify:

- Your token has the correct permissions
- The repository path is correct
- The pickle files exist in the expected locations in your repository

## Project Structure

- `server.py`: Main Flask application
- `static/`: Static assets (CSS, JavaScript, images)
- `templates/`: HTML templates
- `requirements.txt`: Python dependencies
- `static/server_services/pythondata_infovis2015/`: Data files (pickle format)
