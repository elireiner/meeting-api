# Meeting api!

This is the api for the meeting app

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Prepare for deployment

1. Reduce console logging to minimum
2. Confirm node version with `node --version`, and update engines in package.json
3. Run `npm audit`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.