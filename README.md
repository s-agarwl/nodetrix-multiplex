# NodeTrix Multiplex

A Flask application for visualizing and analyzing network data.

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

This README.md file is displayed on your project page. You should edit this
file to describe your project, including instructions for building and
running the project, pointers to the license under which you are making the
project available, and anything else you think would be useful for others to
know.

We have created an empty license.txt file for you. Well, actually, it says,
"<Replace this text with the license you've chosen for your project.>" We
recommend you edit this and include text for license terms under which you're
making your code available. A good resource for open source licenses is the
[Open Source Initiative](http://opensource.org/).

Be sure to update your project's profile with a short description and
eye-catching graphic.

Finally, consider defining some sprints and work items in Track & Plan to give
interested developers a sense of your cadence and upcoming enhancements.
