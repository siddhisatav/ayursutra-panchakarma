# 🚀 Installation Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

## Step-by-Step Installation

### Step 1: Navigate to Project Directory
```bash
cd "C:\Users\Hp\Desktop\Final year project\ayursutra-panchakarma"
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React and React DOM
- React Router DOM
- Chart.js and react-chartjs-2
- Lucide React (icons)
- Tailwind CSS
- Vite
- And all other dependencies

**Expected time**: 2-3 minutes

### Step 3: Start Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 4: Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

## 🎉 Success!

You should now see the AyurSutra Panchakarma login page.

## 🔐 Test Login

Use these credentials to test:

**Patient Account:**
- Email: `patient@ayur.com`
- Password: `patient123`

**Therapist Account:**
- Email: `therapist@ayur.com`
- Password: `therapist123`

**Practitioner Account:**
- Email: `practitioner@ayur.com`
- Password: `practitioner123`

## 📦 Build for Production

When ready to deploy:
```bash
npm run build
```

Output will be in the `dist/` folder.

## 🐛 Troubleshooting

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue: Port 5173 already in use
**Solution**: Vite will automatically use the next available port (5174, 5175, etc.)

### Issue: Dependencies not installing
**Solution**: 
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build errors
**Solution**: Ensure Node.js version is 16 or higher
```bash
node --version
```

## 📁 Project Structure

After installation, your project will have:
```
ayursutra-panchakarma/
├── node_modules/          (installed dependencies)
├── public/                (static assets)
├── src/                   (source code)
├── dist/                  (production build - after npm run build)
├── package.json           (project configuration)
└── ...config files
```

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. ✅ Login with demo credentials
4. ✅ Explore all three user roles
5. ✅ Test appointment booking
6. ✅ Try dark mode toggle
7. ✅ Check responsive design

## 📚 Additional Resources

- **README.md** - Complete documentation
- **QUICKSTART.md** - Quick start guide
- **FEATURES.md** - Feature checklist
- **ARCHITECTURE.md** - Component architecture
- **PROJECT_SUMMARY.md** - Project overview

## 💡 Tips

- Keep the terminal open while developing
- Changes will hot-reload automatically
- Check browser console for any errors
- Use browser DevTools to inspect localStorage

## 🎊 You're All Set!

Enjoy exploring AyurSutra Panchakarma! 🌿

---

**Need Help?**
- Check the documentation files
- Review code comments
- Inspect browser console
- Check terminal output
