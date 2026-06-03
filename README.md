<h1 align="center">LiveZone TV | Live TV Streaming</h1>

<div align="center">

[![LIVE TV Streaming](https://img.shields.io/badge/Status-Live-brightgreen)](https://livezonetv.pages.dev/) [![Version](https://img.shields.io/badge/Version-1.0.0-green)](https://livezonetv.pages.dev/) [![License](https://img.shields.io/badge/License-MIT-yellow)](https://livezonetv.pages.dev/) [![Live Demo](https://img.shields.io/badge/Live%20Demo-https://livezonetv.pages.dev/-blue)](https://livezonetv.pages.dev/) 

*LiveZone TV is a fast, secure, and scalable Live TV Streaming Platform application built on React (Vite) and deployed through Cloudflare Pages & Workers. It uses Cloudflare D1 as its database layer and includes a complete admin dashboard for link and system management.*

*One of the biggest advantages of this project is that it runs entirely on Cloudflare’s free tier. <font color="green">Both Cloudflare Pages and D1 Database offer generous lifetime free usage</font>, making this solution extremely cost-effective for personal projects, startups, and production-ready deployments without any hosting expenses.*


</div>

---

## 🌐 Live Demo

Experience the full functionality of the **Live TV Streaming Platform** with all features available online!

**🚀 Web**: [https://livezonetv.pages.dev/](https://livezonetv.pages.dev/)


---

## ✨ Features


- **Modern UI/UX**
- **Responsive Design**
- **Admin Panel**
- **24/7 Updated Tv Links**
- **Unlimited Playlists Import**
- **Google Drive Links Supported**
- **Lifetime Free Server**


## 🧩 Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Cloudflare Pages Functions (Workers runtime)
- **Database:** Cloudflare D1 (SQLite)
- **Hosting:** Cloudflare Pages


---

## 🚀 Deployment Guide

Follow the steps below to deploy the project successfully using Cloudflare Pages & Workers.

---

### 1️⃣ Fork the Repository
- First, **fork this repository** to your own GitHub account.

---

### 2️⃣ Create a Free Cloudflare Account
- Sign up or log in at **https://cloudflare.com**.

---

### 3️⃣ Deploy via Cloudflare Pages

1. Go to **Cloudflare Dashboard**.
2. Navigate to:  
   **Compute → Pages & Workers → Create Application**
3. Click Looking to deploy Pages? **Get started** 
4. Select **Import an existing Git repository**
5. Connect your **GitHub account** & Then Select the **forked repository**.

---

### 4️⃣ Build Configuration

Use the following settings:

- **Framework Preset:** React (Vite)  
- **Build Command:**  
  ```
  npm install && npm run build
  ```
- **Output Directory:**  
  ```
  dist
  ```
- **Root Directory:**  
  ```
  /
  ```  
Add Environment Variables:

- **Variable Name:** `SKIP_DEPENDENCY_INSTALL`  
- **Value:** `true`  
- **Type:** Text  

Save the configuration and proceed with deployment.

---

The initial deployment will now be completed. After that, copy your project URL. it will look like **name.pages.dev**. Then, open the **.env.production** file in your GitHub repository and replace the existing project link with your new project URL. Once saved, the project will automatically trigger a new deployment.

---

## 🗄️ Database Setup (Cloudflare D1)

After the project is successfully deployed, follow these steps:

### 5️⃣ Create D1 Database

1. Navigate to:  
   **Storage & Databases → D1**
2. Click **Create Database**
3. Configure as follows:
   - **Database Name:** `livezone-db`
   - **Location:** Default / automatic location
4. Now Copy your **Database UUID** and paste it into Github Repo -> `/wrangler.jsonc` file in the `"database_id"` field.

---

### 6️⃣ Import Database Schema

1. Open your newly created database.
2. Click **Explore Data**.
3. In the query editor:
   - Open the file: `public/Schema.sql`
   - Copy **full schema**
   - Paste it into the query field
   - Click **Run all** from **Dropdown**

---

### 7️⃣ Bind the Database to Your Project

1. Navigate to:  
   **Compute → Pages & Workers**
2. Select your deployed project.
3. Go to **Settings → Bindings**
4. Click **Add Binding**
5. Choose **D1 Database**
6. Configure:
   - **Variable Name:** `DB`
   - **Database:** `livezone-db`
7. Save changes.

---

## ✅ Deployment Complete

Visit your deployed website. The application should now be fully functional.

### 🔐 Admin Panel

- Admin URL:  
  ```
  https://your-deployed-url/admin
  ```
- **Default Credentials:**
  - Username: `admin`
  - Password: `admin`

You can now log in and start managing the system.

---


## 🎯 Usage Guide

Good luck😴

## 💡 Feature Requests



Have an idea? We'd love to hear it:



1. **Check existing requests**

2. **Create a new issue** with:

   - Detailed description

   - Use case explanation

   - Potential implementation ideas




---

## 🤝 Contributing

I built this for myself, but I'd love to see what you can add! Here's how to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request🎯

<div align="center">

[Star](https://github.com/BotolMehedi/live-tv-streaming-platform/stargazers) | [Issue](https://github.com/BotolMehedi/live-tv-streaming-platform/issues) | [Discussion](https://github.com/BotolMehedi/live-tv-streaming-platform/discussions)

</div>

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use this freely, modify it, sell it, whatever. Just don't blame me if something ______!😪

---

## ⚠️ Disclaimer

This tool is created for educational and research purposes only. Do not use it for any illegal activities. The creator is not responsible for any misuse, damage, or legal consequences caused by the use of this tool. By using this project, you agree that you are doing so at your own risk and for learning purposes only.

---

<div align="center">

### 🌟 Star this repo if you find it helpful!

[Portfolio](https://mehedi.fun) | [Email](mailto:hello@mehedi.fun) | [Github](https://github.com/BotolMehedi)

**Made with ❤️ and lots of 💦 by [BotolMehedi](https://github.com/BotolMehedi)**
