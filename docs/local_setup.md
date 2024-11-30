# Prerequisites
- Node v18

# How to run locally

1. Install Firebase CLI:
```npm install -g firebase-tools```

2. Log in to Firebase:
```firebase login```

3. Navigate to your project folder:
Change directory to your project root folder (the folder that contains both client/metacharacters-app and functions).
```cd metacharactersai```

4. Install dependencies:
Navigate to your functions folder and install dependencies:
```bash
cd functions
npm install
```

5. Similarly, navigate to your client/metacharacters-app folder and install dependencies:

```bash
cd ../client/metacharacters-app
npm install
```

6. Start web app in dev mode
```bash
npm run dev
```

7. Serve your project:
```bash
cd ../../
firebase emulators:start
```

This command will start the Firebase emulators for Firestore, Realtime Database, Authentication, Hosting, and Functions if they are configured in your firebase.json file.

If your firebase.json is set up correctly, this will serve your frontend and backend locally. You should be able to access your frontend at http://localhost:5002 and your functions at http://localhost:5001 (or whatever ports are configured in your firebase.json).

Note: Make sure your firebase.json is properly configured to specify the hosting and functions settings. Here's an example configuration:

```js
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs16"
  },
  "hosting": {
    "site": "metacharacters",
    "public": "client/charactersai-app/dist"
  },
  "emulators": {
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5002
    },
    "auth": {
      "port": 5003
    },
    "ui": {
      "enabled": true
    },
    "singleProjectMode": true
  }
}

```





