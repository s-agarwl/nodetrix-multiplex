# NodeTrix Multiplex

A Flask application for visualizing and analyzing network data using a NodeTrix-based approach for multiplex networks.

## Local Development

1. Create a virtual environment:

   ```
   python -m venv venv
   ```

2. Activate the virtual environment:

   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run the application:

   ```
   python server.py
   ```

5. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

## Deploying to Vercel

1. Install the Vercel CLI:

   ```
   npm install -g vercel
   ```

2. Login to Vercel:

   ```
   vercel login
   ```

3. Deploy the application:

   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

## Project Structure

- `server.py`: Main Flask application
- `api/index.py`: Entry point for Vercel deployment
- `static/`: Static files (CSS, JS, images)
- `templates/`: HTML templates
- `static/server_services/`: Data files and services

## Features

- Interactive visualization of multiplex networks
- Matrix-based representation of communities
- Multiple similarity metrics
- Various matrix operations (VAT, Laplacian, etc.)
- Focus+context exploration

## Requirements

- Python 3.6+
- Flask
- NumPy
- SciPy
- NetworkX
